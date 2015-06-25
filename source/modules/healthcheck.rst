HTTP Healthcheck
================

Description
-----------
**ngx_http_healthcheck_module** - polls backends and if they respond with 
HTTP 200 + an optional request body, they are marked good. Otherwise, they 
are marked bad.

You can get the module from :github:`GitHub <cep21/healthcheck_nginx_upstreams>`

.. note:: This also gives you access to a health status page that lets you 
  seehow well your healthcheck are doing.

.. note:: *This module is not distributed with the Nginx source.* See the 
  `installation instructions <healthcheck.installation_>`_.

.. warning:: The docs on this wiki can get out of date. For the authoritative 
  information, please see the README file inside the plugin's 
  :github:`git repository <cep21/healthcheck_nginx_upstreams>`



Directives
----------

healthcheck_enabled
^^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_enabled*
:Default: *none*
:Context: *upstream*

Enables health checking of an upstream



healthcheck_delay
^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_delay <milliseconds>*
:Default: *10000*
:Context: *upstream*

Delay in msec between healthchecks for a single peer.



healthcheck_timeout
^^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_timeout <milliseconds>*
:Default: *2000*
:Context: *upstream*

How many milliseconds a healthcheck is allowed to take place



healthcheck_failcount
^^^^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_failcount <count>*
:Default: *2*
:Context: *upstream*

Number of healthchecks good or bad in a row it takes to switch from down 
to up and back. Good to prevent flapping



healthcheck_send
^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_send <content>*
:Default: *empty*
:Context: *upstream*

Required directive.  What to send for the healthcheck.  Each argument is 
appended by \r\n and the entire thing is suffixed with another \r\n. 
For example,

.. code-block:: nginx

  healthcheck_send 'GET /health HTTP/1.0'
   'Host: www.yourhost.com';


.. note:: You probably want to end your health check with some directive 
  that closes the connection, like Connection: close.



healthcheck_expected
^^^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_expected <content>*
:Default: *unset*
:Context: *upstream*

What to expect in the HTTP BODY, (meaning not the headers), in a correct 
response.  If unset, just a HTTP 200 status code is required for a peer



healthcheck_buffer
^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_buffer <size>*
:Default: *1000*
:Context: *upstream*

How big a buffer to use for the health check. Remember to include headers 
PLUS body, not just body.



healthcheck_status
^^^^^^^^^^^^^^^^^^
:Syntax: *healthcheck_status*
:Default: *none*
:Context: *upstream*

When inside a /location block, replaced the HTTP body with backend health 
status. Use similarly to the stub_status module.



.. _healthcheck.installation:

Installation
------------
This module is not distributed with the Nginx source. You can download the 
module from :github:`here <cep21/healthcheck_nginx_upstreams>` 
Read the installation instructions inside the README file.



Bugs
----
Please report bugs to :github:`here <cep21/healthcheck_nginx_upstreams/issues>`