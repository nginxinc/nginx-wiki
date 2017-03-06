
.. meta::
   :description: A sample NGINX configuration for Qwebric.

Qwebric
=======

`Qwebirc <https://qwebirc.org/>`_ is a fast, easy to use, free and open source IRC client designed by and originally just for the `QuakeNet IRC network <https://www.quakenet.org/>`_. Released in 2009, it's a `python <https://www.python.org>`_ written web-based IRC client. It also has a fork, `iris <https://github.com/atheme-legacy/iris>`_, developed by the `Atheme <http://atheme.net/>`_ IRC services team, and provides better integration with Atheme's IRC services. Qwebirc uses its own embedded webserver utilizing non-blocking multiplexing, and can cope with thousands of users easily. Because of this, there are two methods which can be used to direct clients to a qwebirc instance via `NGINX <http://nginx.org>`_: redirection, or reverse proxy.

Recipe
------

Redirect Method
^^^^^^^^^^^^^^^

Because qwebirc is meant to be run on its own port, you can use a redirect to send requests to qwebirc's embedded webserver. Your `server <http://nginx.org/en/docs/http/ngx_http_core_module.html#server>`_ block would look something like (substituting 8080 for whatever port you're using):

.. code-block:: nginx

    server {
        listen 127.0.0.1:80;
        listen [::1]:80;
        server_name webchat.domain.tld;
        return 301 $scheme://webchat.domain.tld:8080$request_uri;
    }

This would take any requests for webchat.domain.tld, and redirect it to webchat.domain.tld:8080, and would also append any `request URI's <http://nginx.org/en/docs/http/ngx_http_core_module.html#variables>`_ to the rewrite.

Reserve Proxy Method
^^^^^^^^^^^^^^^^^^^^

It is also possible to reverse proxy qwebirc from NGINX, hiding the port number in the address bar, and using NGINX as the frontend. To do this, you would first set up a server block to look like:

.. code-block:: nginx

    server {
        listen 127.0.0.1:80;
        listen [::1]:80;

        server_name webchat.domain.tld;

        access_log /home/web/log/qwebirc.access.log;
        error_log /home/web/log/qwebirc.error.log;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;

        location / {
            proxy_pass http://127.0.0.1:9090;
        }
    }

This will forward the client's real IP address to qwebirc, for a CGI:IRC/WebIRC type setup.
Next, you should modify your config.py (or iris.conf if you're using iris) to contain the following:

.. code-block:: ini

    ARGS = -i 127.0.0.1 -p 9090
    BASE_URL = "http://webchat.domain.tld/"
    FORWARDED_FOR_HEADER="x-forwarded-for"
    FORWARDED_FOR_IPS=["127.0.0.1"]

Note that all of the above will already be in your config.py or iris.conf, so rather than just appending your configuration file with the above, you should find the options inside your config and uncomment/change them to the above. As well, iris's config format differs slightly from the above, using "``args:`` " instead of "``ARGS =`` ", and such.

Once you've modified your qwebirc/iris config, you can (clean, if you've already compiled) compile and run it.

