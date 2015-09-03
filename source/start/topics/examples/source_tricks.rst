
.. meta::
   :description: A couple handy bash one-liners that display information about your NGINX configuration's server context.

... More to come, but needed some place to put PiotrSikora's handy
little commands (and will expand on them later):

PiotrSikora
===========

All Directives in Server context
--------------------------------

.. code-block:: bash

   find src/ -type f -name "*.c" -exec grep -B1 NGX_HTTP_SRV_CONF {} \; | grep ngx_string | cut -d\" -f2

All Variables in HTTP context
-----------------------------

.. code-block:: bash

   find src/ -type f -name "*.c" -exec grep -B2 NGX_HTTP_VAR {} \; | grep ngx_string | cut -d\" -f2

