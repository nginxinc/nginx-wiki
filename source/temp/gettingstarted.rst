Getting Started
===============

Requirements
------------

* gzip module requires `zlib <http://www.zlib.net/>`_ library
* rewrite module requires `pcre <http://www.pcre.org/>`_ library
* ssl support requires openssl library



Download
--------
Go to the :doc:`install` Page of this wiki to download Nginx.
Alternatively, here is a link to the `English download page <http://nginx.org/en/download.html>`_ and the original `Russian download page <http://sysoev.ru/nginx/download.html>`_.



Installation
------------
After extracting the source, run these commands from a terminal:

.. code-block:: bash

  ./configure
  make
  sudo make install

By default, Nginx will be installed in ``/usr/local/nginx``. You may change this and other options with the :doc:`installoptions`.



Platform-specific Notes and Builds
----------------------------------
#. `Notes on building Nginx on Ubuntu <http://wiki.nginx.org/NginxPlatformUbuntu>`_
#. `Installing Nginx on Fedora, RHEL or CentOS <http://wiki.nginx.org/NginxPlatformFedora>`_
#. `How to get the latest Nginx on Gentoo <http://wiki.nginx.org/NginxPlatformGentoo>`_
#. `x86/64 build for Solaris <https://www.joyent.com/blog/ok-nginx-is-cool>`_
#. `Nginx for Windows (32-bit); development, stable, and legacy binaries available <http://kevinworthington.com/nginx-for-windows/>`_

..
  [Error 104] connection reset by peer
  #. `Nginx building script for Slackware <http://dotimes.com/slackbuilds/nginx/>`_

..
  [Errno 2] Temporary failure in name resolution
  #. `How to Compile nginx on MacOSX <http://nginx.darwinports.com/>`_


Running Nginx
-------------
Start the server by running ``/usr/local/nginx/sbin/nginx`` as root.
After editing the configuration file at ``/usr/local/nginx/conf/nginx.conf`` to your liking, you can reload the configuration with:

.. code-block:: bash

  kill -HUP `cat /usr/local/nginx/logs/nginx.pid`

The location of nginx.pid might be different on your machine.
For Ubuntu, it is located at ``/var/run/nginx.pid``

.. seealso::

  * :doc:`commandline` for more command-line options and process signals
  * :doc:`faq` for solutions to common problems
   
  ..
    Temporarily omitted
    * `modules` for learning more about nginx modules
    * `configuration` for a configuration reference
    * `community` if you still can't find the answers to your questions


Advanced topics
---------------
* `Optimizing Nginx <http://wiki.nginx.org/NginxOptimizations>`_
* :doc:`debugging`
