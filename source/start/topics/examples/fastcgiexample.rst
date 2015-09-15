
.. meta::
   :description: An example NGINX configuration that uses FastCGI.

FastCGI Example
===============

First thing, I recommend keeping all your typical FCGI settings in a single file and importing them.

For example you might have an ``/etc/nginx/fastcgi.conf`` (or ``/etc/nginx/fastcgi_params`` that's installed by default on debian) file that looks like this:

.. code-block:: nginx

  #fastcgi.conf
  fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
  fastcgi_param  SERVER_SOFTWARE    nginx;
  fastcgi_param  QUERY_STRING       $query_string;
  fastcgi_param  REQUEST_METHOD     $request_method;
  fastcgi_param  CONTENT_TYPE       $content_type;
  fastcgi_param  CONTENT_LENGTH     $content_length;
  fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
  fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
  fastcgi_param  REQUEST_URI        $request_uri;
  fastcgi_param  DOCUMENT_URI       $document_uri;
  fastcgi_param  DOCUMENT_ROOT      $document_root;
  fastcgi_param  SERVER_PROTOCOL    $server_protocol;
  fastcgi_param  REMOTE_ADDR        $remote_addr;
  fastcgi_param  REMOTE_PORT        $remote_port;
  fastcgi_param  SERVER_ADDR        $server_addr;
  fastcgi_param  SERVER_PORT        $server_port;
  fastcgi_param  SERVER_NAME        $server_name;

This allows you to keep your individual FCGI configurations as simple as possible.
You may also want to replace ``$document_root`` in ``SCRIPT_FILENAME`` and ``DOCUMENT_ROOT`` with an actual path, the ``$document_root`` variable is hardcoded and may not reflect your install (will cause variations on 'script not found' errors, usually).
To use NGINX + Virtual Host + PHP you should ommit the ``SCRIPT_NAME`` variable in order for PHP to choose the correct ``DOCUMENT_ROOT``.



Spawning a FastCGI Process
--------------------------
Unlike Apache or Lighttpd, NGINX does not automatically spawn FCGI processes.
You must start them separately.
In fact, FCGI is a lot like proxying.
There's a few ways to start FCGI programs, but luckily PHP5 will auto-spawn as many as you set in the ``PHP_FCGI_CHILDREN`` environment variable.
So we simply run ``php -b 127.0.0.1:9000`` manually, or create an init script like so:

.. code-block:: bash

  #!/bin/bash
  BIND=127.0.0.1:9000
  USER=www-data
  PHP_FCGI_CHILDREN=15
  PHP_FCGI_MAX_REQUESTS=1000

  PHP_CGI=/usr/bin/php-cgi
  PHP_CGI_NAME=`basename $PHP_CGI`
  PHP_CGI_ARGS="- USER=$USER PATH=/usr/bin PHP_FCGI_CHILDREN=$PHP_FCGI_CHILDREN PHP_FCGI_MAX_REQUESTS=$PHP_FCGI_MAX_REQUESTS $PHP_CGI -b $BIND"
  RETVAL=0

  start() {
        echo -n "Starting PHP FastCGI: "
        start-stop-daemon --quiet --start --background --chuid "$USER" --exec /usr/bin/env -- $PHP_CGI_ARGS
        RETVAL=$?
        echo "$PHP_CGI_NAME."
  }

  stop() {
        echo -n "Stopping PHP FastCGI: "
        killall -q -w -u $USER $PHP_CGI
        RETVAL=$?
        echo "$PHP_CGI_NAME."
  }

  case "$1" in
      start)
        start
    ;;
      stop)
        stop
    ;;
      restart)
        stop
        start
    ;;
      *)
        echo "Usage: php-fastcgi {start|stop|restart}"
        exit 1
    ;;
  esac
  exit $RETVAL

Save this to ``/etc/init.d/`` (or wherever your init scripts are) as ``php-fcgi``
Install the usual way (for this debian init script, it's ``update-rc.d`` ``php-fcgi`` defaults) and start it.



Connecting NGINX to the running FastCGI Process
-----------------------------------------------
Now that the FCGI process is running, we must tell NGINX to proxy requests to it via the FCGI protocol:

.. code-block:: nginx

  location ~ \.php$ {
      include /etc/nginx/fcgi_params; #or whatever you named it
      fastcgi_pass  127.0.0.1:9000;
  }

Restart NGINX.



Secure your upload directory!!
------------------------------
Too many example configs fail to secure the "uploads" directory of the application.
Remember that if someone can upload a file named ``xyz.php`` and the uploads dir is publically accessible then you have given the attacker an easy way to insert PHP onto your site...

So if your app has an upload dir ``"/images/"`` then insert ``if ($uri !~ "^/images/")`` before ``fastcgi_pass``, as so:

.. code-block:: nginx

  location ~ \.php$ {
      include /etc/nginx/fastcgi_params;
      if ($uri !~ "^/images/") {
          fastcgi_pass 127.0.0.1:9000;
      }
  }


