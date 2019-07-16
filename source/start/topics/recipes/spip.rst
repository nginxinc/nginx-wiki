
.. meta::
   :description: A sample NGINX configuration for SPIP.

SPIP
====

Recipe
------

.. code-block:: nginx

    server {
        server_name emeagwali.net www.emeagwali.net;
        client_max_body_size 10m;
        root /var/www/spip;
        index index.php;

        location / {
            # this is the usual way, but careful because all non-existing content will display home page with code 200
            try_files    $uri $uri/ /spip.php?$args;
            # if you don't use rewriting (all internal links are already like spip.php?…), next line is enough
            #try_files $uri $uri/;
        }

        location ~^/(tmp|config)/{
            return 403;
        }

        location ~ \.php$ {
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php ;
            fastcgi_buffers 16 16k;
            fastcgi_buffer_size 32k;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
        
        location ~ /(tmp|config)/ {
            deny  all;
        }
    }

deny access to /tmp and /local
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

SPIP was made to be used with Apache. So when you deploy a SPIP on a web server that don't use htaccess you must not permit visitors to access to tmp nor config (the database dumps are stored in /tmp so a visitor can discover admin password by a brut force attack).

Another way to prevent this kind of attack is:

#. put these dir outside the spip root path 
#. redefine ``_DIR_TMP`` & ``_DIR_CONNECT`` constants in mes_options.php

fastcgi buffer
^^^^^^^^^^^^^^

fastcgi_buffers and fastcgi_buffers_size is to prevent "upstream sent too big header while reading response header from upstream" error

