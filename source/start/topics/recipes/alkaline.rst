.. _recipe-alkaline:

Alkaline
========

This configuration can be used with a default installation of Alkaline v1.1.

Requirements
------------

* :ref:`tutorials-phpfpm`

Recipe
------

.. code-block:: nginx

    server {
        server_name example.com;
        root /var/www/alkaline;

        rewrite ^/admin/search/page([0-9]+)(/)?$
            /admin/search.php?page=$1 last;
        rewrite ^/admin/search/([a-z0-9-_]+)(/)?$
            /admin/search.php?act=$1 last;
        rewrite ^/admin/search/([a-z0-9-_]+)/page([0-9]+)(/)?$
            /admin/search.php?act=$1&page=$2 last;
        rewrite ^/admin/search/([a-z0-9-_]+)/([0-9]+)(/)?$
            /admin/search.php?act=$1&id=$2 last;
        rewrite ^/admin/search/([a-z0-9-_]+)/([0-9]+)/page([0-9]+)(/)?$
            /admin/search.php?act=$1&id=$2&page=$3 last;
        rewrite ^/admin/([a-z0-9-_]+)(/)?$
            /admin/$1.php last;
        rewrite ^/admin/([a-z0-9-_]+)/([0-9]+)(/)?$
            /admin/$1.php?id=$2 last;
        rewrite ^/admin/([a-z0-9-_]+)/page([0-9]+)(/)?$
            /admin/$1.php?page=$2 last;
        rewrite ^/admin/([a-z0-9-_]+)/([a-z0-9-_]+)(/)?$
            /admin/$1.php?act=$2 last;


        rewrite ^/access(/)?([a-z0-9-_]*)(/)?$
            /access.php?id=$2 last;
        rewrite ^/atom(/)?$
            /atom.php last;
        rewrite ^/page([0-9]+)(/)?$
            /index.php?page=$1 last;
        rewrite ^/image/([a-z0-9-_]+)(/)?$
            /image.php?id=$1 last;
        rewrite ^/page/([a-z0-9-_]+)(/)?$
            /page.php?id=$1 last;
        rewrite ^/post/([a-z0-9-_]+)(/)?$
            /post.php?id=$1 last;
        rewrite ^/set/([a-z0-9-_]+)(/)?(page)?([0-9]*)(/)?$
            /set.php?id=$1&page=$4 last;
        rewrite ^/tag/([a-z0-9-_]+)(/)?(page)?([0-9]*)(/)?$
            /tag.php?id=$1&page=$4 last;
        rewrite ^/slideshow(/)?$
            /slideshow.php last;
        rewrite ^/search(/)?$
            /search.php last;
        rewrite ^/results(/)?$
            /results.php last;
        rewrite ^/results/page([0-9]+)(/)?$
            /results.php?page=$1 last;
        rewrite ^/blog(/)?(page)?([0-9]*)(/)?$
            /blog.php?page=$3 last;
        rewrite ^/([0-9]+)/([0-9]+)/([0-9]+)(/)?(page)?([0-9]*)(/)?$
            /archive.php?y=$1&m=$2&d=$3&page=$6 last;
        rewrite ^/([0-9]+)/([0-9]+)(/)?(page)?([0-9]*)(/)?$
            /archive.php?y=$1&m=$2&page=$5 last;
        rewrite ^/([0-9]+)(/)?(page)?([0-9]*)(/)?$
            /archive.php?y=$1&page=$4 last;
        rewrite ^/with/([a-z0-9-_]+)(/)?$
            /index.php?with=$1 last;

        # Make index.php the default request
        location / {
            index  index.php index.html index.htm;
        }

        # Pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        location ~ \.php$ {
            fastcgi_pass    127.0.0.1:9000;
            fastcgi_index   index.php;
            fastcgi_param   SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include     fastcgi_params;
        }

        # Deny access to private folders
        location ~ /(db|update)/[^/]*$ {
            deny all;
            access_log off;
            log_not_found off;
        }

        # Deny access to original images
        location ~ /images/[0-9]*\. {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
