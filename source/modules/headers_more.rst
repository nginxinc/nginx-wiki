Headers More
============

Name
----

**ngx_headers_more** - Set and clear input and output headers...more than "add"!

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions`_.

Version
-------

This document describes headers-more-nginx-module `v0.25 <http://github.com/agentzh/headers-more-nginx-module/tags>`_ released on 10 January 2014.

Synopsis
--------

.. code-block:: nginx

  # set the Server output header
  more_set_headers 'Server: my-server';

  # set and clear output headers
  location /bar {
      more_set_headers 'X-MyHeader: blah' 'X-MyHeader2: foo';
      more_set_headers -t 'text/plain text/css' 'Content-Type: text/foo';
      more_set_headers -s '400 404 500 503' -s 413 'Foo: Bar';
      more_clear_headers 'Content-Type';
      
      # your proxy_pass/memcached_pass/or any other config goes here...
  }

  # set output headers
  location /type {
      more_set_headers 'Content-Type: text/plain';
      # ...
  }

  # set input headers
  location /foo {
      set $my_host 'my dog';
      more_set_input_headers 'Host: $my_host';
      more_set_input_headers -t 'text/plain' 'X-Foo: bah';
     
      # now $host and $http_host have their new values...
      # ...
  }

  # replace input header X-Foo *only* if it already exists
  more_set_input_headers -r 'X-Foo: howdy';

Description
-----------

This module allows you to add, set, or clear any output
or input header that you specify.

This is an enhanced version of the standard
`headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module because it provides more utilities like
resetting or clearing "builtin headers" like ``Content-Type``,
``Content-Length``, and ``Server``.

It also allows you to specify an optional HTTP status code
criteria using the ``-s`` option and an optional content
type criteria using the ``-t`` option while modifying the
output headers with the more_set_headers_ and
more_clear_headers_ directives. For example,

.. code-block:: nginx

  more_set_headers -s 404 -t 'text/html' 'X-Foo: Bar';

Input headers can be modified as well. For example

.. code-block:: nginx

  location /foo {
      more_set_input_headers 'Host: foo' 'User-Agent: faked';
      # now $host, $http_host, $user_agent, and
      #   $http_user_agent all have their new values.
  }



The option ``-t`` is also available in the
more_set_input_headers_ andmore_clear_input_headers_ directives (for request header filtering) while the ``-s`` option is not allowed.

Unlike the standard `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module, this module's directives will by
default apply to all the status codes, including ``4xx`` and ``5xx``.

Directives
----------

more_set_headers
^^^^^^^^^^^^^^^^

:Syntax: ``more_set_headers [-t <``\ *content-type list*\ ``>]... [-s <``\ *status-code list*\ ``>]... <``\ *new-header*\ ``>...``
:Default: *none*
:Context: *http, server, location, location if*
:Phase: *output-header-filter*

Replaces (if any) or adds (if not any) the specified output headers when the response status code matches the codes specified by the ``-s`` option *AND* the response content type matches the types specified by the ``-t`` option.

If either ``-s`` or ``-t`` is not specified or has an empty list value, then no match is required. Therefore, the following directive set the ``Server`` output header to the custom value for *any* status code and *any* content type:

.. code-block:: nginx

  more_set_headers    "Server: my_server";

Existing response headers with the same name are always overridden. If you want to add headers incrementally, use the standard `add_header <http://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header>`_ directive instead.

A single directive can set/add multiple output headers. For example

.. code-block:: nginx

  more_set_headers 'Foo: bar' 'Baz: bah';

Multiple occurrences of the options are allowed in a single directive. Their values will be merged together. For instance

.. code-block:: nginx

  more_set_headers -s 404 -s '500 503' 'Foo: bar';

is equivalent to

.. code-block:: nginx

  more_set_headers -s '404 500 503' 'Foo: bar';

The new header should be the one of the forms:

# ``Name: Value``
# ``Name: ``
# ``Name``

The last two effectively clear the value of the header ``Name``.

Nginx variables are allowed in header values. For example:

.. code-block:: nginx

  set $my_var "dog";
  more_set_headers "Server: $my_var";

But variables won't work in header keys due to performance considerations.

Multiple set/clear header directives are allowed in a single location, and they're executed sequentially.

Directives inherited from an upper level scope (say, http block or server blocks) are executed before the directives in the location block.

Note that although ``more_set_headers`` is allowed in *location* if blocks, it is *not* allowed in the *server* if blocks, as in

.. code-block:: nginx

  ?  # This is NOT allowed!
  ?  server {
  ?      if ($args ~ 'download') {
  ?          more_set_headers 'Foo: Bar';
  ?      }
  ?      ...
  ?  }

