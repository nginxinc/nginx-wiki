
.. meta::
   :description: Various example configurations that demonstrate various ways to use NGINX server blocks.

Server Block Examples
=====================

Note: "VirtualHost" is an Apache term. NGINX does not have Virtual hosts, it has "Server Blocks" that use the server_name and listen directives to bind to tcp sockets.

Two Server Blocks, Serving Static Files
---------------------------------------

.. code-block:: nginx

    http {
      index index.html;

      server {
        server_name www.domain1.com;
        access_log logs/domain1.access.log main;

        root /var/www/domain1.com/htdocs;
      }

      server {
        server_name www.domain2.com;
        access_log  logs/domain2.access.log main;

        root /var/www/domain2.com/htdocs;
      }
    }

A Default "Catch All" Server Block
----------------------------------

.. code-block:: nginx

    http {
      index index.html;

      server {
        listen 80 default_server;
        server_name _; # This is just an invalid value which will never trigger on a real hostname.
        access_log logs/default.access.log main;

        server_name_in_redirect off;

        root  /var/www/default/htdocs;
      }
    }

Wildcard Subdomains in a Parent Folder
--------------------------------------

This is just a really easy way to keep adding new subdomains, or to add new domains automatically when DNS records are pointed at the server. Note that I have included FCGI here as well. If you want to just serve static files, strip out the FCGI config and change the default document to index.html. Rather than creating a new vhost.conf file for every domain, just create one of these:

.. code-block:: nginx

    server {
      # Replace this port with the right one for your requirements
      listen 80 default_server;  #could also be 1.2.3.4:80

      # Multiple hostnames separated by spaces.  Replace these as well.
      server_name star.yourdomain.com *.yourdomain.com; # Alternately: _

      root /PATH/TO/WEBROOT;

      error_page 404 errors/404.html;
      access_log logs/star.yourdomain.com.access.log;

      index index.php index.html index.htm;

      # static file 404's aren't logged and expires header is set to maximum age
      location ~* \.(jpg|jpeg|gif|css|png|js|ico|html)$ {
        access_log off;
        expires max;
      }

      location ~ \.php$ {
        include fastcgi_params;
        fastcgi_intercept_errors on;
        # By all means use a different server for the fcgi processes if you need to
        fastcgi_pass   127.0.0.1:YOURFCGIPORTHERE;
      }

      location ~ /\.ht {
        deny  all;
      }
    }
