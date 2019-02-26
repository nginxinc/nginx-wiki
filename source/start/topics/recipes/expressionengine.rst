
.. meta::
   :description: A sample NGINX configuration for ExpressionEngine.

ExpressionEngine
================

`ExpressionEngine <https://expressionengine.com/>`_  is a flexible, feature-rich content management system that empowers thousands of individuals, organizations, and companies around the world to easily manage their website.


This configuration isn't heavily tested, but it seems to work.

.. code-block:: nginx

    server {
      listen 80;
      server_name www.mydomain.com;
      root /var/www/EECore1.6.7;

      access_log /var/log/nginx/www.mydomain.com-access.log;
      error_log  /var/log/nginx/www.mydomain.com-error.log info;

      location / {
        index index.php;
        error_page 404 = @ee;
      }

      location @ee {
        rewrite ^(.*) /index.php?$1 last;
      }

      location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:8888;
        fastcgi_index index.php5;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      }
    }

Better Version
--------------

.. note::
   The configuration above generates a lot of 404 errors on the logs. The one below is cleaner, and uses the recommended try_files method:

.. code-block:: nginx

    server {
      listen 80;
      server_name www.mydomain.com;
      root /var/www/EECore1.6.7;

      access_log /var/log/nginx/www.mydomain.com-access.log;
      error_log  /var/log/nginx/www.mydomain.com-error.log info;

      location / {
        index index.php;
        try_files $uri $uri/ @ee;
      }

      location @ee {
        rewrite ^(.*) /index.php?$1 last;
      }

      location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:8888;
        fastcgi_index index.php5;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      }
    }

Version for index.php/your-path
-------------------------------

The above code did not work for me, I had to use the following code:

.. code-block:: nginx

    server {
      listen 80;
      server_name example.com;
      root /PATH_TO_ROOT;
      index index.php;

      location / {
        index index.php;
        try_files $uri $uri/ @ee;
      }

      location @ee {
        rewrite ^(.*) /index.php$1 last;
      }

      location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/tmp/php-fastcgi.socket;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      }

        # This location is for our EE index.php gateway
        location /index.php {
          include /usr/local/nginx/conf/fastcgi_params;
          set $script     $uri;
          set $path_info  $uri;
          # this will set the path_info when it exists as query string: /index.php?/something/here
          if ($args ~* "^(/.+)$") {
            set $path_info  $1;
          }
          fastcgi_pass 127.0.0.1:9000;
          fastcgi_index index.php;
          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
          fastcgi_param PATH_INFO $path_info;
        }
    }

The problem was that EE wanted to have the URL like this http://domain.com/index.php/your-path without the question mark. See https://expressionengine.com/forums/archive/topic/92987/how-to-remove-index.php-on-nginx for a complete configuration.

Prevent duplicate content
-------------------------

e.g. preventing `http://example.com/index.php/your-path/`

In your php configuration:

.. code-block:: nginx

   location /index.php {
    # Prevent duplicate content
    if ($request_uri ~ "^/index\.php/") {
      return 404;
    }

    # the rest of your configuration ...
   }

Note this may require an explicit 404 page e.g. in your server block:

.. code-block:: nginx

    server {
      # ...
      error_page 404 /404.html;
      # ...
    }

EllisLab only very recently (2013/12) updated their docs with this, see: https://expressionengine.com/blog/fully-removing-index.php-from-urls

