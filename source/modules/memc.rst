Memc
====

Name
----
**ngx_memc** - An extended version of the standard memcached module that supports set, add, delete, and many more memcached commands.

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <memc.installation_>`_.

Version
-------
This document describes ngx_memc :github:`v0.15 <openresty/memc-nginx-module/tags>` released on 8 July 2014.

Synopsis
--------
.. code-block:: nginx

  # GET /foo?key=dog
  #
  # POST /foo?key=cat
  # Cat's value...
  #
  # PUT /foo?key=bird
  # Bird's value...
  #
  # DELETE /foo?key=Tiger
  location /foo {
      set $memc_key $arg_key;

      # $memc_cmd defaults to get for GET,
      #   add for POST, set for PUT, and
      #   delete for the DELETE request method.

      memc_pass 127.0.0.1:11211;
  }


.. code-block:: nginx

  # GET /bar?cmd=get&key=cat
  #
  # POST /bar?cmd=set&key=dog
  # My value for the "dog" key...
  #
  # DELETE /bar?cmd=delete&key=dog
  # GET /bar?cmd=delete&key=dog
  location /bar {
      set $memc_cmd $arg_cmd;
      set $memc_key $arg_key;
      set $memc_flags $arg_flags; # defaults to 0
      set $memc_exptime $arg_exptime; # defaults to 0

      memc_pass 127.0.0.1:11211;
  }
  

.. code-block:: nginx

  # GET /bar?cmd=get&key=cat
  # GET /bar?cmd=set&key=dog&val=animal&flags=1234&exptime=2
  # GET /bar?cmd=delete&key=dog
  # GET /bar?cmd=flush_all
  location /bar {
      set $memc_cmd $arg_cmd;
      set $memc_key $arg_key;
      set $memc_value $arg_val;
      set $memc_flags $arg_flags; # defaults to 0
      set $memc_exptime $arg_exptime; # defaults to 0

      memc_cmds_allowed get set add delete flush_all;

      memc_pass 127.0.0.1:11211;
  }


.. code-block:: nginx

  http {
    ...
    upstream backend {
       server 127.0.0.1:11984;
       server 127.0.0.1:11985;
    }
    server {
        location /stats {
            set $memc_cmd stats;
            memc_pass backend;
        }
        ...
    }
  }
  ...


.. code-block:: nginx

  # read the memcached flags into the Last-Modified header
  # to respond 304 to conditional GET
  location /memc {
      set $memc_key $arg_key;

      memc_pass 127.0.0.1:11984;

      memc_flags_to_last_modified on;
  }


.. code-block:: nginx

  location /memc {
      set $memc_key foo;
      set $memc_cmd get;

      # access the unix domain socket listend by memcached
      memc_pass unix:/tmp/memcached.sock;
  }


Description
-----------
This module extends the standard `memcached module <http://nginx.org/en/docs/http/ngx_http_memcached_module.html>`_ to support almost the whole `memcached ascii protocol <https://github.com/memcached/memcached/blob/master/doc/protocol.txt>`_.

It allows you to define a custom `REST <https://en.wikipedia.org/wiki/REST>`_ interface to your memcached servers or access memcached in a very efficient way from within the nginx server by means of subrequests or `independent fake requests <srlindsay/nginx-independent-subrequest>`.

This module is not supposed to be merged into the Nginx core because I've used `Ragel <http://www.colm.net/open-source/ragel/>`_ to generate the memcached response parsers (in C) for joy :)

If you are going to use this module to cache location responses out of the box, try :doc:`sr_cache` with this module to achieve that.

When used in conjunction with :doc:`lua`, it is recommended to use the :github:`lua-resty-memcached <openresty/lua-resty-memcached>` library instead of this module though, because the former is much more flexible and memory-efficient.


Keep-alive connections to memcached servers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
You need http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive together with this module for keep-alive TCP connections to your backend memcached servers.

Here's a sample configuration:

.. code-block:: nginx

  http {
    upstream backend {
      server 127.0.0.1:11211;

      # a pool with at most 1024 connections
      # and do not distinguish the servers:
      keepalive 1024;
    }

    server {
        ...
        location /memc {
            set $memc_cmd get;
            set $memc_key $arg_key;
            memc_pass backend;
        }
    }
  }


