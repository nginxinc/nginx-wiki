Django FastCGI
==============

You should manage this fastcgi server with a script.

The socket solution seems better if you need flexibility in adding new sites without having to check your ports organisation.

Assuming your sites are organised as::

   sites/
       site1/
           manage.py
           settings.py
           __init__.py
           app1/
           app2/
           media/
       site2/
           ...

and you have placed the pid (and socket) file(s) in a ``RUNFILES_PATH`` folder (like in the script in the above link).

Nginx configuration
-------------------

Put this configuration in your nginx.conf file (or in a ``sites-{available/enabled}/`` conf file if you want to use the "include" instruction).
It was working immediately with the default configuration from my Ubuntu Karmic, using the ubuntu repository version of Nginx (which provides ``/etc/init.d/nginx stop|start|restart``).

.. code-block:: nginx

    # inside a http section
    # replace the several paths and names
    server {
        listen   80;
        server_name  {server name};

        access_log  {path to log file};

        location /media {
            root   {path to sites}/siteYY/;
            # I use a symbolic link called "admin" in the media/ folder
            # (pointing to /usr/local/lib/python2.6/dist-packages/django/contrib/admin/media/ in my case)
            # as suggested in http://docs.djangoproject.com/en/dev/howto/deployment/modpython/#serving-the-admin-files
            # so that nginx serves the django admin media files with the parameter
            # ADMIN_MEDIA_PREFIX set to '/media/admin/' in settings.py
        }

        location / {
            fastcgi_pass unix:RUNFILES_PATH/siteYY.socket;
            # for a TCP host/port:
            # fastcgi_pass   {hostname}:{port};

            # necessary parameter
            fastcgi_param PATH_INFO $fastcgi_script_name;

            # to deal with POST requests
            fastcgi_param REQUEST_METHOD $request_method;
            fastcgi_param CONTENT_TYPE $content_type;
            fastcgi_param CONTENT_LENGTH $content_length;

            # http://stackoverflow.com/questions/605173/how-to-nginx-virtual-servers-fcgi-for-django uses many other parameters,
            # some may be necessary in some situations
        }
    }

Serving simultaneously a debug and a prod version of the same site
------------------------------------------------------------------

In the same folder as your regular ``settings.py`` (with ``DEBUG`` set to False),
create a ``settings_debug.py`` file containing:

.. code-block:: python

   DEBUG = True

You can now launch another "``manage.py runfcgi``" from the siteYY folder, with the additional
parameter --settings=siteYY.settings_debug, on a different socket or port,
and create another virtualhost (see :doc:`server_blocks`).

Django through Spawning
-----------------------

Requirements
^^^^^^^^^^^^

You will need `Spawning <https://pypi.python.org/pypi/Spawning>`_, and `PasteDeploy <http://pythonpaste.org/deploy/>`_.
You can install both of them with easy_install.

If your sites are organised as::

   sites/
       site1/
           manage.py
           settings.py
           __init__.py
           app1/
           app2/
           media/
       site2/
           ...

From the "sites" folder:

.. code-block:: bash

   $ sudo spawn --factory=spawning.django_factory.config_factory siteYY.settings --port={PORT NUMBER}

Nginx settings
^^^^^^^^^^^^^^

We just configure it as a proxy to the port defined in spawn.

The location directive is now (the rest being the same as in the section Django through ``manage.py runfcgi``):

.. code-block:: nginx

    location / {
        proxy_pass http://0.0.0.0:{PORT NUMBER};
        # http://127.0.0.1:{PORT NUMBER} or http://localhost:{PORT NUMBER} should work as well, choose the one you prefer
        proxy_redirect default;

        # various possible options
        # proxy_set_header X-Forwarded-Host $server_name;
        # proxy_set_header X-Real-IP $remote_addr;
        # proxy_set_header X-Forwarded-For $remote_addr;
    }

Django + FastCGI + Nginx on RHEL4
---------------------------------

install nginx
^^^^^^^^^^^^^

.. code-block:: bash

    $ wget http://altruistic.lbl.gov/mirrors/centos/4.4/os/i386/CentOS/RPMS/pcre-4.5-3.2.RHEL4.i386.rpm
    $ wget http://altruistic.lbl.gov/mirrors/centos/4.4/os/i386/CentOS/RPMS/pcre-devel-4.5-3.2.RHEL4.i386.rpm
    $ sudo rpm -Uvh pcre-4.5-3.2.RHEL4.i386.rpm pcre-devel-4.5-3.2.RHEL4.i386.rpm
    $ wget http://sysoev.ru/nginx/nginx-0.5.17.tar.gz
    $ tar xvzf nginx-0.5.17.tar.gz
    $ cd nginx-0.5.17

