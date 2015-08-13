.. title:: Upstream Consistent Hash Module | NGINX

Upstream Consistent Hash
========================

Description
-----------
**ngx_http_upstream_consistent_hash** - a load balancer that uses an internal consistent hash ring to select the right backend node. It is designed to be compatible with ``memcache.hash_strategy = consistent`` of the *php-memcache* module. This means you can store values into a memcached cluster using the *php-memcache* module, and later Nginx can find that value in the cluster and read it from there.



Directives
----------

consistent_hash
^^^^^^^^^^^^^^^
:Syntax: *consistent_hash hash-key*
:Default: *none*
:Context: *upstream*

This parameter has to be inside the upstream definition. It turns on the consistent hash upstream module and also defines the string which has to be hashed to find the right backend on the hash ring. As an example, you could do this:

.. code-block:: nginx

  upstream somestream {
    consistent_hash $request_uri;
    server 10.50.1.3:11211;
    server 10.50.1.4:11211;
    server 10.50.1.5:11211;
  }

  ...

  server {
    listen       80;
    server_name  localhost;

    location / {
      default_type text/html;
      set $memcached_key $request_uri;
      memcached_pass somestream;
      error_page      500 404 405 = @fallback;
    }

    location @fallback {
      root /srv/www/whatever;
      fastcgi_intercept_errors on;
      error_page 404 = @404;

      set $script $uri;
      set $path_info "";

      include /usr/local/nginx/conf/fastcgi_params;
      fastcgi_param SCRIPT_FILENAME /srv/www/whatever/test.php;
      fastcgi_param SCRIPT_NAME $script;
      fastcgi_param REQUEST_URI $uri;
      fastcgi_pass   127.0.0.1:9000;
    }
  }
    

This example uses three backend servers. On initialization Nginx will create a hashring which contains each server (160 * weight) times in the same way as the *php-memcache* module with ``hash_strategy = consistent`` does. Based on a hash of ``$request_uri`` it will decide which backend server has to be used. Now the ``test.php`` script from the above example could look like following:

.. code-block:: php

  $memcache = new Memcache;

  $memcache->addServer('10.50.1.3', 11211);
  $memcache->addServer('10.50.1.4', 11211);
  $memcache->addServer('10.50.1.4', 11211);

  $memcache->set($_SERVER["REQUEST_URI"], $_SERVER["REQUEST_URI"] . "from memcache");



Important to know
-----------------
* I tested with the PHP memcache module version 1.2.8. It seems that the module in this version has a bug which causes it to completely ignore the weight if *hash_strategy* is set to consistent_hash. The Nginx consistent hash upstream knows the weight parameter, but if you use it together with memcache   module 1.2.8 you shouldn't touch the weight for any backend server.
  
* I tested the module with Nginx 0.7.61 and 0.6.34, no guarantee for other versions



Bugs/Feedback
-------------
If you find any bugs, please email me and I will try to help.

I would appreciate every kind of feedback or problem reports.

Mail: mauro.stettler(A.T)gmail.com 



Download
--------
On github I have to branches "master" and "dns". The reason for this is that if you want to use DNS entries on the PHP side, instead of IPs, you will need to apply a patch to the Nginx to make this work. So if your PHP does not use DNS names to connect to memcache, its nicer to download the "master" branch, because this is a clean module. If your PHP uses DNS names, you have to download the "dns" branch, which includes a patch for Nginx.

:github:`Download from GitHub <replay/ngx_http_consistent_hash>`