How it works
^^^^^^^^^^^^
It implements the memcached TCP protocol all by itself, based upon the ``upstream`` mechanism. Everything involving I/O is non-blocking.

The module itself does not keep TCP connections to the upstream memcached servers across requests, just like other upstream modules. For a working solution, see section `Keep-alive connections to memcached servers`_.


Memcached commands supported
----------------------------
The memcached storage commands [[#set $memc_key $memc_flags $memc_exptime $memc_value|set]], [[#add $memc_key $memc_flags $memc_exptime $memc_value|add]], [[#replace $memc_key $memc_flags $memc_exptime $memc_value|replace]], [[#prepend $memc_key $memc_flags $memc_exptime $memc_value|prepend]], and [[#append $memc_key $memc_flags $memc_exptime $memc_value|append]] uses the ``$memc_key`` as the key, ``$memc_exptime`` as the expiration time (or delay) (defaults to 0), ``$memc_flags`` as the flags (defaults to 0), to build the corresponding memcached queries.

If ``$memc_value`` is not defined at all, then the request body will be used as the value of the ``$memc_value`` except for the [[#incr $memc_key $memc_value|incr]] and [[#decr $memc_key $memc_value|decr]] commands. Note that if ``$memc_value`` is defined as an empty string (``""``), that empty string will still be used as the value as is.

The following memcached commands have been implemented and tested (with their parameters marked by corresponding
nginx variables defined by this module):


get $memc_key
^^^^^^^^^^^^^
Retrieves the value using a key.

.. code-block:: nginx

  location /foo {
      set $memc_cmd 'get';
      set $memc_key 'my_key';
      
      memc_pass 127.0.0.1:11211;
      
      add_header X-Memc-Flags $memc_flags;
  }


Returns ``200 OK`` with the value put into the response body if the key is found, or ``404 Not Found`` otherwise. The ``flags`` number will be set into the ``$memc_flags`` variable so it's often desired to put that info into the response headers by means of the standard [[HttpHeadersModule#add_header|add_header directive]].

It returns ``502`` for ``ERROR``, ``CLIENT_ERROR``, or ``SERVER_ERROR``.


set $memc_key $memc_flags $memc_exptime $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
To use the request body as the memcached value, just avoid setting the ``$memc_value`` variable:

.. code-block:: nginx

  # POST /foo
  # my value...
  location /foo {
      set $memc_cmd 'set';
      set $memc_key 'my_key';
      set $memc_flags 12345;
      set $memc_exptime 24;
      
      memc_pass 127.0.0.1:11211;
  }


Or let the ``$memc_value`` hold the value:

.. code-block:: nginx

  location /foo {
      set $memc_cmd 'set';
      set $memc_key 'my_key';
      set $memc_flags 12345;
      set $memc_exptime 24;
      set $memc_value 'my_value';

      memc_pass 127.0.0.1:11211;
  }


Returns ``201 Created`` if the upstream memcached server replies ``STORED``, ``200`` for ``NOT_STORED``, ``404`` for ``NOT_FOUND``, ``502`` for ``ERROR``, ``CLIENT_ERROR``, or ``SERVER_ERROR``.

The original memcached responses are returned as the response body except for ``404 NOT FOUND``.


add $memc_key $memc_flags $memc_exptime $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].


replace $memc_key $memc_flags $memc_exptime $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].


append $memc_key $memc_flags $memc_exptime $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].

Note that at least memcached version 1.2.2 does not support the "append" and "prepend" commands. At least 1.2.4 and later versions seem to supports these two commands.


prepend $memc_key $memc_flags $memc_exptime $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to the [[#append $memc_key $memc_flags $memc_exptime $memc_value|append command]].


delete $memc_key
^^^^^^^^^^^^^^^^
Deletes the memcached entry using a key.

.. code-block:: nginx

  location /foo
      set $memc_cmd delete;
      set $memc_key my_key;
      
      memc_pass 127.0.0.1:11211;
  }


Returns ``200 OK`` if deleted successfully, ``404 Not Found`` for ``NOT_FOUND``, 
or ``502`` for ``ERROR``, ``CLIENT_ERROR``, or ``SERVER_ERROR``.

The original memcached responses are returned as the response body except for 
``404 NOT FOUND``.


delete $memc_key $memc_exptime
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to the `delete $memc_key`_ command except it accepts an optional 
``expiration`` time specified by the ``$memc_exptime`` variable.

This command is no longer available in the latest memcached version 1.4.4.


incr $memc_key $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^
Increments the existing value of ``$memc_key`` by the amount specified by 
``$memc_value``:

.. code-block:: nginx

  location /foo {
      set $memc_key my_key;
      set $memc_value 2;
      memc_pass 127.0.0.1:11211;
  }


In the preceding example, every time we access ``/foo`` will cause the value of 
``my_key`` increments by ``2``.

Returns ``200 OK`` with the new value associated with that key as the response 
body if successful, or ``404 Not Found`` if the key is not found.

It returns ``502`` for ``ERROR``, ``CLIENT_ERROR``, or ``SERVER_ERROR``.


decr $memc_key $memc_value
^^^^^^^^^^^^^^^^^^^^^^^^^^
Similar to `incr $memc_key $memc_value`_.


flush_all
^^^^^^^^^
Mark all the keys on the memcached server as expired:

.. code-block:: nginx

  location /foo {
      set $memc_cmd flush_all;
      memc_pass 127.0.0.1:11211;
  }


flush_all $memc_exptime
^^^^^^^^^^^^^^^^^^^^^^^
Just like flush_all_ but also accepts an expiration time specified by the 
``$memc_exptime`` variable.


stats
^^^^^
Causes the memcached server to output general-purpose statistics and settings

.. code-block:: nginx

  location /foo {
      set $memc_cmd stats;
      memc_pass 127.0.0.1:11211;
  }


Returns ``200 OK`` if the request succeeds, or 502 for ``ERROR``, ``CLIENT_ERROR``, 
or ``SERVER_ERROR``.

The raw ``stats`` command output from the upstream memcached server will be put 
into the response body. 


version
^^^^^^^
Queries the memcached server's version number:

.. code-block:: nginx

  location /foo {
      set $memc_cmd version;
      memc_pass 127.0.0.1:11211;
  }


Returns ``200 OK`` if the request succeeds, or 502 for ``ERROR``, ``CLIENT_ERROR``, 
or ``SERVER_ERROR``.

The raw ``version`` command output from the upstream memcached server will be 
put into the response body.


Directives
----------
All the standard 
`memcached module <http://nginx.org/en/docs/http/ngx_http_memcached_module.html>`__ 
directives in nginx 0.8.28 are directly inherited, with the ``memcached_`` prefixes 
replaced by ``memc_``. For example, the ``memcached_pass`` directive is spelled 
``memc_pass``.

Here we only document the most important two directives (the latter is a new 
directive introduced by this module).


memc_pass
^^^^^^^^^
:Syntax: ``memc_pass <memcached server IP address>:<memcached server port>``
:Syntax: ``memc_pass <memcached server hostname>:<memcached server port>``
:Syntax: ``memc_pass <upstream_backend_name>``
:Syntax: ``memc_pass unix:<path_to_unix_domain_socket>``
:Default: *none*
:Context: *http, server, location, if*
:Phase: *content*

Specify the memcached server backend.


memc_cmds_allowed
^^^^^^^^^^^^^^^^^
:Syntax: ``memc_cmds_allowed <cmd>...``
:Default: *none*
:Context: *http, server, location, if*

Lists memcached commands that are allowed to access. By default, all the 
memcached commands supported by this module are accessible.
An example is

.. code-block:: nginx

 location /foo {
     set $memc_cmd $arg_cmd;
     set $memc_key $arg_key;
     set $memc_value $arg_val;
     
     memc_pass 127.0.0.1:11211;
      
     memc_cmds_allowed get;
 }


memc_flags_to_last_modified
^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: ``memc_flags_to_last_modified on|off``
:Default: *off*
:Context: *http, server, location, if*

Read the memcached flags as epoch seconds and set it as the value of the 
``Last-Modified`` header. For conditional GET, it will signal nginx to return 
``304 Not Modified`` response to save bandwidth.


memc_connect_timeout
^^^^^^^^^^^^^^^^^^^^
:Syntax: ``memc_connect_timeout <time>``
:Default: *60s*
:Context: *http, server, location*

The timeout for connecting to the memcached server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time 
units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), 
"w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.


memc_send_timeout
^^^^^^^^^^^^^^^^^
:Syntax: ``memc_send_timeout <time>``
:Default: *60s*
:Context: *http, server, location*

The timeout for sending TCP requests to the memcached server, in seconds by 
default.

It's wise to always explicitly specify the time unit to avoid confusion. Time 
units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), 
"w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.


