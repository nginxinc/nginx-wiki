MyBB
====

Recipe
------

.. code-block:: nginx

    server {
        server_name quantifiedselfforum.com;

        access_log logs/qsforum.access;
        error_log logs/qsforum.error error;

        root /var/www/qsforum;

        location / {
            index index.php;
        }

        # Deny access to internal files.
        location ~ /(inc|uploads/avatars) {
            deny all;
        }

        # Pass the php scripts to fastcgi server
        location ~ \.php$ {
            fastcgi_pass unix:/tmp/php.socket;
            # Necessary for php.
            fastcgi_param SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            # Unmodified fastcgi_params from nginx distribution.
            include fastcgi_params;
        }

    }

There is a potential security flaw, e.g. if a user uploads an avatar images pic.gif with valid PHP-Code and calls it with /uploades/avatars/pic.gif/foo.php. The issue is discussed `here <http://wiki.nginx.org/Pitfalls#Passing_Uncontrolled_Requests_to_PHP>`_. Because the link is ending with .php, nginx is passing it to the PHP interpreter. PHP can't find the file /uploades/avatars/pic.gif/foo.php, but it tries to be smart and executes /uploades/avatars/pic.gif as an PHP-script. To avoid this, you need to set cgi.fix_pathinfo=0 in your php.ini, which is set to cgi.fix_pathinfo=1 as default (unfortunately).

See :doc:`../examples/phpfcgi` for details on creating the UNIX socket and `this forum post <http://community.mybb.com/thread-51764.html>`_ on enabling human-understandable (aka SEO-friendly or human-readable) URLs using the Google SEO plugin.

