.. meta::
   :description: A sample NGINX configuration for Shopware.

Shopware
========

Shopware is a opensource ecommerce platform written in PHP.

Requirements
------------

* `php-fpm <https://php-fpm.org/>`__

Recipe
------

.. code-block:: nginx

    server {
        listen 80;

        # Handle / to index.php
        index index.php;

        # Our server name
        server_name example.com;

        # Where the code is located
        root /var/www/html/public;

        # Needed for Shopware install / update
        location /recovery/install {
            index index.php;
            try_files $uri /recovery/install/index.php$is_args$args;
        }

        location /recovery/update/ {
            if (!-e $request_filename){
                rewrite . /recovery/update/index.php last;
            }
        }

        # Forward any not found file to index.php. Also allows to have beautiful urls like /homemade-products/
        location / {
            try_files $uri /index.php$is_args$args;
        }

        # Let php-fpm handle .php files
        location ~ \.php$ {
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            include fastcgi.conf;
            fastcgi_param HTTP_PROXY "";
            fastcgi_buffers 8 16k;
            fastcgi_buffer_size 32k;
            fastcgi_read_timeout 300s;
            client_body_buffer_size 128k;
            fastcgi_pass unix:/run/php/php7.4-fpm.sock;
            http2_push_preload on;
        }
    }