memc_read_timeout
^^^^^^^^^^^^^^^^^
:Syntax: ``memc_read_timeout <time>``
:Default: *60s*
:Context: *http, server, location*

The timeout for reading TCP responses from the memcached server, in seconds by 
default.

It's wise to always explicitly specify the time unit to avoid confusion. Time 
units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), 
"w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.


memc_buffer_size
^^^^^^^^^^^^^^^^
:Syntax: ``memc_buffer_size <size>``
:Default: *4k/8k*
:Context: *http, server, location*

This buffer size is used for the memory buffer to hold

* the complete response for memcached commands other than ``get``,
* the complete response header (i.e., the first line of the response) for the ``get`` memcached command.

This default size is the page size, may be ``4k`` or ``8k``.


memc_ignore_client_abort
^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: ``memc_ignore_client_abort on|off``
:Default: *off*
:Context: *location*

Determines whether the connection with a memcache server should be closed when 
a client closes a connection without waiting for a response.

This directive was first added in the ``v0.14`` release.



.. _memc.installation:

Installation
------------
You're recommended to install this module (as well as the Nginx core and many 
other goodies) via the `ngx_openresty bundle <http://openresty.org>`__. See the 
`installation steps <http://openresty.org/#Installation>`_ for ``ngx_openresty``.

