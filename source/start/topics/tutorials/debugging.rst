
.. meta::
   :description: This tutorial explains how to use some of NGINX's essential debugging features.

Debugging
=========

Introduction
------------
NGINX has wide range of debugging features, including detailed debug log. 

.. note:: Most debugging nits are only activated when NGINX compiled with *--with-debug* configure argument.



Debugging log
-------------
See `a debugging log <http://nginx.org/en/docs/debugging_log.html>`_ in documentation for details.

To activate debugging log you have to compile NGINX with *--with-debug* configure option and set debug level in `error_log <http://nginx.org/en/docs/http/ngx_http_core_module.html#error_log>`_ directive.

It's possible to debug only connections from specified addresses via `debug_connection <http://nginx.org/en/docs/ngx_core_module.html#debug_connection>`_ directive.

.. note:: In hard cases (e.g. debugging event method related problems) it's good idea to obtain full debugging log by setting debug level in global *error_log*.



Core dump
---------
To obtain core dump you usually have to tune your OS. Though NGINX simplifies some typical cases and usually adding

.. code-block:: nginx

  worker_rlimit_core  500M;
  working_directory   /path/to/cores/;

to nginx.conf is enough. Then run gdb to obtain backtrace as usual, e.g.

.. code-block:: bash

  gdb /path/to/nginx /path/to/cores/nginx.core
  backtrace full

If your gdb backtrace warns that No symbol table info available. then you will need to recompile NGINX with the appropriate compiler flags for debugging symbols.

The exact flags required depend on the compiler used. If you use GCC, the flag ``-g`` enables the inclusion of debugging symbols. 
Additionally disabling compiler optimization using ``-O0`` will make the debugger output easier to understand.

.. code-block:: bash

  CFLAGS="-g -O0" ./configure ....



Socket leaks
------------
Sometimes socket leaks happen. 
This usually results in ``[alert] 15248#0: open socket #123 left in connection 456`` messages in error log on NGINX reload/restart/shutdown. 
To debug add 

.. code-block:: bash
  
  debug_points abort;

to ``nginx.conf`` and configure core dumps (see above). 
This will result in ``abort()`` call once NGINX detects leak and core dump.

Something like this in gdb should be usefull (assuming 456 is connection number from error message from the process which dumped core):

.. code-block:: bash

  set $c = &ngx_cycle->connections[456]
  p $c->log->connection
  p *$c
  set $r = (ngx_http_request_t *) $c->data
  p *$r

In particular, ``p $c->log->connection`` will print connection number as used in logs. 
It will be possible to grep debug log for relevant lines, e.g.

.. code-block:: bash

  fgrep ' *12345678 ' /path/to/error_log;



Asking for help
---------------
When asking for help with debugging please provide:

* ``nginx -V`` output
* full config
* debug log
* backtrace (if NGINX exits on signal)
