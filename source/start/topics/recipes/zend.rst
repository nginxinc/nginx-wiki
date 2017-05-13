
.. meta::
   :description: A sample NGINX configuration for Zend Framework.

Zend Framework
==============

Synopsis
--------

The Zend Framework is a Model-View-Controller (MVC) framework and provides all the components required for most web applications in a single distribution. It can either be added to your existing PHP stack or comes included with the free and paid-for version of Zend Server.

Follow the `installation instructions on their website <https://framework.zend.com/manual/1.12/en/learning.quickstart.create-project.html>`_ in order to add Zend Framework to your already installed PHP stack:

    You can download the latest version of Zend Framework and extract the contents; make a note of where you have done so.
    Optionally, you can add the path to the library/ subdirectory of the archive to your php.ini's include_path setting.
    That's it! Zend Framework is now installed and ready to use.

If that is your preference, you can stop reading now and read-up on how to configure NGINX to work directly with :doc:`PHP FastCGI <../examples/phpfcgi>`

Alternatively, Zend Framework also comes packaged with both, the free and paid-for edition of `Zend Server <http://www.zend.com/en/products/zend_server>`_:

    Zend Server includes a production-ready, tested stack that incorporates PHP, Zend Framework, required extensions and drivers - all installed through RPM/DEB on Linux or MSI on Windows. Zend Server also support IBM i.

In the rest of this guide I am covering the integration of NGINX with Zend Server Free Edition for PHP Version 5.3. My installation is on Ubuntu 10.10 Maverick Meerkat, but it should work on yours just as well. Detailed installation instructions for all supported platforms are at http://files.zend.com/help/Zend-Server-6/zend-server.htm#installation_guide.htm

A few of my observations for your consideration
-----------------------------------------------

* beginning with Zend Server 6.1, NGINX is nativly suported by Zend Server
* in a non-NGINX setup, the Zend Server includes both, Apache 2.2 for serving your actual PHP application, and lighthttp for the Zend Server Administration GUI
* the number of additional packages and files from Zend are rather heavy-weight; you not only get PHP 5.3 (5.4 is also supported) but also the Zend Framework, Apache 2.2 and the Zend Server Administration GUI
* also, once you install Zend Server, your "native" PHP installation packages from your distro will be removed, since those are obsolete now
* on the upside, Zend provides repositories for Redhat/CentOS as well as Debian/Ubuntu, hence whenever you update your system, the Zend Server packages including your Zend Framework will be updated  with your regular update process, e.g. ``aptitude full-upgrade`` or ``yum update``. That is really nice, especially if you are using something like ``apticron``. No more out-dated PHP or Zend Framework libraries. Nice!
* starting with PHP 5.3 it seems not to be cool anymore (see the comments `here <https://www.linode.com/docs/websites/nginx/nginx-and-phpfastcgi-on-ubuntu-10-10-maverick/>`_ ) to use ``spawn-fcgi``. The new cool kid apparently is ``php-fpm``.

Allright, with no further ado, here we go ...

Automated installation instructions
-----------------------------------

Starting with Zend Server 6.1 you can use an automated installation script to install NGINX & Zend Server.

#. Download the package called "Zend Server (DEB/RPM Installer Script)" from zend.com - http://www.zend.com/en/products/server/downloads

#. Locate and extract the package: ZendServer-X.X.X-RepositioryInstaller-linux.tar.gz

#. To change to the directory with the installer scripts run:

    .. code-block:: bash

        cd ZendServer-RepositoryInstaller-linux/

#. Depending on the PHP version (5.3 or 5.4) you wish to use , run the following commands:

    .. code-block:: bash

        ./install_zs.sh <PHP Version> nginx

Manual installation instructions
--------------------------------

Again, since I am on Ubuntu, I was following the installations instructions for the http://files.zend.com/help/Zend-Server-6/zend-server.htm#deb_installing_zend_server.htm. This means you have to update ``/etc/apt/sources.list`` and import the GPG key for Zend's repository, so make sure you read the instructions carefully!

The following commands install the Zend Server Free Edition and stop both, the Apache 2.2 and Zend Server GUI afterwards:

.. code-block:: bash

    sudo aptitude update
    sudo aptitude install zend-server-php-5.3
    sudo service zend-server stop

Once that is done, you want to create a custom php-fastcgi script for ``Zend Server Free Edition`` that NGINX can use to forward PHP template processing to, just as you would do for a regular PHP installation. 

