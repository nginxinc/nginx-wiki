.. meta::
   :description: A sample NGINX configuration for Bagisto.

Krayin
=======

Krayin (Community E-Commerce Project by `Webkul <https://store.webkul.com/Bagisto.html>`_) is a hand tailored CRM framework built on some of the hottest opensource technologies such as Laravel (a PHP framework) and Vue.js a progressive Javascript framework.

https://krayincrm.com/

Recipe
------

Please check the below configuration, your web server should directs all requests to your application's ``public/index.php`` file.

.. warning::
    As per the Laravel documentation, you should never attempt to move the ``index.php`` file
    to your project's root directory, as serving the application from the project root will
    expose many sensitive configuration files to the public Internet.

.. code-block:: nginx

    server {
        listen 80;
        server_name example.com;
        root /srv/example.com/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";

        index index.php;

        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location = /favicon.ico { access_log off; log_not_found off; }
        location = /robots.txt  { access_log off; log_not_found off; }

        error_page 404 /index.php;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
