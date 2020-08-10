.. meta::
   :description: The Upstream Domain Resolve module implements a load balancer that resolves an upstream domain name asynchronously.

Upstream Domain Resolve
=======================

Description
-----------

**ngx_upstream_jdomain** - a load-balancer that resolves an upstream domain name asynchronously. It chooses one IP from its buffer according to round-robin for each request. Its buffer has the latest IPs of the backend domain name. At every interval (one second by default), it resolves the domain name. If it fails to resolve the domain name, the buffer retains the last successfully resolved IPs or uses a fallback IP specified by the user.

Example
^^^^^^^
.. code-block:: nginx

	http {
		resolver 8.8.8.8;
		resolver_timeout 10s;

		upstream backend {
			jdomain  example.com;
			# keepalive 10;
		}

		server {
			listen 8080;
			location / {
				proxy_pass http://backend;
			}
		}
	}

Directives
----------

jdomain
^^^^^^^
:Syntax: *jdomain <domain-name> [port=80] [interval=1] [max_ips=20] [retry_off] [fallback= [strict]]*
:Default: *-*
:Context: *upstream*
:``port``: Backend's listening port.
:``interval``: How many seconds to resolve domain name.
:``max_ips``: IP buffer size.
:``retry_off``: Do not retry if one IP fails.
:``fallback``: Optional IP and port to use if <domain-name> resolves no IPs, resolves with a host not found error, or a format error.
:``strict``: Forces use of fallback even in case of other resolution errors, such as timeouts, DNS server failures, connection refusals, etc.

Installation
------------

:github:`Download <nicholaschiasson/ngx_upstream_jdomain>` the module.

.. code-block:: bash

	--add-module=<path>

Authors
-------

Original author wdaike<wdaike@163.com>, Baidu Inc.

Questions, patches, and feature requests to Nicholas Chiasson <nicholasomerchiasson@gmail.com>
