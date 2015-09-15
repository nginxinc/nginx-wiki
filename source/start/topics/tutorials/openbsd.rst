
.. meta::
   :description: How to install, build, test, and control NGINX on OpenBSD.

Installing and configuring NGINX / Mongrel on OpenBSD with Rails support
========================================================================

Install the PCRE library
------------------------

It is advised you be familiar with installing packages on OpenBSD before proceeding. You can find OpenBSD's package documentation `here <http://www.openbsd.org/faq/faq15.html>`_.

.. code-block:: bash

    $ sudo pkg_add -v pcre

Download and extract the NGINX sources
--------------------------------------

Make sure to appropriately substitute the version numbers below:

.. code-block:: bash

    $ wget http://sysoev.ru/nginx/nginx-X.X.XX.tar.gz
    $ tar -xzvf nginx-X.X.XX.tar.gz

Configure the Makefile
----------------------

.. code-block:: bash

    $ cd nginx-X.X.XX/

.. code-block:: bash

    $ ./configure --sbin-path=/usr/local/sbin/nginx \
                  --conf-path=/etc/nginx/nginx.conf \
                  --pid-path=/var/run/nginx.pid \
                  --with-http_ssl_module \ 
                  --http-log-path=/var/log/nginx.log \ 
                  --error-log-path=/var/log/nginx-error.log \ 
                  --http-fastcgi-temp-path=/var/tmp/fastcgi_tmp \ 
                  --http-proxy-temp-path=/var/tmp/proxy_tmp \ 
                  --http-client-body-temp-path=/var/tmp/client_body_temp \ 
                  --with-http_stub_status_module \ 
                  --user=www --group=www

Compile and install
-------------------

.. code-block:: bash

    $ make && sudo make install

After NGINX has been installed, make sure to edit ``/etc/nginx/nginx.conf`` according to your needs.

Log files
---------

By default, NGINX saves its logs as ``/var/log/nginx.log`` and ``/var/log/nginx-error.log``. You may wish to configure NGINX so that it saves its logs on a per-host basis.

Initializing Mongrel Cluster from your path/to/app/rails/
---------------------------------------------------------

.. todo::
   ..
      Codemongers is gone, so this needs revising...

      You can take the sample nginx.conf file from http://wiki.codemongers.com/NginxRubyonRailsMongrel and adjusting it to app

      .. code-block:: bash

         $ cd /var/www/rails_app/
         $ sudo mongrel_rails cluster::configure 
         $ sudo mongrel_rails cluster::start

Starting NGINX
--------------

.. code-block:: bash

    $ sudo /usr/local/sbin/nginx

Testing, appoint your browser to rails app (localhost, default here)
--------------------------------------------------------------------

.. code-block:: bash

    $ lynx http://localhost

Restarting NGINX
----------------

.. code-block:: bash

   $ sudo kill -HUP $(head -1 /var/run/nginx.pid)

Shutting down NGINX
-------------------

.. code-block:: bash

   $ sudo kill -QUIT $(cat /var/run/nginx.pid)

Final notes
-----------

The initial motivation for this article was a rapid introduction to install and setup NGINX on OpenBSD.
Currently exist a port under ``/usr/ports/www/nginx``. It can be the best way to install and handle new NGINX versions on this Operating System.

Whenever it article is nice and functional.