Behind the scene, use of this directive and its friend more_clear_headers_ will (lazily) register an ouput header filter that modifies ``r->headers_out`` the way you specify.

more_clear_headers
^^^^^^^^^^^^^^^^^^

:Syntax: ``more_clear_headers [-t <``\ *content-type list*\ ``>]... [-s <``\ *status-code list*\ ``>]... <``\ *new-header*\ ``>...``
:Default: *none*
:Context: *http, server, location, location if*
:Phase: *output-header-filter*

Clears the specified output headers.

In fact,

.. code-block:: nginx

  more_clear_headers -s 404 -t 'text/plain' Foo Baz;

is exactly equivalent to

.. code-block:: nginx

  more_set_headers -s 404 -t 'text/plain' "Foo: " "Baz: ";

or

.. code-block:: nginx

  more_set_headers -s 404 -t 'text/plain' Foo Baz

See more_set_headers_ for more details.

Wildcard ``*`` can also be used to specify a header name pattern. For example, the following directive effectively clears *any* output headers starting by "``X-Hidden-``":

.. code-block:: nginx

  more_clear_headers 'X-Hidden-*';

The ``*`` wildcard support was first introduced in `v0.09 <http://github.com/agentzh/headers-more-nginx-module/tags>`_.

more_set_input_headers
^^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``more_set_input_headers [-r] [-t <``\ *content-type list*\ ``>]... <``\ *new-header*\ ``>...``
:Default: *none*
:Context: *http, server, location, location if*
:Phase: *rewrite tail*

Very much like more_set_headers_ except that it operates on input headers (or request headers) and it only supports the ``-t`` option.

Note that using the ``-t`` option in this directive means filtering by the ``Content-Type`` *request* header, rather than the response header.

Behind the scene, use of this directive and its friend more_clear_input_headers_ will (lazily) register a ``rewrite phase`` handler that modifies ``r->headers_in`` the way you specify. Note that it always run at the *end* of the ``rewrite`` so that it runs *after* the standard `rewrite module <http://nginx.org/en/docs/http/ngx_http_rewrite_module.html>`_ and works in subrequests as well.

If the ``-r`` option is specified, then the headers will be replaced to the new values *only if* they already exist.

more_clear_input_headers
^^^^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``more_clear_input_headers [-t <``\ *content-type list*\ ``>]... <``\ *new-header*\ ``>...``
:Default: *none*
:Context: *http, server, location, location if*
:Phase: *rewrite tail*

Clears the specified input headers.

In fact,

.. code-block:: nginx

  more_clear_input_headers -s 404 -t 'text/plain' Foo Baz;

is exactly equivalent to

.. code-block:: nginx

  more_set_input_headers -s 404 -t 'text/plain' "Foo: " "Baz: ";

or

.. code-block:: nginx

  more_set_input_headers -s 404 -t 'text/plain' Foo Baz

See more_set_input_headers_ for more details.

Limitations
-----------

* Unlike the standard `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module, this module does not automatically take care of the constraint among the ``Expires``, ``Cache-Control``, and ``Last-Modified`` headers. You have to get them right yourself or use the `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module together with this module.
* You cannot remove the ``Connection`` response header using this module because the ``Connection`` response header is generated by the standard ``ngx_http_header_filter_module`` in the Nginx core, whose output header filter runs always *after* the filter of this module. The only way to actually remove the ``Connection`` header is to patch the Nginx core, that is, editing the C function ``ngx_http_header_filter`` in the ``src/http/ngx_http_header_filter_module.c`` file.

.. _installation instructions: 

Installation
------------

Grab the nginx source code from `nginx.org <http://nginx.org/>`_, for example,
the version 1.7.7 (see `nginx compatibility`_), and then build the source with this module:

.. code-block:: bash

  wget 'http://nginx.org/download/nginx-1.7.7.tar.gz'
  tar -xzvf nginx-1.7.7.tar.gz
  cd nginx-1.7.7/

  # Here we assume you would install you nginx under /opt/nginx/.
  ./configure --prefix=/opt/nginx \
      --add-module=/path/to/headers-more-nginx-module
   
  make
  make install



Download the latest version of the release tarball of this module from `headers-more-nginx-module file list <http://github.com/agentzh/headers-more-nginx-module/tags>`_.

Also, this module is included and enabled by default in the `ngx_openresty bundle <http://openresty.org>`_.

.. _nginx compatibility:

Compatibility
-------------

The following versions of Nginx should work with this module:

