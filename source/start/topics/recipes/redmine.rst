
.. meta::
   :description: A sample NGINX configuration for Redmine.

Redmine
=======

Redmine is seemingly complex. It is. However, when it comes to NGINX, it isn't.

Recipe
------

This is very nearly a drop in configuration. The only thing you should need to change will be the root location, upstream servers, and the server name.

.. code-block:: nginx

    upstream redmine {
            server 127.0.0.1:8000;
            server 127.0.0.1:8001;
            server 127.0.0.1:8002;
    }

    server {
            server_name redmine.DOMAIN.TLD;
            root /var/www/redmine/public;

            location / {
                    try_files $uri @redmine;
            }

            location @redmine {
                    proxy_set_header  X-Forwarded-For $remote_addr;
                    proxy_pass http://redmine;
            }
    }

Ruby
^^^^

In the above configuration I used upstream connections to ruby processes. They were bound to ports 8000-8002. Explaining how to set this up is explained on the redmine website and is probably best left for there. If there's enough request I'll try to compile something.