Alternatively, you can compile this module into the standard Nginx source 
distribution by hand:

Grab the nginx source code from `nginx.org <http://nginx.org/>`_, for example,
the version 1.7.2 (see `nginx compatibility <memc.compatibility_>`_), and then 
build the source with this module:

.. code-block:: bash

  wget 'http://nginx.org/download/nginx-1.7.2.tar.gz'
  tar -xzvf nginx-1.7.2.tar.gz
  cd nginx-1.7.2/
  
  # Here we assume you would install you nginx under /opt/nginx/.
  ./configure --prefix=/opt/nginx \
      --add-module=/path/to/memc-nginx-module
   
  make -j2
  make install

Download the latest version of the release tarball of this module from 
:github:`memc-nginx-module file list <openresty/memc-nginx-module/tags>`


For Developers
^^^^^^^^^^^^^^
The memached response parsers were generated by `Ragel <http://www.colm.net/open-source/ragel/>`_. 
If you want to regenerate the parser's C file, i.e., 
:github:`src/ngx_http_memc_response.c <openresty/memc-nginx-module/blob/master/src/ngx_http_memc_response.c>` 
use the following command from the root of the memc module's source tree:

.. code-block:: bash

  $ ragel -G2 src/ngx_http_memc_response.rl



.. _memc.compatibility:

Compatibility
-------------
The following versions of Nginx should work with this module:

* **1.7.x**                       (last tested: 1.7.2)
* **1.5.x**                       (last tested: 1.5.12)
* **1.4.x**                       (last tested: 1.4.4)
* **1.2.x**                       (last tested: 1.2.9)
* **1.1.x**                       (last tested: 1.1.5)
* **1.0.x**                       (last tested: 1.0.10)
* **0.9.x**                       (last tested: 0.9.4)
* **0.8.x**                       (last tested: 0.8.54)
* **0.7.x >= 0.7.46**             (last tested: 0.7.68)

It's worth mentioning that some 0.7.x versions older than 0.7.46 might also work, but I can't easily test them because the test suite makes extensive use of the :doc:`echo`'s echo_location directive, which requires at least nginx 0.7.46 :)

Earlier versions of Nginx like 0.6.x and 0.5.x will *not* work.

