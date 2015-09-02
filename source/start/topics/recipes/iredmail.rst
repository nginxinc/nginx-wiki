
.. meta::
   :description: A sample NGINX configuration for iRedMail.

iRedMail
========

Requirements
------------

* `php-fpm <http://php-fpm.org/>`__

Recipe
------

.. code-block:: nginx

    server {
        listen          80;
        server_name mail.elegbara.net;

        location / {
            rewrite ^ https://mail.elegbara.net/webmail permanent;
        }

        location ~ \.php$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME /usr/share/apache2$fastcgi_script_name;
        }
    }

    server {
        listen       443;
        server_name  mail.elegbara.net;

        location / {
            root   /usr/share/apache2/;
            index  index.php index.html;
        }

         location ~ \.php$ {
            root            /usr/share/apache2/;
            include         fastcgi_params;
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param   SCRIPT_FILENAME /usr/share/apache2$fastcgi_script_name;
            fastcgi_param SERVER_NAME $http_host;
            fastcgi_ignore_client_abort on;
        }

        ssl                  on;
        ssl_certificate      /etc/ssl/certs/iRedMail_CA.pem;
        ssl_certificate_key  /etc/ssl/private/iRedMail.key;
        ssl_session_timeout  5m;
        ssl_protocols  SSLv2 SSLv3 TLSv1;
        ssl_ciphers  ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
        ssl_prefer_server_ciphers   on;
    }

Configuration for running iRedAdmin Python Web Admin:

.. code-block:: nginx

    server {
        listen 443 ssl; ## listen for ipv4; this line is default and implied
        access_log /var/log/nginx/iredadmin.access.log;
        error_log /var/log/nginx/iredadmin.error.log;

        ssl_certificate /etc/nginx/ssl/star.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        ssl_session_timeout 5m;
        ssl_protocols SSLv3 TLSv1;
        ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv3:+EXP;
        ssl_prefer_server_ciphers on;

        server_name mail.elegbara.com;

        location / {
            root /var/www/iredadmin/;
            uwsgi_pass unix:///var/run/uwsgi/app/iredadmin/iredadmin.socket;
            uwsgi_param UWSGI_PYHOME /var/www/iredadmin/python-home;
            uwsgi_param UWSGI_CHDIR /var/www/iredadmin;
            uwsgi_param UWSGI_SCRIPT iredadmin;
            include uwsgi_params;
        }

        location /static {
            alias /var/www/iredadmin/static/;
        }

        location ~ /\.ht {
            deny all;
        }
    }