.. code-block:: bash

    $ ./configure --sbin-path=/usr/local/bin/nginx  --pid-path=/usr/local/nginx/nginx.pid  \
      --conf-path=/usr/local/nginx/nginx.conf  --with-http_ssl_module --with-cc-opt="-I /usr/include/pcre"
    $ make
    $ sudo make install

nginx configuration
^^^^^^^^^^^^^^^^^^^

This example is overly complicated and needs to be cleaned up.

.. code-block:: nginx

    # search and replace this: {project_location}

    pid {project_location}/log/nginx.pid;
    worker_processes  2;
    error_log {project_location}/log/error_log;

    events {
      worker_connections  1024;
      use epoll;
    }

    http {
      # default nginx location
      include        /usr/local/nginx/mime.types;
      default_type    application/octet-stream;
      log_format main
          '$remote_addr - $remote_user [$time_local] '
          '"$request" $status $bytes_sent '
          '"$http_referer" "$http_user_agent" '
          '"$gzip_ratio"';

      client_header_timeout  3m;
      client_body_timeout    3m;
      send_timeout           3m;
      connection_pool_size        256;
      client_header_buffer_size    1k;
      large_client_header_buffers    4 2k;
      request_pool_size        4k;
      output_buffers   4 32k;
      postpone_output  1460;
      sendfile        on;
      tcp_nopush             on;
      keepalive_timeout      75 20;
      tcp_nodelay            on;

      client_max_body_size       10m;
      client_body_buffer_size    256k;
      proxy_connect_timeout      90;
      proxy_send_timeout         90;
      proxy_read_timeout         90;
      client_body_temp_path      {project_location}/log/client_body_temp;
      proxy_temp_path            {project_location}/log/proxy_temp;
      fastcgi_temp_path            {project_location}/log/fastcgi_temp;

      gzip on;
      gzip_min_length  1100;
      gzip_buffers     4 32k;
      gzip_types       text/plain text/html application/x-javascript text/xml text/css;
 
      ignore_invalid_headers    on;

      server {
        listen 8000;
        server_name localhost;
        index index.html;
        root   {project_location}/public;
        # static resources

        location ~* ^.+\.(html|jpg|jpeg|gif|png|ico|css|zip|tgz|gz|rar|bz2|doc|xls|exe|pdf|ppt|txt|tar|mid|midi|wav|bmp|rtf|js)$
        {
          expires 30d;
          break;
        }

        location / {
          # host and port to fastcgi server
          fastcgi_pass unix:{project_location}/log/django.sock;
          fastcgi_param PATH_INFO $fastcgi_script_name;
          fastcgi_param REQUEST_METHOD $request_method;
          fastcgi_param QUERY_STRING $query_string;
          fastcgi_param CONTENT_TYPE $content_type;
          fastcgi_param CONTENT_LENGTH $content_length;
          fastcgi_pass_header Authorization;
          fastcgi_intercept_errors off;
        }

        location /403.html {
          root   /usr/local/nginx;
          access_log   off;
        }

        location /401.html {
          root   /usr/local/nginx;
          access_log   off;
        }

        location /404.html {
          root   /usr/local/nginx;
          access_log   off;
        }

        location = /_.gif {
          empty_gif;
          access_log   off;
        }

        access_log    {project_location}/log/localhost.access_log main;
        error_log    {project_location}/log/localhost.error_log;
      }
    }

django fastcgi
--------------

start
^^^^^

.. code-block:: bash

   cd {project_location}
   python ./manage.py runfcgi --settings={project}.settings_production maxchildren=10 \
   maxspare=5 minspare=2 method=prefork socket={project_location}/log/django.sock pidfile={project_location}/log/django.pid

stop
^^^^

.. code-block:: bash

   kill -9 `cat {project_location}/log/django.pid`

nginx frontend
--------------

start
^^^^^

.. code-block:: bash

   nginx -c {project_location}/conf/nginx.conf

stop
^^^^

.. code-block:: bash

   kill -WINCH `cat {project_location}/log/nginx.pid` && kill -9 `cat {project_location}/log/nginx.pid`

