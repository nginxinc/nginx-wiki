
.. meta::
   :description: A sample NGINX configuration for SilverStripe.

SilverStripe
============

`SilverStripe <https://www.silverstripe.org/>`_ is a modern PHP based CMS Framework that runs happily on NGINX.  
  
There are several built in failsafes that will attempt to rectify any errors in rewrite rules.  
First, SS relies on an ``.htaccess`` file to define how to handle URLs.  
Second, in the event that rewriting has failed the ``index.php`` file will attempt to set internal variables and include the core ``/sapphire/main.php`` file for processing.

.. note::

   These instructions assume you are using PHP configured as :doc:`../examples/phpfcgi` or PHP-FPM listening on 127.0.0.1:9000.  
   Make any appropriate changes `fastcgi_params <http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_params>`_ as needed for your environment.
   The sample configuration is valid for SilverStripe 4.1+. For earlier versions, see the `SilverStripe documentation <https://docs.silverstripe.org/en/4/getting_started/installation/how_to/configure_nginx/>`_.

Recipe
------

The basic rewrite that controls all SilverStripe calls involve passing the URI and any GET vars to ``$document_root/framework/main.php``.

#. Remove the ``.htaccess`` file and ``index.php`` in the root of your SilverStripe installation (Just to be sure)
#. Apply a config similar to the following:

.. code-block:: nginx

    server {
        include mime.types;
        default_type  application/octet-stream;
        client_max_body_size 0; # Manage this in php.ini (upload_max_filesize & post_max_size)
        listen 80;
        root /path/to/ss/folder/public;
        server_name example.com www.example.com;

        # Defend against SS-2015-013 -- http://www.silverstripe.org/software/download/security-releases/ss-2015-013
        if ($http_x_forwarded_host) {
            return 400;
        }

        location / {
            try_files $uri /index.php?$query_string;
        }

        error_page 404 /assets/error-404.html;
        error_page 500 /assets/error-500.html;

        # See caveats
        error_page 502 /assets/error-500.html;
        error_page 503 /assets/error-500.html;

        location ^~ /assets/ {
            sendfile on;
            try_files $uri =404;
        }

        location /index.php {
            fastcgi_buffer_size 32k;
            fastcgi_busy_buffers_size 64k;
            fastcgi_buffers 4 32k;
            fastcgi_keep_conn on;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include        fastcgi_params;
        }
    }
