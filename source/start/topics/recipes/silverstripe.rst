
.. meta::
   :description: A sample NGINX configuration for SilverStripe.

SilverStripe
============

`SilverStripe <http://www.silverstripe.org/>`_ is a modern PHP based CMS Framework that runs happily on NGINX.  
  
There are several built in failsafes that will attempt to rectify any errors in rewrite rules.  
First, SS relies on an ``.htaccess`` file to define how to handle URLs.  
Second, in the event that rewriting has failed the ``index.php`` file will attempt to set internal variables and include the core ``/sapphire/main.php`` file for processing.

.. note::

   These instructions assume you are using PHP configured as :doc:`../examples/phpfcgi` or PHP-FPM listening on 127.0.0.1:9000.  
   Make any appropriate changes `fastcgi_params <http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_params>`_ as needed for your environment.

Recipe
------

The basic rewrite that controls all SilverStripe calls involve passing the URI and any GET vars to ``$document_root/framework/main.php``.

#. Remove the ``.htaccess`` file and ``index.php`` in the root of your SilverStripe installation (Just to be sure)
#. Apply a config similar to the following:

.. code-block:: nginx

    server {
        listen 80;
        root /path/to/ss/folder;

        server_name site.com www.site.com;

        location / {
            try_files $uri /framework/main.php?url=$uri&$query_string;
        }

        error_page 404 /assets/error-404.html;
        error_page 500 /assets/error-500.html;

        location ^~ /assets/ {
            sendfile on;
            try_files $uri =404;
        }

        location ~ /framework/.*(main|rpc|tiny_mce_gzip)\.php$ {
            fastcgi_keep_conn on;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }

        location ~ /(mysite|framework|cms)/.*\.(php|php3|php4|php5|phtml|inc)$ {
            deny all;
        }

        location ~ /\.. {
            deny all;
        }

        location ~ \.ss$ {
            satisfy any;
            allow 127.0.0.1;
            deny all;
        }

        location ~ web\.config$ {
            deny all;
        }

        location ~ \.ya?ml$ {
            deny all;
        }
        
        location ^~ /vendor/ {
            deny all;
        }

        location ~* /silverstripe-cache/ {
            deny all;
        }

        location ~* composer\.(json|lock)$ {
            deny all;
        }

        location ~* /(cms|framework)/silverstripe_version$ {
            deny all;
        }

        location ~ \.php$ {
                    fastcgi_keep_conn on;
                    fastcgi_pass   127.0.0.1:9000;
                    fastcgi_index  index.php;
                    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
                    include        fastcgi_params;
        }
    }
