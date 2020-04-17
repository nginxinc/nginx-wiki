
.. meta::
   :description: A sample NGINX configuration for Omeka S.

Omeka
=====

Recipe
------

.. code-block:: nginx
server {
        server_name omeka.domain.tld;
        root /var/www/omeka;

        location = /favicon.ico {
                log_not_found off;
                access_log off;
        }

        location = /robots.txt {
                allow all;
                log_not_found off;
                access_log off;
        }

        location ~ \..*/.*\.php$ {
                return 403;
        }

        location / {
                try_files $uri /index.php?$args;
        }

        location /admin {
                try_files $uri /index.php?$args;
        }

        location ~ \.php$ {
                fastcgi_split_path_info ^(.+\.php)(/.+)$;
                #NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
                include fastcgi_params;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                fastcgi_intercept_errors on;
                fastcgi_pass 127.0.0.1:9000;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                expires max;
                log_not_found off;
        }
}
