.. meta::
   :description: The jdomain upstream module extends the upstream's load balancer to resolve an upstream domain name asynchronously.

Upstream Domain Resolve
=======================

Description
-----------

**ngx_upstream_jdomain** - an upstream module that resolves an upstream domain name asynchronously. Its buffer has the latest IPs of the backend domain name and it integrates with the configured load balancing algorithm (least_conn, hash, etc) or the built in round robin if none is explicitly defined. At every interval (one second by default), it resolves the domain name. If it fails to resolve the domain name, the buffer retains the last successfully resolved IPs or uses a backup server IP specified by the user.

.. warning:: The docs on this wiki can get out of date. For the authoritative information, please see the README file inside the module's :github:`git repository <nicholaschiasson/ngx_upstream_jdomain>`

Example
^^^^^^^
.. code-block:: nginx

	http {
		resolver 8.8.8.8;
		resolver_timeout 10s;

		upstream backend {
			server 127.0.0.1:55555 backup;
			jdomain example.com;
			keepalive 8;
		}
		
		server {
			listen 55555;
			return 502 'Panic!';

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
:Syntax: *jdomain <domain-name> [port=80] [interval=1] [max_ips=20] [strict]*
:Default: *-*
:Context: *upstream*
:``port``: Backend's listening port.
:``interval``: How many seconds to resolve domain name.
:``max_ips``: IP buffer size. Maximum number of resolved IPs to cache.
:``strict``: As long as there are is another server in the upstream block, require the DNS resolution to succeed and return addresses, otherwise marks the underlying server and peers as down and forces use of other servers in the upstream block. A failed resolution can be a timeout, DNS server failure, connection refusals, response with no addresses, etc.

Installation
------------

:github:`Download <nicholaschiasson/ngx_upstream_jdomain>` the module.

.. code-block:: bash

	--add-module=<path>

Authors
-------

Original author wdaike<wdaike@163.com>, Baidu Inc.

Questions, patches, and feature requests to Nicholas Chiasson <nicholasomerchiasson@gmail.com>