Create the file ``/etc/init.d/php-fastcgi`` as root and put the following content in it:

.. code-block:: bash

    #!/bin/bash
    # Inspired from /usr/local/zend/bin/lighttpdctl.sh
    # Zend GUI uses lighttpd and fastcgi - we want the same for NGINX
    # its all about the unix socket - if on the same machine
    # otherwise bind to address and port; this is similar to the "regular" php-fastcgi

    if [ -f /etc/zce.rc ];then
        . /etc/zce.rc
    else
        echo "/etc/zce.rc doesn't exist!"
        exit 1;
    fi

    start()
    {
        if ! kill -0 `cat $ZCE_PREFIX/tmp/php-fcgi.pid 2>/dev/null` 2>/dev/null;then
            killall -9  $ZCE_PREFIX/gui/lighttpd/sbin/php 2>/dev/null
            rm $ZCE_PREFIX/tmp/php-fcgi.pid 2>/dev/null
        fi
        $ZCE_PREFIX/gui/lighttpd/bin/spawn-fcgi \
          -s $ZCE_PREFIX/tmp/php-fastcgi.socket \
          -f "$ZCE_PREFIX/gui/lighttpd/sbin/php -c $ZCE_PREFIX/etc/php.ini" \
          -u zend -g zend -C 5 -P $ZCE_PREFIX/tmp/php-fcgi.pid
        chmod 666 $ZCE_PREFIX/tmp/php-fastcgi.socket
    }
    stop()
    {
        if ! kill -0 `cat $ZCE_PREFIX/tmp/php-fcgi.pid 2>/dev/null` 2>/dev/null;then
            killall -9 $ZCE_PREFIX/gui/lighttpd/sbin/php 2>/dev/null
            rm $ZCE_PREFIX/tmp/php-fastcgi.socket 2>/dev/null
            rm $ZCE_PREFIX/tmp/php-fcgi.pid 2>/dev/null
        else
            kill `cat $ZCE_PREFIX/tmp/php-fcgi.pid 2>/dev/null` 2>/dev/null
        fi

    }

    case "$1" in
            start)
                    start
                    ;;
            stop)
                    stop
                    ;;
            restart)
                    stop
                    sleep 1
                    start
                    ;;
            *)
                    usage
                    exit 1
    esac

    exit $?

You notice, we are lifting various settings from the Zend installation (/etc/zce.rc) that will have some impact on the configuration of NGINX. Particularly, I decided to use Unix sockets for performance reasons since I am on the same machine with both, NGINX and the ``Zend Server and Framework``. The rest of the file is heavily inspired by the start and stop scripts for the built-in Zend GUI (based on lighttpd) which also uses spawn-cgi!!

Next up, make the file executable and add it to your servers regular environment for controlling system daemons:

.. code-block:: bash

    cd /etc/init.d
    sudo chmod 644 php-fastcgi
    sudo chmod +x php-fastcgi
    sudo update-rc.d php-fastcgi defaults

In order to avoid port conflicts and save system resources, and of course we do not need Apache anymore, prevent Apache 2.2 and Zend GUI (lighttpd) from starting automatically.

.. code-block:: bash

    cd /etc/init.d
    sudo update-rc.d -f zend-server remove

Time for NGINX
--------------

Now, all that is left is to configure NGINX to forward all PHP requests to our newly installed ``Zend Server``
We are going to lean heavily on the regular instructions for :doc:`PHP FastCGI <../examples/phpfcgi>`. Just keep in mind that we are using Unix sockets, and not binding the Zend Sever PHP CGI process to a TCP/IP port. Therefore, this is what our configuration for PHP looks like. Also note: this is just the part in regards to plain PHP, most likely you would also want to make sure, no requests will be forwarded to Zend Server for any of your static or cached content!!

.. code-block:: nginx

    server {
      listen      80;
      server_name www.example.com;
      root        /var/www/www.example.com/myapplication;
      index       index.html index.htm index.php;

      location / {
        try_files $uri $uri/ /index.php$is_args$args;
      }

      location ~ \.php$ {
        fastcgi_pass   unix:/usr/local/zend/tmp/php-fastcgi.socket;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
      }
    }

Please pay special attention to the ``fastcgi_pass`` and ``fastcgi_param SCRIPT_FILENAME`` parameters; those must obviously point to your directories and files on your specific installation!!!

That should be it - give it a shot and good luck with it!!!

