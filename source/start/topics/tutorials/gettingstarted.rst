
.. meta::
   :description: Just getting started with NGINX? Well, you've come to the right place! This page outlines the next steps that you'll need to take.

Getting Started
===============

Requirements
------------

* gzip module requires `zlib <http://www.zlib.net/>`_ library
* rewrite module requires `pcre <http://www.pcre.org/>`_ library
* ssl support requires openssl library



Download
--------
Go to the :doc:`install` Page of this wiki to download NGINX.
Alternatively, here is a link to the `English download page <https://nginx.org/en/download.html>`_ and the original `Russian download page <https://nginx.org/ru/download.html>`_.



Installation
------------
After extracting the source, run these commands from a terminal:

.. code-block:: bash

  ./configure
  make
  sudo make install

By default, NGINX will be installed in ``/usr/local/nginx``. You may change this and other options with the :doc:`installoptions`.



Platform-specific Notes and Builds
----------------------------------

.. todo::
   ..
      #. :doc:`platformubuntu`
      #. :doc:`platformfedora`
      #. :doc:`platformgentoo`
   
#. `x86/64 build for Solaris <https://jasonhoffman.blog/2007/04/25/ok-nginx-is-cool>`_
#. `NGINX for Windows (32-bit); development, stable, and legacy binaries available <https://kevinworthington.com/nginx-for-windows/>`_

..
   Dead links
   #. `x86/64 build for Solaris <https://www.joyent.com/blog/ok-nginx-is-cool>`_
   #. `NGINX building script for Slackware <http://dotimes.com/slackbuilds/nginx/>`_
   #. `How to Compile NGINX on MacOSX <http://nginx.darwinports.com/>`_


Running NGINX
-------------
Start the server by running ``/usr/local/nginx/sbin/nginx`` as root.
After editing the configuration file at ``/usr/local/nginx/conf/nginx.conf`` to your liking, you can reload the configuration with:

.. code-block:: bash

  kill -HUP `cat /usr/local/nginx/logs/nginx.pid`

The location of nginx.pid might be different on your machine.
For Ubuntu, it is located at ``/var/run/nginx.pid``

.. seealso::

   * :doc:`commandline` for more command-line options and process signals
   * :doc:`../../../community/faq` for solutions to common problems
   * :doc:`../../../community/index` if you still can't find the answers to your questions

.. todo::
   ..
      * :doc:`modules` for learning more about NGINX modules
      * :doc:`configuration` for a configuration reference


Advanced topics
---------------
* :doc:`debugging`
* :doc:`optimizations`
