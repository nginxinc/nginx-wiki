
.. meta::
   :description: A sample NGINX configuration for Mailman.

.. _recipe-mailman:

Mailman
=======

`Mailman`_ is free software for managing electronic mail discussion and
e-newsletter lists. Mailman is integrated with the web, making it easy for users
to manage their accounts and for list owners to administer their lists. Mailman
supports built-in archiving, automatic bounce processing, content filtering,
digest delivery, spam filters, and more.

Mailman is crazy. This page used to focus on giving you options to install,
configure, and run it as you wish. Because of the crazy that is mailman, this
will show you the most common and best supported way to set up Mailman
software behind NGINX.

The Recipe
----------

.. code-block:: nginx

    server {
        listen XXX.XXX.XXX.XXX:80;
        server_name lists.DOMAIN.TLD;
        root /usr/lib;

        location = / {
            rewrite ^ /mailman/listinfo permanent;
        }

        location / {
            rewrite ^ /mailman$uri?$args;
        }

        location = /mailman/ {
            rewrite ^ /mailman/listinfo permanent;
        }

        location /mailman/ {
            include proxy_params;
            proxy_pass http://127.0.0.1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location /cgi-bin {
            rewrite ^/cgi-bin(.*)$ $1 permanent;
        }

        location /images/mailman {
            alias /var/lib/mailman/icons;
        }

        location /pipermail {
            alias /var/lib/mailman/archives/public;
            autoindex on;
        }
    }

CGI
---

In order for this to work you will need to have CGI processing available. There
are a few guides to this but I "hopefully" took the pain out of it.

Here, we're using thttpd. Edit the configuration file and make it match this
exactly.

/etc/thttpd/thttpd.conf:

::

    host=127.0.0.1
    port=80
    dir=/usr/lib/cgi-bin/mailman
    nochroot
    user=www-data
    cgipat=/**
    throttles=/etc/thttpd/throttle.conf
    logfile=/var/log/thttpd.log

Removing /cgi-bin/ from URL
---------------------------

Edit /usr/lib/mailman/Mailman/mm_cfg.py and change the following parameters.

.. code-block:: python

    DEFAULT_URL_PATTERN = 'http://%s/mailman/'
    PRIVATE_ARCHIVE_URL = '/mailman/private'

Fix Authentication
------------------

If you end up running into an issue where you have to authenticate for every
link clicked in the admin interface, you may have changed the URI. This would
happen if you are migrating from Apache or something else to NGINX. You can
either try to match what you were using previously by manipulating the location
blocks and thttpd config so the /mailman or the /cgi-bin/mailman will be passed
to mailman. The other option is to run the command below.

.. code-block:: bash

    while read list stuff; do withlist -l -r fix_url "$list"; done < <(list_lists)

This will clear that cache and let you access things normally again.

.. _`Mailman`: http://www.gnu.org/software/mailman/index.html
