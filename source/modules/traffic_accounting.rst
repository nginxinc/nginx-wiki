
.. meta::
   :description: Monitor the incoming and outgoing traffic metrics in realtime for NGINX.

Traffic Accounting
==================

**traffic-accounting-nginx-module** is a cost-effective solution to monitor the traffic metrics/status of application requests.

How it works?
-------------

The module keeps in its context a list of metrics identified by accounting_id.

When a new request hits the server, the module will try to find its accounting_id, calculate statistics, and aggregate them into the corresponding metrics by accounting_id.

For every period (defined by interval), a timer event is triggered, those metrics are rotated and exported to log files or sent to remote log servers.

Usage
-----

Starting from nginx 1.9.11, it's possible to compile this module as a dynamic module, by using the ``--add-dynamic-module=PATH`` option instead of ``--add-module=PATH`` on the ``./configure`` command line.  Then it's possible to explicitly load the module in a ``nginx.conf`` via the ``load_module`` (http://nginx.org/en/docs/ngx_core_module.html#load_module)
directive:

``load_module modules/ngx_http_accounting_module.so;``
``load_module modules/ngx_stream_accounting_module.so;``

Example configuration

.. code-block:: nginx

  http {
      accounting      on;
      accounting_log  logs/http-accounting.log;

      server {
          ...

          accounting_id  $http_host;  # set accounting_id string by variable

          location / {
              ...

              accounting_id  "accounting_id_str";  # set accounting_id string by location
          }

          location /api {
              accounting_id  "API_PC";   # for pc

              if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
                  accounting_id  "API_MOBILE";   # for mobile
              }

              ...
          }
      }
  }


Directives
----------

accounting
^^^^^^^^^^
:Syntax: *accounting <on|off>*
:Default: *off*
:Context: *http, stream*

accounting_log
^^^^^^^^^^^^^^
:Syntax: *accounting_log </path/to/accounting_log> [level]*
:Default: *-*
:Context: *http, stream*

Support same kind of log target as *error_log*: local file, syslog, stderr and memory.
Refer to `error_log <http://nginx.org/en/docs/ngx_core_module.html#error_log>` synopsis.

accounting_interval
^^^^^^^^^^^^^^^^^^^
:Syntax: *accounting_interval <seconds>*
:Default: *60*
:Context: *http, stream*

Specifies the reporting interval. Defaults to 60 seconds.

accounting_perturb
^^^^^^^^^^^^^^^^^^
:Syntax: *accounting_interval <on|off>*
:Default: *off*
:Context: *http, stream*

Randomly staggers the reporting interval by 20% from the usual time.

accounting_id
^^^^^^^^^^^^^
:Syntax: *accounting_id <accounting_id>*
:Default: *"default"*
:Context: *http, stream, server, location, if in location*

Sets the *accounting_id* string by user defined variable.
This string is used to determine which metrics a request/session should be aggregated to.

Authors
-------

See :github:`Lax/traffic-accounting-nginx-module#authors`

Copyright & License
-------------------

See :github:`Lax/traffic-accounting-nginx-module#license`

See Also
--------

The step by step setup can be found :github:`here <Lax/traffic-accounting-nginx-module#installation>`

Please visit :github:`github <Lax/traffic-accounting-nginx-module>` for more details.
