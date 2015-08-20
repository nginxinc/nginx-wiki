.. _recipe-drupal:

Drupal
======

Drupal is a bit of a beast of a PHP application.

Requirements
------------

* `php-fpm <http://php-fpm.org/>`__

Recipe
------

.. code-block:: nginx

    server {
        server_name example.com;
        root /var/www/drupal7; ## <-- Your only path reference.

        location = /favicon.ico {
            log_not_found off;
            access_log off;
        }

        location = /robots.txt {
            allow all;
            log_not_found off;
            access_log off;
        }

        # Very rarely should these ever be accessed outside of your lan
        location ~* \.(txt|log)$ {
            allow 192.168.0.0/16;
            deny all;
        }

        location ~ \..*/.*\.php$ {
            return 403;
        }

        location ~ ^/sites/.*/private/ {
            return 403;
        }

        # Block access to "hidden" files and directories whose names begin with a
        # period. This includes directories used by version control systems such
        # as Subversion or Git to store control files.
        location ~ (^|/)\. {
            return 403;
        }

        location / {
            # try_files $uri @rewrite; # For Drupal <= 6
            try_files $uri /index.php; # For Drupal >= 7
        }

        location @rewrite {
            rewrite ^/(.*)$ /index.php?q=$1;
        }

        location ~ \.php$ {
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            #NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            fastcgi_intercept_errors on;
            fastcgi_pass unix:/tmp/phpfpm.sock;
        }

        # Fighting with Styles? This little gem is amazing.
        # location ~ ^/sites/.*/files/imagecache/ { # For Drupal <= 6
        location ~ ^/sites/.*/files/styles/ { # For Drpal >= 7
            try_files $uri @rewrite;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
            expires max;
            log_not_found off;
        }
    }