If you find that any particular version of Nginx above 0.7.46 does not work with this module, please consider [[#Report Bugs|reporting a bug]].



Community
---------
English Mailing List
^^^^^^^^^^^^^^^^^^^^
The `openresty-en <https://groups.google.com/group/openresty-en>`_ mailing list is for English speakers.


Chinese Mailing List
^^^^^^^^^^^^^^^^^^^^
The `openresty <https://groups.google.com/group/openresty>`_ mailing list is for Chinese speakers.



Report Bugs
-----------
Although a lot of effort has been put into testing and code tuning, there must be some serious bugs lurking somewhere in this module. So whenever you are bitten by any quirks, please don't hesitate to

#. create a ticket on the :github:`issue tracking interface <openresty/memc-nginx-module/issues>` provided by GitHub,
#. or send a bug report or even patches to the `nginx mailing list <http://mailman.nginx.org/mailman/listinfo/nginx>`_.



.. _memc.source-repository:

Source Repository
-----------------
Available on github at 
:github:`openresty/memc-nginx-module <openresty/memc-nginx-module>`



Changes
-------
The changes of every release of this module can be obtained from the 
ngx_openresty bundle's change logs:

http://openresty.org/#Changes



Test Suite
----------
This module comes with a Perl-driven test suite. The 
:github:`test cases <openresty/memc-nginx-module/tree/master/t/>` are
:github:`declarative <openresty/memc-nginx-module/blob/master/t/storage.t>`
too. Thanks to the `Test::Base <http://search.cpan.org/perldoc?Test::Base>`_ module 
in the Perl world.

To run it on your side:

.. code-block:: bash

  $ PATH=/path/to/your/nginx-with-memc-module:$PATH prove -r t


You need to terminate any Nginx processes before running the test suite if you 
have changed the Nginx server binary.

Either `LWP::UserAgent <http://search.cpan.org/perldoc?LWP::UserAgent>`_ or 
`IO::Socket <http://search.cpan.org/perldoc?IO::Socket>`_

..
  Commented out the following, dead GitHub link
  is used by the 
  `test scaffold <openresty/memc-nginx-module/blob/master/test/lib/Test/Nginx/LWP.pm>`

Because a single nginx server (by default, ``localhost:1984``) is used across 
all the test scripts (``.t`` files), it's meaningless to run the test suite in 
parallel by specifying ``-jN`` when invoking the ``prove`` utility.

You should also keep a memcached server listening on the ``11211`` port at 
localhost before running the test suite.

Some parts of the test suite requires modules 
`rewrite <http://nginx.org/en/docs/http/ngx_http_rewrite_module.html>`_ and 
:doc:`echo` to be enabled as 
well when building Nginx.



TODO
----
* add support for the memcached commands ``cas``, ``gets`` and ``stats $memc_value``.
* add support for the ``noreply`` option.



Getting involved
----------------
You'll be very welcomed to submit patches to the `author <memc.author_>`_ or 
just ask for a commit bit to the `source repository <memc.source-repository_>`_ 
on GitHub.



.. _memc.author:

Author
------
Yichun "agentzh" Zhang (章亦春) *<agentzh@gmail.com>*, CloudFlare Inc.

This wiki page is also maintained by the author himself, and everybody is 
encouraged to improve this page as well.



Copyright & License
-------------------
The code base is borrowed directly from the standard 
`memcached module <http://nginx.org/en/docs/http/ngx_http_memcached_module.html>`__ 
in the Nginx core. This part of code is copyrighted by Igor Sysoev and Nginx Inc.

Copyright (c) 2009-2013, Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, 
CloudFlare Inc.

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



.. seealso::

  * The original announcement email on the nginx mailing list: `ngx_memc: "an extended version of ngx_memcached that supports set, add, delete, and many more commands" <http://forum.nginx.org/read.php?2,28359>`_
  * My slides demonstrating various ngx_memc usage: http://agentzh.org/misc/slides/nginx-conf-scripting/nginx-conf-scripting.html#34 (use the arrow or pageup/pagedown keys on the keyboard to swith pages)
  * The latest `memcached TCP protocol <https://github.com/memcached/memcached/blob/master/doc/protocol.txt>`_.
  * The :github:`ngx_srcache <openresty/srcache-nginx-module>` module
  * The :github:`lua-resty-memcached <openresty/lua-resty-memcached>` library based on the :doc:`lua` cosocket API.
  * The standard `memcached <http://nginx.org/en/docs/http/ngx_http_memcached_module.html>`_ module.
  * The :doc:`echo` for Nginx module's automated testing.
  * The standard `headers <http://nginx.org/en/docs/http/ngx_http_headers_module.html>`_ module and the 3rd-parth :doc:`headers_more` module.
