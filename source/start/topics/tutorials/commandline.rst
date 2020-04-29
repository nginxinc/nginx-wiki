
.. meta::
   :description: This tutorial shows you how to start, stop, and control NGINX from the command line.

CommandLine
===========

Starting, Stopping, and Restarting NGINX
----------------------------------------
This page shows you how to start NGINX, and once it's running, how to control it so that it will stop or restart.


Starting NGINX
^^^^^^^^^^^^^^
NGINX is invoked from the command line, usually from ``/usr/bin/nginx``.

Basic Example of Starting NGINX
"""""""""""""""""""""""""""""""

.. code-block:: bash

  /usr/bin/nginx


Advanced Example of Starting NGINX
""""""""""""""""""""""""""""""""""

.. code-block:: bash

  /usr/bin/nginx -t -c ~/mynginx.conf -g "pid /var/run/nginx.pid; worker_processes 2;"


Options
^^^^^^^

+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-?, -h``        | Print help.                                                                                             |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-v``            | Print version.                                                                                          |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-V``            | Print NGINX version, compiler version and configure parameters.                                         |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-t``            | Don't run, just test the configuration file.                                                            |
|                   | NGINX checks configuration for correct syntax and then try to open files referred in configuration.     |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-q``            | Suppress non-error messages during configuration testing.                                               |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-s signal``     | Send signal to a master process: stop, quit, reopen, reload. (version >= 0.7.53)                        |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-p prefix``     | Set prefix path (default: ``/usr/local/nginx/``). (version >= 0.7.53)                                   |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-c filename``   | Specify which configuration file NGINX should use instead of the default.                               |
+-------------------+---------------------------------------------------------------------------------------------------------+
| ``-g directives`` | Set `global <https://nginx.org/en/docs/http/ngx_http_core_module.html>`_ directives. (version >= 0.7.4) |
+-------------------+---------------------------------------------------------------------------------------------------------+

.. note:: NGINX has only a few command-line parameters. Unlike many other software systems, the configuration is done entirely via the configuration file (imagine that).


Stopping or Restarting NGINX
----------------------------
There are two ways to control NGINX once it's already running.
The first is to call NGINX again with the ``-s`` command line parameter.
For example, ``/usr/bin/nginx -s stop`` will stop the NGINX server.
(other ``-s`` options are given in the previous section)

The second way to control NGINX is to send a signal to the NGINX master process...
By default NGINX writes its master process id to ``/usr/local/nginx/logs/nginx.pid``.
You can change this by passing parameter with ``./configure`` at compile-time or by using ``pid`` directive in the configuration file.

Here's how to send the ``QUIT`` (Graceful Shutdown) signal to the NGINX master process:

.. code-block:: bash

  kill -QUIT $( cat /usr/local/nginx/logs/nginx.pid )

The master process can handle the following signals:

+-----------+---------------------------------------------------------+
| TERM, INT | Quick shutdown                                          |
+-----------+---------------------------------------------------------+
| QUIT      | Graceful shutdown                                       |
+-----------+---------------------------------------------------------+
| KILL      | Halts a stubborn process                                |
+-----------+---------------------------------------------------------+
|           | Configuration reload                                    |
|           |                                                         |
| HUP       | Start the new worker processes with a new configuration |
|           |                                                         |
|           | Gracefully shutdown the old worker processes            |
+-----------+---------------------------------------------------------+
| USR1      | Reopen the log files                                    |
+-----------+---------------------------------------------------------+
| USR2      | Upgrade Executable on the fly                           |
+-----------+---------------------------------------------------------+
| WINCH     | Gracefully shutdown the worker processes                |
+-----------+---------------------------------------------------------+

There's no need to control the worker processes yourself.
However, they support some signals, too:

+-----------+----------------------+
| TERM, INT | Quick shutdown       |
+-----------+----------------------+
| QUIT      | Graceful shutdown    |
+-----------+----------------------+
| USR1      | Reopen the log files |
+-----------+----------------------+


Loading a New Configuration Using Signals
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
NGINX supports a few signals that you can use to control it's operation while it's running.

The most common of these is 15, which just stops the running process:

.. code-block:: bash

  USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
  root      2213  0.0  0.0   6784  2036 ?        Ss   03:01   0:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf


The more interesting option however, is being able to change the NGINX configuration on the fly (notice that we test the configuration prior to reloading it):

.. code-block:: bash

  2006/09/16 13:07:10 [info]  15686#0: the configuration file /etc/nginx/nginx.conf syntax is ok
  2006/09/16 13:07:10 [info]  15686#0: the configuration file /etc/nginx/nginx.conf was tested successfully
  USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
  root      2213  0.0  0.0   6784  2036 ?        Ss   03:01   0:00 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf


What happens is that when NGINX receives the ``HUP`` signal, it tries to parse the configuration file (the specified one, if present, otherwise the default), and if successful, tries to apply a new configuration (i.e. re-open the log files and listen sockets).
If successful, NGINX runs new worker processes and signals graceful shutdown to old workers.
Notified workers close listen sockets but continue to serve current clients.
After serving all clients old workers shutdown.
If NGINX couldn't successfully apply the new configuration, it continues to work with an old configuration.

RequestForReviewCategory -- (Request For Review: Just What Happens With The Worker Processes at a HUP? -Olle)


Upgrading To a New Binary On The Fly
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
If you need to replace NGINX binary with a new one (when upgrading to a new version or adding/removing server modules), you can do it without any service downtime - no incoming requests will be lost.

First, replace old binary with a new one, then send USR2 signal to the master process. It renames its ``.pid`` file to ``.oldbin`` (e.g. ``/usr/local/nginx/logs/nginx.pid.oldbin``), then executes a new binary, which in turn starts a new master process and the new worker processes:

.. code-block:: bash

  : PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
  33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
  33134 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
  33135 33126 nobody   0.0  1380 kqread nginx: worker process (nginx)
  33136 33126 nobody   0.0  1368 kqread nginx: worker process (nginx)
  36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
  36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)


At this point, two instances of NGINX are running, handling the incoming requests together.
To phase the old instance out, you have to send ``WINCH`` signal to the old master process, and its worker processes will start to gracefully shut down:

.. code-block:: bash

  : PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
  33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
  33135 33126 nobody   0.0  1380 kqread nginx: worker process is shutting down (nginx)
  36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
  36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)


After some time, old worker processes all quit and only new worker processes are handling the incoming requests:

.. code-block:: bash

  : PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
  33126     1 root     0.0  1164 pause  nginx: master process /usr/local/nginx/sbin/nginx
  36264 33126 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
  36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)


At this point you can still revert to the old server because it hasn't closed its listen sockets yet, by following these steps:

* Send ``HUP`` signal to the old master process - it will start the worker processes without reloading a configuration file
* Send ``QUIT`` signal to the new master process to gracefully shut down its worker processes
* Send ``TERM`` signal to the new master process to force it quit
* If for some reason new worker processes do not quit, send ``KILL`` signal to them

After new master process quits, the old master process removes ``.oldbin`` suffix from its ``.pid`` file, and everything is exactly as before the upgrade attempt.

If an update is successful and you want to keep the new server, send QUIT signal to the old master process to leave only new server running:

.. code-block:: bash

  : PID  PPID USER    %CPU   VSZ WCHAN  COMMAND
  : 36264     1 root     0.0  1148 pause  nginx: master process /usr/local/nginx/sbin/nginx
  : 36265 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  : 36266 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)
  : 36267 36264 nobody   0.0  1364 kqread nginx: worker process (nginx)


References
^^^^^^^^^^
* `Command Line Options <https://nginx.org/ru/docs/switches.html>`_
* `Signals <https://nginx.org/ru/docs/control.html>`_
