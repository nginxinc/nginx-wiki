MoinMoin
========

Recipe
------

in moin.wsgi:

.. code-block:: python

   app = make_application(shared=False)

This will let the web server serve the static content like CSS, JS, images.

.. code-block:: nginx

   location /wiki/moin_static193 {
       alias /path/to/MoinMoin/web/static/htdocs;
   }

   location /wiki {
       gzip off;
       include uwsgi_params;
       uwsgi_param SCRIPT_NAME /wiki;
       uwsgi_modifier1 30;
       uwsgi_pass unix:/path/to/uwsgi.socket;
   }

Should be obvious what this is once you've seen/done the WSGI configuration and read the `ngx_http_uwsgi_module <http://nginx.org/en/docs/http/ngx_http_uwsgi_module.html>`_ documentation.

Uwsgi also needs ``--ignore-script-name`` (or equivalent config file setting) for `MoinMoin <https://moinmo.in/>`_ otherwise it'll interpret it as a literal path. Moin doesn't do ``PATH_INFO`` very well (or at all).

