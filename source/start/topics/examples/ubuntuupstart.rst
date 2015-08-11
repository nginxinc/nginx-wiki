Ubuntu Upstart
==============

Save this file as ``/etc/init/nginx.conf``

.. code-block:: bash

   # nginx

   description "nginx http daemon"
   author "George Shammas <georgyo@gmail.com>"

   start on (filesystem and net-device-up IFACE=lo)
   stop on runlevel [!2345]

   env DAEMON=/usr/sbin/nginx
   env PID=/var/run/nginx.pid

   expect fork
   respawn
   respawn limit 10 5
   #oom never

   pre-start script
           $DAEMON -t
           if [ $? -ne 0 ]
                   then exit $?
           fi
   end script

   exec $DAEMON

``respawn`` tells upstart to keep nginx master process alive and expect fork tracks ngnix after the fork. pre-start script helps say when the services fails

``respawn limit`` tells that if the process is respawned more than 10 times within an interval of 5 seconds, the process will be stopped automatically, and not restarted (the default upstart value).

Then check the upstart job list:

.. code-block:: bash

   # initctl list | grep nginx

and start the job:

.. code-block:: bash

   # initctl start nginx
