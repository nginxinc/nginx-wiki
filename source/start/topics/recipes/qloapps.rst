.. meta::
   :description: A sample NGINX configuration for QloApps.

QloApps
=======

QloApps is one of a kind true open source hotel reservation system and a booking engine. The system is dedicated to channeling the power of the open-source community to serve the hospitality industry.

From small independent hotels to big hotel chains, QloApps is a one-stop solution for all your hotel business needs.

You will be able to launch your hotel website, showcase your property and take and manage bookings.


Recipe
------

Please check the below configuration, your web server should directs all requests to your application's ``public/index.php`` file.


server {
        listen 80;
        server_name example.com www.example.com;
        root /path/to/QloApps;

        # Define file to be used as index
        index index.php;


        # Redirect 404 errors to QloApps error page
        error_page 404 /index.php?controller=404;


        # Add response headers
        add_header Strict-Transport-Security 'max-age=84600; includeSubDomains;';
        add_header x-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Option "nosniff";
        add_header X-Frame-Options "SAMEORIGIN";

        # Set log files path
        error_log /path/for/error/log warn;
        access_log /path/for/error/log combined;


        # Do not generate logs for these
        location = /favicon.ico { log_not_found off; access_log off; }

        location = /robots.txt { allow all; log_not_found off; access_log off; }


        # File security for .htaccess and hidden files.
        location ~ /\.   {
               deny all;
        }


        # For processing PHP scripts
        location ~ \.php$ {
                include fastcgi_params;
                fastcgi_index  index.php;
                fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }


        # Set webserver timeout
        proxy_read_timeout 500;
        proxy_connect_timeout 500;
        proxy_send_timeout 500;
        fastcgi_read_timeout 500;
        fastcgi_connect_timeout 500;
        fastcgi_send_timeout 500;
}