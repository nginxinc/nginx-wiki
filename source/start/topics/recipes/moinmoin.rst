
.. meta::
   :description: A sample NGINX configuration for MoinMoin.

MoinMoin
========

Recipe
------

in moin.wsgi:

.. code-block:: python

   app = make_application(shared=False)

This will let the web server serve the static content like CSS, JS, images.

in moin config (usually mywiki.py):

.. code-block:: python

   class Config(FarmConfig):
      url_prefix_static = '/path/to/MoinMoin/web/static/htdocs'

.. code-block:: nginx

   location /path/to/MoinMoin/web/static/htdocs {
       alias /path/to/MoinMoin/web/static/htdocs;
   }

   location /wiki {
       gzip off;
       include uwsgi_params;
       uwsgi_param SCRIPT_NAME /wiki;
       uwsgi_modifier1 30;
       uwsgi_pass unix:/path/to/uwsgi.socket;
   }

Should be obvious what this is once you've seen/done the WSGI configuration and read the `ngx_http_uwsgi_module <https://nginx.org/en/docs/http/ngx_http_uwsgi_module.html>`_ documentation.

Uwsgi also needs ``--ignore-script-name`` (or equivalent config file setting) for `MoinMoin <https://moinmo.in/>`_ otherwise it'll interpret it as a literal path. Moin doesn't do ``PATH_INFO`` very well (or at all).

