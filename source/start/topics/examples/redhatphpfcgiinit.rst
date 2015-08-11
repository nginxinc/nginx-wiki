PHP/FastCGI Init Script for Red Hat systems
===========================================

Should work on RHEL, Fedora, CentOS.   Tested on CentOS 5.

Note: Before running the init script you need to touch the pid file and change the ownership to the php user

.. code-block:: bash

   # touch /var/run/phpfcgi.pid
   # chown php:php /var/run/phpfcgi.pid

Save this file as ``/etc/init.d/phpfcgi``

.. code-block:: bash

    #!/bin/bash
    #
    # Startup script for the PHP FastCGI server.
    #
    # chkconfig: 345 85 15
    # description: PHP is an HTML-embedded scripting language
    # processname: php
    # config: /etc/php.ini

    # Source function library.
    . /etc/rc.d/init.d/functions

    PHPFCGI="/usr/bin/php-cgi"
    FCGIPORT="9000"
    FCGIADDR="127.0.0.1"
    FCGI_WEB_SERVER_ADDRS="127.0.0.1"
    PHP_FCGI_CHILDREN=5
    PHP_FCGI_MAX_REQUESTS=1000
    ALLOWED_ENV="PATH USER"
    PHPUSER=php
    PIDFILE=/var/run/phpfcgi.pid

    if [ -z "$PHP_FCGI_CHILDREN" ]; then
      PHP_FCGI_CHILDREN=5
    fi

    ALLOWED_ENV="$ALLOWED_ENV PHP_FCGI_CHILDREN PHP_FCGI_MAX_REQUESTS FCGI_WEB_SERVER_ADDRS"

    case "$1" in
      start)
            PHPFCGI_START=$"Starting ${NAME} service: "
            echo -n $PHPFCGI_START

            # check for $PHPUSER, create if non-existent
            if [ -z "`id -u $PHPUSER 2> /dev/null`" ]; then
                useradd -s /sbin/nologin $PHPUSER
            fi

            # clean environment
            E=
            for i in $ALLOWED_ENV; do E="$E $i=${!i}"; done
            daemon --user $PHPUSER --pidfile $PIDFILE "env - $E $PHPFCGI -q -b $FCGIADDR:$FCGIPORT &> /dev/null &"

            pid=`pidof php-cgi`
            if [ -n "$pid" ]; then
                echo $pid > $PIDFILE
                success $PHPFCGI_START
            else
                failure $PHPFCGI_START
            fi
            echo
            ;;
      stop)
            echo -n "Stopping php-fcgi: "
            killproc -p $PIDFILE phpfcgi
            echo
            ;;
      status)
            status phpfcgi
            ;;
      restart)
            $0 stop
            $0 start
            ;;
      *)
            echo "Usage: $0 {start|stop|status|restart}"
            exit 1
    esac

    exit 0

Ensure that the init script is executable:

.. code-block:: bash

   # chmod +x /etc/init.d/phpfcgi


Now you should be able to stop, start, and restart PHP with the usual Red Hat commands:

.. code-block:: bash

   # service phpfcgi start
   # service phpfcgi stop
   # chkconfig phpfcgi on

