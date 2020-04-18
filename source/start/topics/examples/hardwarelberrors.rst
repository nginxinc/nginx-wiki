
.. meta::
   :description: An example NGINX configuration that can test the readiness of your backend machines.

Hardware Loadbalancer Check Errors
==================================

Some Hardware Load-balancers such Cisco's CSS and BigIP Products test the readiness of the backend Machines with  ``SYN-ACK-RST``.

This behavior causes a 400 error in NGINX.

With the `GEO Module <https://nginx.org/en/docs/http/ngx_http_geo_module.html>`_  and the ``if-Statement`` you can omit these entries:

.. code-block:: nginx

    http {
      geo  $lb  {
        default      0;
        10.1.1.1/32  1;   # LB IPs
        10.1.1.2/32  1;
      }

      # ...

      server {
        # ...
        access_log   /path/to/log;
        error_page 400 /400;

        location = /400 {
          if ($lb) {
            access_log  off;
          }
          return 400;
        }
      }
    }

