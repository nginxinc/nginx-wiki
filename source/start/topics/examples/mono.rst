
.. meta::
   :description: An example configuration that runs .NET websites behind NGINX without having to use Windows.

Mono FCGI
=========

You want to run .NET websites behind Nginx and don't want to use Windows to do it. Spiffy.

Here's the virtual host configuration you'll want.

.. code-block:: nginx

    server {
            server_name profarius.com;
            root /var/www/webapp;
            index index.html index.htm index.aspx default.aspx;
 
            location = /favicon.ico {
                    log_not_found off;
                    access_log off;
            }
 
            location = /robots.txt {
                    allow all;
                    log_not_found off;
                    access_log off;
            }
 
            location / {
                    try_files $uri $uri/ /index.aspx;
            }
  
            # Fighting with ImageCache? This little gem is amazing.
            location ~ ^/sites/.*/files/imagecache/ {
                    try_files $uri $uri/ @rewrite;
            }
 
            location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                    expires max;
                    log_not_found off;
            }

            location ~ \.(aspx|asmx|ashx|asax|ascx|soap|rem|axd|cs|config|dll)$ {
                fastcgi_pass   127.0.0.1:9000;
                fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
                include        fastcgi_params;
            }
    }

Note the above where you pass to ``127.0.0.1:9000``. This is a TCP socket that is launched as such.

.. code-block:: bash

    fastcgi-mono-server2 /socket=tcp:9000

You could also bind it to a UNIX socket which is recommended.

.. code-block:: bash

    fastcgi-mono-server2 /socket=unix:/tmp/fastcgi.socket