* **1.7.x**                       (last tested: 1.7.7)
* **1.6.x**                       (last tested: 1.6.2)
* **1.5.x**                       (last tested: 1.5.8)
* **1.4.x**                       (last tested: 1.4.4)
* **1.3.x**                       (last tested: 1.3.7)
* **1.2.x**                       (last tested: 1.2.9)
* **1.1.x**                       (last tested: 1.1.5)
* **1.0.x**                       (last tested: 1.0.11)
* **0.9.x**                       (last tested: 0.9.4)
* **0.8.x**                       (last tested: 0.8.54)
* **0.7.x >= 0.7.44**             (last tested: 0.7.68)

Earlier versions of Nginx like 0.6.x and 0.5.x will *not* work.

If you find that any particular version of Nginx above 0.7.44 does not work with this module, please consider `reporting a bug`_.

.. _OpenResty community:

Community
---------

English Mailing List
^^^^^^^^^^^^^^^^^^^^

The `openresty-en <https://groups.google.com/group/openresty-en>`_ mailing list is for English speakers.

Chinese Mailing List
^^^^^^^^^^^^^^^^^^^^

The `openresty <https://groups.google.com/group/openresty>`_ mailing list is for Chinese speakers.

.. _reporting a bug:

Bugs and Patches
----------------

Please submit bug reports, wishlists, or patches by

# creating a ticket on the `GitHub Issue Tracker <http://github.com/chaoslawful/lua-nginx-module/issues>`_,
# or posting to the `OpenResty community`_.

.. _source repository: 

Source Repository
-----------------

Available on github at `agentzh/headers-more-nginx-module <http://github.com/agentzh/headers-more-nginx-module>`_.

Changes
-------

The changes of every release of this module can be obtained from the ngx_openresty bundle's change logs:

http://openresty.org/#Changes

Test Suite
----------

This module comes with a Perl-driven test suite. The `test cases <http://github.com/agentzh/headers-more-nginx-module/tree/master/t/>`_ are
`declarative <http://github.com/agentzh/headers-more-nginx-module/blob/master/t/sanity.t>`_ too. Thanks to the `Test::Nginx <http://search.cpan.org/perldoc?Test::Nginx>`_ module in the Perl world.

To run it on your side:

.. code-block:: bash

  $ PATH=/path/to/your/nginx-with-headers-more-module:$PATH prove -r t

To run the test suite with valgrind's memcheck, use the following commands:

.. code-block:: bash

  $ export PATH=/path/to/your/nginx-with-headers-more-module:$PATH
  $ TEST_NGINX_USE_VALGRIND=1 prove -r t


You need to terminate any Nginx processes before running the test suite if you have changed the Nginx server binary.

Because a single nginx server (by default, ``localhost:1984``) is used across all the test scripts (``.t`` files), it's meaningless to run the test suite in parallel by specifying ``-jN`` when invoking the ``prove`` utility.

Some parts of the test suite requires modules `proxy <http://nginx.org/en/docs/http/ngx_http_proxy_module.html>`_, `rewrite <http://nginx.org/en/docs/http/ngx_http_rewrite_module.html>`_, and :doc:`echo <echo>` to be enabled as well when building Nginx.

TODO
----

* Support variables in new headers' keys.

Getting involved
----------------

You'll be very welcomed to submit patches to the author_ or just ask for a commit bit to the `source repository`_ on GitHub.

.. _author:

Authors
-------

* Yichun "agentzh" Zhang (章亦春) *<agentzh@gmail.com>*, CloudFlare Inc.
* Bernd Dorn ( http://www.lovelysystems.com/ )

This wiki page is also maintained by the author himself, and everybody is encouraged to improve this page as well.

Copyright & License
-------------------

The code base is borrowed directly from the standard `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module in Nginx 0.8.24. This part of code is copyrighted by Igor Sysoev.

Copyright (c) 2009-2014, Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

Copyright (c) 2010-2013, Bernd Dorn.

This module is licensed under the terms of the BSD license.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

See Also
--------

* The original thread on the Nginx mailing list that inspires this module's development: `"A question about add_header replication" <http://forum.nginx.org/read.php?2,11206,11738>`_.
* The orginal announcement thread on the Nginx mailing list: `"The "headers_more" module: Set and clear output headers...more than 'add'!" <http://forum.nginx.org/read.php?2,23460>`_.
* The original `blog post <http://agentzh.blogspot.com/2009/11/headers-more-module-scripting-input-and.html>`_ about this module's initial development.
* The :doc:`echo module <echo>` for Nginx module's automated testing.
* The standard `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module.
