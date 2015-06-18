WordPress
=========

`Nginx <http://nginx.org>`_ works perfectly well with a wide variety of applications, and `WordPress <https://wordpress.org>`_ is certainly one of them.  Nginx's configuration language is very powerful and straightforward if one is familiar with it, but often people coming from other servers are not sure how things work in Nginx and just copy and paste whatever they see from a blog that seems to fill their needs.  Everyone, especially people new to Nginx, should check out the `nginx.org documentation <http://nginx.org/en/docs/>`_ for an overview of how things work and should be done in Nginx.

Recipe
------

Abridged basic setup
^^^^^^^^^^^^^^^^^^^^

Hopefully you have read the documentation above and maybe worked on setting up a virtual server or two in Nginx already - if not there are a few notes below, but you should still read the documentation.

First we setup a named upstream for our php, which allows us to abstract the backend and easily change the port or add more backends. After that, we setup our virtual host configuration for domain.tld.

.. code-block:: nginx

    # Upstream to abstract backend connection(s) for php
    upstream php {
            server unix:/tmp/php-cgi.socket;
            server 127.0.0.1:9000;
    }

    server {
            ## Your website name goes here.
            server_name domain.tld;
            ## Your only path reference.
            root /var/www/wordpress;
            ## This should be in your http block and if it is, it's not needed here.
            index index.php;

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
                    # This is cool because no php is touched for static content. 
                    # include the "?$args" part so non-default permalinks doesn't break when using query string
                    try_files $uri $uri/ /index.php?$args;
            }

            location ~ \.php$ {
                    #NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
                    include fastcgi.conf;
                    fastcgi_intercept_errors on;
                    fastcgi_pass php;
            }

            location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                    expires max;
                    log_not_found off;
            }
    }

With this configuration we should be able to serve wordpress very easily. Once you setup your backend (php-cgi or php-fpm) should work perfectly.

Location Strategies
^^^^^^^^^^^^^^^^^^^

There are many ways to declare your locations in your configuration that allow you to do basically whatever you want with your URLs. Usually, people want to have "pretty" URLs that hide the query strings and script files. Here are a few different strategies based on different goals. Here we are defining locations that should be used to replace the basic locations above in order to achieve the desired results.

Non-root try_files to URL redirect
""""""""""""""""""""""""""""""""""

If you want to serve WordPress as a sub directory, you will want to make the following changes (relative to the above configuration).

.. code-block:: nginx

        location /wordpress {
                try_files $uri $uri/ /wordpress/index.php?$args;
        }

        location ~ \.php$ {
                fastcgi_split_path_info ^(/wordpress)(/.*)$;
        }

Pre-0.8.30 fastcgi settings
"""""""""""""""""""""""""""

If you are using a version below 0.8.30, you will want to add this to your fastcgi_params file.

.. code-block:: nginx

    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;


Rewrite rules for Multisite
^^^^^^^^^^^^^^^^^^^^^^^^^^^

`WordPress Multisite <http://codex.wordpress.org/Create_A_Network>`_ can be used in multiple ways. Most notably "subdirectories" mode and "subdomains" mode. 

Nginx provides 2 special directive: `X-Accel-Redirect <http://wiki.nginx.org/XSendfile>`_ and `map <http://nginx.org/en/docs/http/ngx_http_map_module.html#map>`_. Using these 2 directives, one can eliminate performance hit for static-file serving on WordPress multisite network.

Rewrite rules for Multisite using subdirectories
""""""""""""""""""""""""""""""""""""""""""""""""

.. code-block:: nginx

    map $uri $blogname{
        ~^(?P<blogpath>/[^/]+/)files/(.*)	$blogpath ;
    }

    map $blogname $blogid{
        default -999;

        #Ref: http://wordpress.org/extend/plugins/nginx-helper/
        #include /var/www/wordpress/wp-content/plugins/nginx-helper/map.conf ;
    }

    server {
        server_name example.com ;

        root /var/www/example.com/htdocs;
        index index.php;

        location ~ ^(/[^/]+/)?files/(.+) {
            try_files /wp-content/blogs.dir/$blogid/files/$2 /wp-includes/ms-files.php?file=$2 ;
            access_log off;	log_not_found off; expires max;
        }

        #avoid php readfile()
        location ^~ /blogs.dir {
            internal;
            alias /var/www/example.com/htdocs/wp-content/blogs.dir ;
            access_log off;	log_not_found off; expires max;
        }

        if (!-e $request_filename) {
            rewrite /wp-admin$ $scheme://$host$uri/ permanent;	
            rewrite ^(/[^/]+)?(/wp-.*) $2 last; 
            rewrite ^(/[^/]+)?(/.*\.php) $2 last; 
        }

        location / {
            try_files $uri $uri/ /index.php?$args ;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include fastcgi_params;
            fastcgi_pass php;
        }

        #add some rules for static content expiry-headers here
    }

Rewrite rules for Multisite using subdomains
""""""""""""""""""""""""""""""""""""""""""""

.. code-block:: nginx

    map $http_host $blogid {
        default       -999;

        #Ref: http://wordpress.org/extend/plugins/nginx-helper/
        #include /var/www/wordpress/wp-content/plugins/nginx-helper/map.conf ;

    }

    server {
        server_name example.com *.example.com ;

        root /var/www/example.com/htdocs;
        index index.php;

        location / {
            try_files $uri $uri/ /index.php?$args ;
        }

        location ~ \.php$ {
            try_files $uri =404;
            include fastcgi_params;
            fastcgi_pass php;
        }

        #WPMU Files
            location ~ ^/files/(.*)$ {
                    try_files /wp-content/blogs.dir/$blogid/$uri /wp-includes/ms-files.php?file=$1 ;
                    access_log off; log_not_found off;      expires max;
            }

        #WPMU x-sendfile to avoid php readfile()
        location ^~ /blogs.dir {
            internal;
            alias /var/www/example.com/htdocs/wp-content/blogs.dir;
            access_log off;	log_not_found off;	expires max;
        }

        #add some rules for static content expiry-headers here
    }

.. note::

    * For wordpress-nginx based sites management, `EasyEngine <https://github.com/rtCamp/easyengine>`_ can be used. EasyEngine is collection of shell scripts for Ubuntu.
    * map section can be completed manually for small sites. On large multisite network `nginx-helper <https://wordpress.org/plugins/nginx-helper/>`_ wordpress plugin can be used.
    * Further performance gain is possible by using Nginx's fastcgi_cache. When using `fastcgi_cache <http://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_cache>`_, compile nginx with `ngx_cache_purge <https://github.com/FRiCKLE/ngx_cache_purge>`_ module and add a wordpress-plugin which performs automatic cache purge on events e.g. a wordpress post/page is edited.
    * `Nginx Cache Controller <https://wordpress.org/plugins/nginx-champuru/>`_ WordPress plugin provides some functions of controlling Nginx proxy server cache.
    * `Nginx Mobile Theme <https://wordpress.org/plugins/nginx-mobile-theme/>`_ WordPress plugin allows you to switch theme according to the User Agent on the Nginx reverse proxy.
