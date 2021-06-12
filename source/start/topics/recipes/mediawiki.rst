
.. meta::
   :description: A sample NGINX configuration for MediaWiki.

MediaWiki
=========

Requirements
------------

* `php-fpm <https://php-fpm.org/>`__

* The ``SCRIPT_FILENAME`` parameter is defined in ``fastcgi_params file`` or in parent contexts, for more details, please refer to :doc:`../examples/phpfcgi`

Recipe
------

Here's the basic configuration used for the NGINX wiki.

.. code-block:: nginx

    server {
        server_name wiki.nginx.org;
        root /var/www/mediawiki;
        index  index.php;

        client_max_body_size 5m;
        client_body_timeout 60;

        location / {
            try_files $uri $uri/ @rewrite;
        }

        location @rewrite {
            rewrite ^/(.*)$ /index.php?title=$1&$args;
        }

        location ^~ /maintenance/ {
            return 403;
        }
        
         location /rest.php {
            try_files $uri $uri/ /rest.php?$args;
        }

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass unix:/var/run/php/php7.3-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;

            
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
            try_files $uri /index.php;
            expires max;
            log_not_found off;
        }

        location = /_.gif {
            expires max;
            empty_gif;
        }

        location ^~ /cache/ {
            deny all;
        }

        location /dumps {
            root /var/www/mediawiki/local;
            autoindex on;
        }
    }

.. note::

    In order for this configuration to work, you will need to set "$wgUsePathInfo = TRUE;" in your LocalSettings.php file.

Troubleshooting math markup
---------------------------

After installing the `Math extension <https://www.mediawiki.org/wiki/Extension:Math>`_ and `enabling TeX <https://www.mediawiki.org/wiki/Manual:Enable_TeX>`_ you may find that the *texvc* binary doesn't produce any PNG file, and instead produces the infamous `Failed to parse (PNG conversion failed; check for correct installation of latex, dvips, gs, and convert) <https://www.mediawiki.org/wiki/Manual:Troubleshooting_math_display_errors#.22Failed_to_parse_.28PNG_conversion_failed.3B_check_for_correct_installation_of_latex.2C_dvips.2C_gs.2C_and_convert.29.22>`_ error.

If nothing obvious can be found such as permissions issues in showing up in the error log, then try running the *texvc* as root using *sudo* by changing *shell_exec* line (around line 123) of ``extensions/Math/MathTexvc.php`` to the following:

.. code-block:: php

    $contents = wfShellExec( "sudo $cmd" );

To allow the web-server to have *sudo* access without compromising security the following line can be added to */etc/sudoers*::

    www-data ALL=NOPASSWD: /path/to/wiki/extensions/Math/math/texvc

