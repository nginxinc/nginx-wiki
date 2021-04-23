.. meta::
   :description: A sample NGINX configuration for UVdesk.

UVdesk
=======

Uvdesk helpdesk is Build on top of Symfony(PHP Framework) and Backbone.js, uvdesk community is a service oriented, event driven extensible opensource helpdesk system that can be used by your organization to provide efficient support to your clients effortlessly whichever way you imagine.

UVDesk Opensource Community Helpdesk Project built for all to make a full Ticketing Support System along with many more other features.

https://www.uvdesk.com/en/opensource/

Recipe
------

Please check the below configuration, your web server should directs all requests to your application's ``public/index.php`` file.

.. code-block:: nginx

    server {
			listen 80;
			server_name example.com;

			root /var/www/example.com/public;

			index index.html index.htm index.nginx-debian.html index.php;

			location / {
			autoindex on;
				try_files $uri $uri/ /index.php?$args;
			}

			location ~ \.php$ {
				include snippets/fastcgi-php.conf;
				fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
				location ~ /\.ht {
					deny all;
				}
			}
		}
