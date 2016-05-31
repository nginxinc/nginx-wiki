
.. meta::
   :description: A sample NGINX configuration for Dokuwiki.

Dokuwiki
========

A simple to use and highly versatile Open Source wiki software that doesn't require a database.

Requirements
------------

* `php-fpm <http://php-fpm.org/>`__

Recipe
------

Without SSL
^^^^^^^^^^^

This is pretty straight-forward. Just add this to your ``nginx.conf``. Note that the ``fastcgi_pass`` is non-standard here.

.. code-block:: nginx

    server {
      server_name wiki.domain.tld;
      root /var/www/dokuwiki;

      location / {
        index doku.php;
        try_files $uri $uri/ @dokuwiki;
      }

      location ~ ^/lib.*\.(gif|png|ico|jpg)$ {
        expires 30d;
      }

      location ^~ /conf/ { return 403; }
      location ^~ /data/ { return 403; }

      location @dokuwiki {
        rewrite ^/_media/(.*) /lib/exe/fetch.php?media=$1 last;
        rewrite ^/_detail/(.*) /lib/exe/detail.php?media=$1 last;
        rewrite ^/_export/([^/]+)/(.*) /doku.php?do=export_$1&id=$2 last;
        rewrite ^/(.*) /doku.php?id=$1 last;
      }

      location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass unix:/tmp/phpcgi.socket;
      }
    }

With SSL
^^^^^^^^

In http context you have to this line to fill the ``$php_https`` variable that is later passed to your fcgi engine. It is required for Dokuwiki to switch properly between http and https.

.. code-block:: nginx

    # In http context
    map $scheme $php_https { default off; https on; }

This goes into dokuwiki.conf, for convenience.  This is basically the same as the above snippet but with the required ``fastcgi_param HTTPS $php_https;``

.. code-block:: nginx

    ### File: /etc/nginx/dokuwiki.conf	

    include drop.conf;

    client_max_body_size 15M;
    client_body_buffer_size 128k;
    location / {
        try_files $uri $uri/ @dw;
    }

    location @dw {
        rewrite ^/_media/(.*) /lib/exe/fetch.php?media=$1 last;
        rewrite ^/_detail/(.*) /lib/exe/detail.php?media=$1 last;
        rewrite ^/_export/([^/]+)/(.*) /doku.php?do=export_$1&id=$2 last;
        rewrite ^/(.*) /doku.php?id=$1 last;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_param HTTPS $php_https;#DW checks $_SERVER['HTTPS']
        fastcgi_pass unix:/tmp/php5-fpm.sock;
    }

    # Block access to data folders
    location ~ /(data|conf|bin|inc)/ {
    deny all;
    }

    # Block access to .htaccess files
    location ~ /\.ht {
    deny  all;
    }

You can force your users to switch to SSL for login and administration.
As also displayed on the page `HTTPS Login for Dokuwiki <https://www.dokuwiki.org/tips:httpslogin#nginx>`_, you have to create two ``server{}`` instances.

.. code-block:: nginx

    ### File: /etc/nginx/nginx.conf

    map $scheme $php_https { default off; https on; }

        server {
          server_name wiki.host.org
          root /path/to/dokuwiki;
          index doku.php;
          listen 80;
          #Enforce https for logins, admin
          if ($args ~* do=(log|admin|profile)) {
            rewrite ^ https://$host$request_uri? redirect;
          }
          include dokuwiki.conf;
        }

        server {
          server_name wiki.host.org;
          root /path/to/dokuwiki;
          index doku.php;
          listen 443 ssl;
          keepalive_requests    10;
          keepalive_timeout     60 60;
          ssl_certificate      /etc/ssl/certs/ssl-cert-snakeoil.pem;
          ssl_certificate_key  /etc/ssl/private/ssl-cert-snakeoil.key;
          #switch back to plain http for normal view

          if ($args ~* (do=show|^$)){
            rewrite ^ http://$host$request_uri? redirect;
          }
          include dokuwiki.conf;
        }

For completeness sake, this goes into ``drop.conf``.

.. code-block:: nginx

    ### file: /etc/nginx/conf.d/drop.conf

    location = /robots.txt  { access_log off; log_not_found off; }
    location = /favicon.ico { access_log off; log_not_found off; }	
    location ~ /\.          { access_log off; log_not_found off; deny all; }
    location ~ ~$           { access_log off; log_not_found off; deny all; }

Rewrite rule
^^^^^^^^^^^^

Coming from apache, I realised that I have to install Dokuwiki inside root, because I couldn't rewrite the configuration accordingly. So I added this this to keep all the old links working that were pointing to ``host.tld/dokuwiki`` and redirect them to ``wiki.host.tld``.

.. code-block:: nginx

    rewrite ^/dokuwiki(/.*)?$ http://wiki.host.tld$1 permanent;

Full working config
^^^^^^^^^^^^^^^^^^^

Here below is a full config running in a vhost that can simply be copy pasted and of course change the domain name to your liking.

.. code-block:: nginx

    server {
      server_name wiki.ulyaoth.net;
      listen 80;
      autoindex off;
      client_max_body_size 15M;
      client_body_buffer_size 128k;
      index index.html index.htm index.php doku.php;
      access_log  /var/log/nginx/wiki.ulyaoth.net/access.log;
      error_log  /var/log/nginx/wiki.ulyaoth.net/error.log;
      root /usr/share/nginx/dokuwiki;

      location / {
        try_files $uri $uri/ @dokuwiki;
      }

      location ~ ^/lib.*\.(gif|png|ico|jpg)$ {
        expires 30d;
      }

      location = /robots.txt  { access_log off; log_not_found off; }
      location = /favicon.ico { access_log off; log_not_found off; }
      location ~ /\.          { access_log off; log_not_found off; deny all; }
      location ~ ~$           { access_log off; log_not_found off; deny all; }

      location @dokuwiki {
        rewrite ^/_media/(.*) /lib/exe/fetch.php?media=$1 last;
        rewrite ^/_detail/(.*) /lib/exe/detail.php?media=$1 last;
        rewrite ^/_export/([^/]+)/(.*) /doku.php?do=export_$1&id=$2 last;
        rewrite ^/(.*) /doku.php?id=$1 last;
      }

      location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass   unix:/var/run/php-fpm/wiki.ulyaoth.net.sock;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
        fastcgi_param  QUERY_STRING     $query_string;
        fastcgi_param  REQUEST_METHOD   $request_method;
        fastcgi_param  CONTENT_TYPE     $content_type;
        fastcgi_param  CONTENT_LENGTH   $content_length;
        fastcgi_intercept_errors        on;
        fastcgi_ignore_client_abort     off;
        fastcgi_connect_timeout 60;
        fastcgi_send_timeout 180;
        fastcgi_read_timeout 180;
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_temp_file_write_size 256k;
      }

      location ~ /(data|conf|bin|inc)/ {
        deny all;
      }

      location ~ /\.ht {
        deny  all;
      }

    }
