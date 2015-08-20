
.. meta::
   :description: This page describes some of the options that you should consider when compiling NGINX.

Installation and Compile-Time Options
=====================================

The build is configured using the ``./configure`` command. It defines various aspects of the system, including the methods nginx is allowed to use for connection processing.
At the end it creates a Makefile. 

The configure command supports the following parameters:

Files and Permissions
^^^^^^^^^^^^^^^^^^^^^
**--prefix=*path***
  defines a directory that will keep server files. This same directory will also be used for all relative paths set by configure (except for paths to libraries sources) and in the nginx.conf configuration file. It is set to the ``/usr/local/nginx`` directory by default.
**--sbin-path=*path***
  sets the name of an nginx executable file. This name is used only during installation. By default the file is named ``prefix/sbin/nginx``.
**--conf-path=*path***
  sets the name of an ``nginx.conf`` configuration file. If needs be, nginx can always be started with a different configuration file, by specifying it in the command-line parameter ``-c file``. By default the file is named ``prefix/conf/nginx.conf``.
**--pid-path=*path***
  sets the name of an nginx.pid file that will store the process ID of the main process. After installation, the file name can always be changed in the ``nginx.conf`` configuration file using the pid directive. By default the file is named ``prefix/logs/nginx.pid``.
**--error-log-path=*path***
  sets the name of the primary error, warnings, and diagnostic file. After installation, the file name can always be changed in the ``nginx.conf`` configuration file using the `error log <|HttpCoreModule|#error_log>`_ directive. By default the file is named ``prefix/logs/error.log``. The special "stderr" value tells nginx to log pre-configuration messages to the standard error.
**--http-log-path=*path***
  sets the name of the primary request log file of the HTTP server. After installation, the file name can always be changed in the ``nginx.conf`` configuration file using the `access log <|HttpCoreModule|#access_log>`_ directive. By default the file is named ``prefix/logs/access.log``.
**--user=*name***
  sets the name of an unprivileged user whose credentials will be used by worker processes. After installation, the name can always be changed in the ``nginx.conf`` configuration file using the user directive. The default user name is nobody.
**--group=*name***
  sets the name of a group whose credentials will be used by worker processes. After installation, the name can always be changed in the ``nginx.conf`` configuration file using the user directive. By default, a group name is set to the name of an unprivileged user.

Event Loop
^^^^^^^^^^
**--with-select_module, --without-select_module**
  enables or disables building a module that allows the server to work with the ``select()`` method. This module is built automatically if the platform does not appear to support more appropriate methods such as ``kqueue``, ``epoll``, ``rtsig``, or ``/dev/poll``.
**--with-poll_module, --without-poll_module**
  enables or disables building a module that allows the server to work with the ``poll()`` method. This module is built automatically if the platform does not appear to support more appropriate methods such as ``kqueue``, ``epoll``, ``rtsig``, or ``/dev/poll``.

Optional Modules
^^^^^^^^^^^^^^^^
**--without-http_gzip_module**
  disables building a module that compresses responses of an HTTP server. The zlib library is required to build and run this module.
**--without-http_rewrite_module**
  disables building a module that allows an HTTP server to redirect requests and change URI of requests. The PCRE library is required to build and run this module. The module is experimental so its directives may change in the future.
**--without-http_proxy_module**
  disables building an HTTP server proxying module.
**--with-http_ssl_module**
  enables building a module that adds the HTTPS protocol support to an HTTP server. This module is not built by default. The OpenSSL library is required to build and run this module.
**--with-pcre=*path***
  sets the path to the sources of the PCRE library. The library distribution (version 4.4 — 8.21) needs to be downloaded from the PCRE site and extracted. The rest is done by nginx's ``./configure`` and ``make``. The library is required for regular expressions support in the location directive and for the |HttpRewriteModule|. See `notes <installoptions_notes_>`_ below for using system PCRE on FreeBSD systems.
**--with-pcre-jit**
  builds the PCRE library with "just-in-time compilation" support.
**--with-zlib=*path***
  sets the path to the sources of the zlib library. The library distribution (version 1.1.3 — 1.2.5) needs to be downloaded from the zlib site and extracted. The rest is done by nginx's ``./configure`` and ``make``. The library is required for the |HttpGzipModule|.

Compilation Controls
^^^^^^^^^^^^^^^^^^^^
**--with-cc-opt=*parameters***
  sets additional parameters that will be added to the *CFLAGS* variable.
**--with-ld-opt=*parameters***
  sets additional parameters that will be used during linking.



Example
-------
Example of parameters usage (all of this needs to be typed in one line):

.. code-block:: bash

  ./configure
      --sbin-path=/usr/local/nginx/nginx
      --conf-path=/usr/local/nginx/nginx.conf
      --pid-path=/usr/local/nginx/nginx.pid
      --with-http_ssl_module
      --with-pcre=../pcre-4.4
      --with-zlib=../zlib-1.1.3



.. _installoptions_notes:

Notes
-----
When using the system PCRE library under FreeBSD, the following options should be specified:

.. code-block:: bash

  --with-ld-opt="-L /usr/local/lib" \
  --with-cc-opt="-I /usr/local/include"


If the number of files supported by ``select()`` needs to be increased it can also be specified like this: 

.. code-block:: bash

  --with-cc-opt="-D FD_SETSIZE=2048"



References
----------
:doc:`install`
