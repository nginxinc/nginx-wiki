
.. meta::
   :description: How to set up an NGINX proxy that acts like Apache's ProxyPassReverse.

NGINX Solution for Apache ProxyPassReverse
==========================================

Apache 
------
Let's say we want to establish simple proxy between myhost:80 and myapp:8080. The Apache rule is simple:

.. code-block:: apache

  <VirtualHost myhost:80>
      ServerName myhost
      DocumentRoot /path/to/myapp/public
      ProxyPass / http://myapp:8080/
      ProxyPassReverse / http://myapp:8080/
  </VirtualHost>


But NGINX does not have ProxyPassReverse... The solution is adding a few missing HTTP headers. 

.. seealso:: `proxy_redirect <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_redirect>`_. This wiki is partly incorrect. If you need to do location header rewriting, then you will need to use `proxy_redirect <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_redirect>`_ as well.



NGINX
-----

.. code-block:: nginx

  server {
      listen myhost:80;
      server_name  myhost;
      location / {
          root /path/to/myapp/public;
          proxy_set_header X-Forwarded-Host $host:$server_port;
          proxy_set_header X-Forwarded-Server $host;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
          proxy_pass http://myapp:8080;
      }
  }

