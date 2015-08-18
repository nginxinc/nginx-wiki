
.. meta::
   :description: The HTTP rDNS module enables reverse DNS lookups for incoming connections and provides simple access control for incoming hostnames.

HTTP rDNS
=========

Description
-----------
**ngx_http_rdns_module** - enables reverse DNS (rDNS) lookups for incoming connections and provides simple access control of incoming hostname by allow/deny rules (similar to HttpAccessModule allow/deny directives; regular expressions are supported). Module works with the DNS server defined by the standard resolver directive.



Features
--------
* usual rDNS lookup (saving result in $rdns_hostname variable);
* "double lookup": rDNS to get the name and DNS to get the IP address back;
* rewrite module support (``rdns`` can be used inside ``if`` blocks);
* simple access control to allow/deny connections from given DNS names.

You can get the module on :github:`GitHub <flant/nginx-http-rdns>`

.. note:: *This module is not distributed with nginx source.* See the `installation instructions <rdns.installation_>`_.



Directives
----------

rdns
^^^^
:Syntax: *rdns [ on | off | double ]*
:Default: *none*
:Context: *http, server, location, if-in-server, if-in-location*
:Phase: *rewrite*

Enables/disables rDNS lookups.

:``on``: enable rDNS lookup in this context.
:``off``: disable rDNS lookup in this context.
:``double``: enable double DNS lookup in this context. If the reverse lookup (rDNS request) succeeded, module performs a forward lookup (DNS request) for its result. If this forward lookup has failed or none of the forward lookup IP addresses have matched the original address, *$rdns_hostname* is set to ``not found``.

The *$rdns_hostname* variable may have:

- result of lookup;
- special value ``not found`` if not found or error occurred during request;
- special value ``-`` if lookup disabled.

After performing a lookup, module restarts request handling pipeline to make new $rdns_hostname variable value visible to other directives.

.. note::
  Internally, in server's or location's ``if``, module works through rewrite module codes. When any enabling directive (``on`` or ``double``) are executed for the first time, it enables DNS lookup and makes a break (to prevent executing further directives in this ``if``). After the lookup is done, directives in ``if`` using rewrite module codes are executed for the second time, without any breaks. Disabling directive (``off``) makes no breaks.

  Core module resolver should be defined to use this directive.


rdns_allow
^^^^^^^^^^
:Syntax: *rdns_allow regex*
:Default: *none*
:Context: *http, server, location*
:Phase: *access*

Grants access for domain matched by regular expression.


rdns_deny
^^^^^^^^^
:Syntax: *rdns_deny regex*
:Default: *none*
:Context: *http, server, location*
:Phase: *access*

Forbids access for domain matched by regular expression.


.. note::
  The ``rdns_allow`` and ``rdns_deny`` directives define a new access list for the context in which they are used.
  Access list inheritance in contexts works only if child context doesn't define own rules.
  
  
Warning on named locations
^^^^^^^^^^^^^^^^^^^^^^^^^^
Making rDNS requests in named locations isn't supported and may invoke a loop. For example:

.. code-block:: nginx

  server {
      rdns on;

      location / {
          echo_exec @foo;
      }

      location @foo {
          #...
      }
  }


Being in a named location and restarting request handling pipeline, nginx continue its request handling in usual (unnamed) location. That's why this example will make a loop if you don't disable the module in your named location. The correct config for this example should be as follows:

.. code-block:: nginx

  server {
      rdns on;

      location / {
          echo_exec @foo;
      }

      location @foo {
          rdns off;
          #...
      }
  }



.. _rdns.installation:

Installation
------------
Get source code from :github:`GitHub <flant/nginx-http-rdns>` and follow common :doc:`3rd party modules instructions <index>`.



Bugs / patches
--------------
Please, report bugs & propose your patches at :github:`GitHub <flant/nginx-http-rdns>`



Credits
-------
The original version of this module has been designed by Dmitry Stolyarov, written by Timofey Kirillov, `CJSC Flant <http://flant.com/>`_.



Links
-----
* Source code on GitHub: https://github.com/flant/nginx-http-rdns
* Module homepage (in Russian): http://flant.ru/projects/nginx-http-rdns
