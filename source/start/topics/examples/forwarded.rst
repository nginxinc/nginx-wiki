
.. meta::
   :description: NGINX configuration and caveats for deploying the Forwarded header.

Using the ``Forwarded`` header
==============================

Traditionally, an HTTP reverse proxy uses non-standard headers to inform the upstream server about the user's IP address and other request properties::

    X-Forwarded-For: 12.34.56.78, 23.45.67.89
    X-Real-IP: 12.34.56.78
    X-Forwarded-Host: example.com
    X-Forwarded-Proto: https

NGINX even provides a `$proxy_add_x_forwarded_for`_ variable to automatically append `$remote_addr`_ to any incoming ``X-Forwarded-For`` headers.

.. _$proxy_add_x_forwarded_for:
   http://nginx.org/en/docs/http/ngx_http_proxy_module.html#var_proxy_add_x_forwarded_for
.. _$remote_addr:
   http://nginx.org/en/docs/http/ngx_http_core_module.html#var_remote_addr

`RFC 7239`_ standardizes a new ``Forwarded`` header to carry this information in a more organized way::

    Forwarded: for=12.34.56.78;host=example.com;proto=https, for=23.45.67.89

.. _RFC 7239: https://tools.ietf.org/html/rfc7239

The major benefit of ``Forwarded`` is extensibility. For example, with ``X-Forwarded-For``, you don't know which IP address to trust without hardcoded rules such as "take the 2nd last IP address, but only if the request comes from 10.0.0.0/8". Whereas with ``Forwarded``, your trusted front-end proxy could include a secret token to identify itself::

    Forwarded: for=12.34.56.78, for=23.45.67.89;secret=egah2CGj55fSJFs, for=10.1.2.3


How to use it in NGINX
----------------------

NGINX does not provide a built-in ``$proxy_add_forwarded`` variable like it does ``$proxy_add_x_forwarded_for``, but you can **partially** emulate it in config:

.. code-block:: nginx

    map $remote_addr $proxy_forwarded_elem {
        # IPv4 addresses can be sent as-is
        ~^[0-9.]+$          "for=$remote_addr";

        # IPv6 addresses need to be bracketed and quoted
        ~^[0-9A-Fa-f:.]+$   "for=\"[$remote_addr]\"";

        # Unix domain socket names cannot be represented in RFC 7239 syntax
        default             "for=unknown";
    }

    map $http_forwarded $proxy_add_forwarded {
        # If the incoming Forwarded header is syntactically valid, append to it
        "~^(,[ \\t]*)*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*([ \\t]*,([ \\t]*([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?(;([!#$%&'*+.^_`|~0-9A-Za-z-]+=([!#$%&'*+.^_`|~0-9A-Za-z-]+|\"([\\t \\x21\\x23-\\x5B\\x5D-\\x7E\\x80-\\xFF]|\\\\[\\t \\x21-\\x7E\\x80-\\xFF])*\"))?)*)?)*$" "$http_forwarded, $proxy_forwarded_elem";

        # Otherwise, replace it
        default "$proxy_forwarded_elem";
    }

Then, in your ``proxy_pass`` block, you can say:

.. code-block:: nginx

    proxy_set_header Forwarded $proxy_add_forwarded;

You can also append extra parameters there:

.. code-block:: nginx

    proxy_set_header Forwarded "$proxy_add_forwarded;proto=$scheme";

.. warning::

    Until `ticket #1316`_ is addressed, this solution **does not support** multiple incoming ``Forwarded`` headers. For example, if the request has::

        Forwarded: for=1.2.3.4
        Forwarded: for=5.6.7.8

    then ``$proxy_add_forwarded`` as defined above will produce::

        Forwarded: for=1.2.3.4, for=9.10.11.12

    This is in contrast to ``$proxy_add_x_forwarded_for``, which **does** correctly join multiple incoming headers.

    .. _ticket #1316: https://trac.nginx.org/nginx/ticket/1316


Dealing with invalid headers
----------------------------

That humongous regex in ``map $http_forwarded`` above matches all syntactically valid ``Forwarded`` headers. It ensures that NGINX does not blindly append to a malformed header. Otherwise, an external attacker could send something like::

    Forwarded: for=injected;by="

and then NGINX would produce::

    Forwarded: for=injected;by=", for=real

Depending on how your upstream server parses such a ``Forwarded``, it may or may not see the ``for=real`` element. (Unlike with ``X-Forwarded-For``, it can't just split on comma, because a comma can occur inside a valid quoted string.)

If you know that your upstream handles this correctly, then you can drop that syntax check and pass invalid elements on, which may be helpful for interoperability, upstream logging etc.:

.. code-block:: nginx

    map $http_forwarded $proxy_add_forwarded {
        ""      "$proxy_forwarded_elem";
        default "$http_forwarded, $proxy_forwarded_elem";
    }


Coexistence with ``X-Forwarded-*``
----------------------------------

The above solution cannot "upgrade" legacy ``X-Forwarded-*`` headers to the new ``Forwarded`` format. Depending on your situation, you probably should either continue to pass them on:

.. code-block:: nginx

    proxy_set_header Forwarded $proxy_add_forwarded;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

or actively remove them to avoid confusing upstream:

.. code-block:: nginx

    proxy_set_header Forwarded $proxy_add_forwarded;
    proxy_set_header X-Forwarded-For "";
