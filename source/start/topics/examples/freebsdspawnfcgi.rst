
.. meta::
   :description: A "one size fits all" script to interface with spawn-fcgi in a friendly way.

FreeBSD Spawn FCGI Init Script
==============================

What is this
------------

A "one size fits all" script to interface with spawn-fcgi in a friendly way. It is provided with an example of how to launch PHP, but only needs quick modifying to work with anything that can run as a FastCGI process. Feel free to experiment - this also has been successfully tested with Python WSGI, CGILua, and the like for example.

Note to PHP users on FreeBSD: PHP-FPM support is available from the configure screen - this will allow you to do fine tuning over the FastCGI processes. In my own opinion, you should be using PHP-FPM over this.

Note to everyone else: I have recently switched this over to use UNIX sockets instead of TCP ports; if you want to use a TCP port instead, just type the port into SERVER_SOCKET, and then switch the -s switch to a -p switch in the fcgi_start function :)

File
----

``/usr/local/etc/rc.d/spawn-fcgi``


Usage
-----

``/usr/local/etc/rc.d/spawn-fcgi [(re)start|status|stop]``


Run this script on boot (add to /etc/rc.local):

``/usr/local/etc/rc.d/spawn-fcgi start``


Script
------

.. code-block:: bash

    #!/bin/sh
    # Modified spawn-fcgi for rc.d (original: vivek@nixcraft.com)
    NAME=php-cgi
    SPAWNFCGI=/usr/local/bin/spawn-fcgi
    FCGI_CHILDREN=3
    PROCESS_NAME=lua
    SERVER_SOCKET=/tmp/fcgi.socket
    SERVER_PID=/tmp/fcgi.pid
    SERVER_USER=www
    SERVER_GROUP=www
    FCGI_PROCESS=/usr/local/bin/php-cgi
    SOCKSTAT=/usr/bin/sockstat
    GREP=/usr/bin/grep
    KILLALL=/usr/bin/killall
    cmd=$1
    fcgi_restart()
    {
            fcgi_stop
            fcgi_start
    }
    fcgi_start()
    {
            $SPAWNFCGI -s $SERVER_SOCKET -P $SERVER_PID -u $SERVER_USER -g $SERVER_GROUP -F $FCGI_CHILDREN -f $FCGI_PROCESS
    }
    fcgi_stop()
    {
            $KILLALL $PROCESS_NAME
    }
    fcgi_status()
    {
            $SOCKSTAT -u | $GREP -i $SERVER_SOCKET > /dev/null
            [ $? -eq 0  ] && echo "$PROCESS_NAME is running" || echo "$PROCESS_NAME is not running!"
    }
    fcgi_help()
    {
            echo "Usage: $0 {(re)start|status|stop}"
    }
    case ${cmd} in
    [Rr][Ee][Ss][Tt][Aa][Rr][Tt]) fcgi_restart;;
    [Ss][Tt][Aa][Rr][Tt]) fcgi_start;;
    [Ss][Tt][Oo][Pp]) fcgi_stop;;
    [Ss][Tt][Aa][Tt][Uu][Ss]) fcgi_status;;
    *) fcgi_help;;
    esac

