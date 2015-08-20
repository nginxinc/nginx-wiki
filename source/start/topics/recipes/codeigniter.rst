Codeigniter
===========

A powerful PHP framework with a very small footprint.

Requirements
------------

* `php-fpm <http://php-fpm.org/>`__

Recipe
------

.. code-block:: nginx

    server {
            server_name domain.tld;

            root /var/www/codeignitor;
            index index.html index.php;

            # set expiration of assets to MAX for caching
            location ~* \.(ico|css|js|gif|jpe?g|png)(\?[0-9]+)?$ {
                    expires max;
                    log_not_found off;
            }

            location / {
                    # Check if a file or directory index file exists, else route it to index.php.
                    try_files $uri $uri/ /index.php;
            }

            location ~* \.php$ {
                    fastcgi_pass 127.0.0.1:9000;
                    include fastcgi.conf;
            }
    }

After this, make sure that your codeIgniter config.php contains the following information:

.. code-block:: php

    $config['base_url']	= "http://domain.tld/";
    $config['index_page'] 	= "";
    $config['uri_protocol']	= "REQUEST_URI";

An alternative configuration, production ready.
You don't need to modify "config.php", except for removing "index.php"

.. code-block:: php

    $config['base_url']	= "";
    $config['index_page'] 	= "";
    $config['uri_protocol']	= "AUTO";

.. code-block:: nginx

    server {
            listen       80;
            server_name  localhost;
            root   /var/www/html/ci;
            autoindex on;
            index index.php;

            location / {

                try_files $uri $uri/ /index.php;

                location = /index.php {

                    fastcgi_pass   127.0.0.1:6969;
                    fastcgi_param  SCRIPT_FILENAME /var/www/html/ci$fastcgi_script_name;
                    include        fastcgi_params;
                }
            }

            location ~ \.php$ {
                return 444;
            }


    }
