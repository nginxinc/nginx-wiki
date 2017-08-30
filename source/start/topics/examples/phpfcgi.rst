
.. meta::
   :description: How to configure NGINX with PHP FastCGI Process Manager.

PHP FastCGI Example
=====================

This example is for newer PHP (>= 5.3.3) using the included PHP FPM (FastCGI Process Manager).

This guide assume PHP FPM already installed and configured either using tcp port (``127.0.0.1:9000``) or unix socket (``/var/run/php-fpm.sock``).

There are many guide about configuring NGINX with PHP FPM,
but many of them are incomplete (*don't handle PATH_INFO correctly*)
or contain security issues (*don't check whether the script is indeed php file*).

FastCGI Params
--------------

First thing, I recommend keeping all your typical FCGI settings in a single file and importing them.

For example on debian and ubuntu by default there is ``/etc/nginx/fastcgi_params`` file that should look like this:

.. code-block:: nginx

    fastcgi_param   QUERY_STRING            $query_string;
    fastcgi_param   REQUEST_METHOD          $request_method;
    fastcgi_param   CONTENT_TYPE            $content_type;
    fastcgi_param   CONTENT_LENGTH          $content_length;

    fastcgi_param   SCRIPT_FILENAME         $document_root$fastcgi_script_name;
    fastcgi_param   SCRIPT_NAME             $fastcgi_script_name;
    fastcgi_param   PATH_INFO               $fastcgi_path_info;
    fastcgi_param 	PATH_TRANSLATED	        $document_root$fastcgi_path_info;
    fastcgi_param   REQUEST_URI             $request_uri;
    fastcgi_param   DOCUMENT_URI            $document_uri;
    fastcgi_param   DOCUMENT_ROOT           $document_root;
    fastcgi_param   SERVER_PROTOCOL         $server_protocol;

    fastcgi_param   GATEWAY_INTERFACE       CGI/1.1;
    fastcgi_param   SERVER_SOFTWARE         nginx/$nginx_version;

    fastcgi_param   REMOTE_ADDR             $remote_addr;
    fastcgi_param   REMOTE_PORT             $remote_port;
    fastcgi_param   SERVER_ADDR             $server_addr;
    fastcgi_param   SERVER_PORT             $server_port;
    fastcgi_param   SERVER_NAME             $server_name;

    fastcgi_param   HTTPS                   $https;

    # PHP only, required if PHP was built with --enable-force-cgi-redirect
    fastcgi_param   REDIRECT_STATUS         200;

Please note if you're using Ubuntu Precise (12.04), I change ``SCRIPT_FILENAME`` and add ``PATH_INFO`` params.

Connecting NGINX to PHP FPM
---------------------------

Now we must tell NGINX to proxy requests to PHP FPM via the FCGI protocol:

.. code-block:: nginx

    location ~ [^/]\.php(/|$) {
        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        if (!-f $document_root$fastcgi_script_name) {
            return 404;
        }
        
        # Mitigate https://httpoxy.org/ vulnerabilities
        fastcgi_param HTTP_PROXY "";
        
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;

        # include the fastcgi_param setting
        include fastcgi_params;

        # SCRIPT_FILENAME parameter is used for PHP FPM determining
        #  the script name. If it is not set in fastcgi_params file,
        # i.e. /etc/nginx/fastcgi_params or in the parent contexts,
        # please comment off following line:
        # fastcgi_param  SCRIPT_FILENAME   $document_root$fastcgi_script_name;
    }

If you're using unix socket change ``fastcgi_pass`` to:

.. code-block:: nginx

    fastcgi_pass unix:/var/run/php-fpm.sock;

Restart NGINX.

Testing
-------

Create ``test.php`` on NGINX document root containing just:

.. code-block:: php

    <?php var_export($_SERVER)?>

In the browser try to request:
# /test.php
# /test.php/
# /test.php/foo
# /test.php/foo/bar.php
# /test.php/foo/bar.php?v=1

Pay attention to the value of REQUEST_URI, SCRIPT_FILENAME, SCRIPT_NAME,
PATH_INFO and PHP_SELF.

Here's the correct output for http://lemp.test/test.php/foo/bar.php?v=1 ::

    array (
      'USER' => 'www-data',
      'HOME' => '/var/www',
      'FCGI_ROLE' => 'RESPONDER',
      'QUERY_STRING' => 'v=1',
      'REQUEST_METHOD' => 'GET',
      'CONTENT_TYPE' => '',
      'CONTENT_LENGTH' => '',
      'SCRIPT_FILENAME' => '/var/www/test.php',
      'SCRIPT_NAME' => '/test.php',
      'PATH_INFO' => '/foo/bar.php',
      'REQUEST_URI' => '/test.php/foo/bar.php?v=1',
      'DOCUMENT_URI' => '/test.php/foo/bar.php',
      'DOCUMENT_ROOT' => '/var/www',
      'SERVER_PROTOCOL' => 'HTTP/1.1',
      'GATEWAY_INTERFACE' => 'CGI/1.1',
      'SERVER_SOFTWARE' => 'nginx/1.4.0',
      'REMOTE_ADDR' => '192.168.56.1',
      'REMOTE_PORT' => '44644',
      'SERVER_ADDR' => '192.168.56.3',
      'SERVER_PORT' => '80',
      'SERVER_NAME' => '',
      'HTTPS' => '',
      'REDIRECT_STATUS' => '200',
      'HTTP_HOST' => 'lemp.test',
      'HTTP_USER_AGENT' => 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:20.0) Gecko/20100101 Firefox/20.0',
      'HTTP_ACCEPT' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'HTTP_ACCEPT_LANGUAGE' => 'en-US,en;q=0.5',
      'HTTP_ACCEPT_ENCODING' => 'gzip, deflate',
      'HTTP_CONNECTION' => 'keep-alive',
      'PHP_SELF' => '/test.php/foo/bar.php',
      'REQUEST_TIME' => 1367829847,
    )

Notes
-----

#. The location regex capable to handle ``PATH_INFO`` and properly check that the extension indeed .php (not .phps) whether there is PATH_INFO or not.

#. The ``fastcgi_split_path_info`` regex capable to correctly handle request like ``/test.php/foo/blah.php`` or ``/test.php/``.

#. The ``if`` lets NGINX check whether the ``*.php`` does indeed exist to prevent NGINX to feeding PHP FPM non php script file (like uploaded image).

   Some guides recommend to use ``try_files`` instead of ``if``, if you do that, beware of NGINX `bug #321 <https://trac.nginx.org/nginx/ticket/321>`_.
   I personally think ``if`` is more appropriate for this, even :doc:`../depth/ifisevil` agree this is one of the 100% safe thing to use ``if`` with.

#. The ``SCRIPT_FILENAME`` parameter is required as it is passed to PHP FPM to determine the script name.

   In the builds of NGINX for a lot of Linux distributions, this parameter has been added in ``fastcgi_params file``, i.e. ``/etc/nginx/fastcgi_params``so the users could import all the CGI params via the ``include`` directive, i.e. ``include fastcgi_params`` . But for some distributions, such as CentOS, this parameter does not exist in ``fastcgi_params file``.

   If this parameter is not set, PHP FPM responses 200 OK with empty content, and there is no error or warning. 
   For more informaton about the CGI params, please refer to `nginx beginners guide <https://nginx.org/en/docs/beginners_guide.html#fastcgi>`_, `$_SERVER in PHP <http://php.net/manual/en/reserved.variables.server.php>`_ and `RFC3875 <http://www.ietf.org/rfc/rfc3875>`_.

#. If you see a blank page in browser, please check if ``SCRIPT_FILENAME`` parameter is set.

#. This guide run fine on php.ini with ``cgi.fix_pathinfo = 1`` (the default).

   Some guide insist to change it to ``cgi.fix_pathinfo = 0`` but doing that make ``PHP_SELF`` variable broken (not equal to ``DOCUMENT_URI``).

