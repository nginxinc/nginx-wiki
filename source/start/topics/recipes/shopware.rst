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
        
        location ~* ^.+\.(?:css|cur|js|jpe?g|gif|ico|png|svg|webp|html|woff|woff2|xml)$ {
           expires 1y;
           add_header Cache-Control "public, must-revalidate, proxy-revalidate";

           access_log off;

           # The directive enables or disables messages in error_log about files not found on disk.
           log_not_found off;

           tcp_nodelay off;

           ## Set the OS file cache.
           open_file_cache max=3000 inactive=120s;
           open_file_cache_valid 45s;
           open_file_cache_min_uses 2;
           open_file_cache_errors off;
       }

       location ~* ^.+\.svg$ {
           add_header Content-Security-Policy "script-src 'none'";
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
