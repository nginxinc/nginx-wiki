SSL-Offloader
=============

Preface
-------
I want to thank Igor Sysoev for this nice piece of software.
For me, this is the only way to contribute something to this great project.
I've tried to document the whole picture of building what we simply call our "SSL-Proxy" (aka. SSL/TLS/HTTPS-Offloader/-Accelerator/-Terminator/-Dispatcher/Reverse-Proxy/Loadbalancer etc.).

In our company we use Nginx as a reverse proxy, serving HTTPS to the client while getting the content via HTTP from the multiple backends.
We have two virtual machines "connected" with VRRP to one cluster, acting as a frontend for about 80 Tomcat servers (and some IIS, Apache/PHP ...), each with one or more applications.
There were many reasons for this structure: One CI (ITIL: change item) for SSL certificates, customer demands (one URL xyz with multiple services), simple but effective failover mechanism for changes and so on.

**Update 2014, success story:**
  This Nginx setup as a reverse ssl-proxy with our "super-url's" works perfectly for over 7 years (in this time we changed the ubuntu versions several times - from hardy to precise).
  Today only two applications left and couldn't be included in this scheme.
  The configuration without comments has about 7000 lines.
  We have about 10 changes in the setup per week and we can do all of them on fly (using reload).
  The security audits of these applications never showed topics like "unpatched ssl versions" again, the web-services team can concentrate on deploying applications with no need to touch an apache configuration ever again and we (the networking team) can solve every access issue by ourself.

**And a little warning at the beginning**

#. Everything I try to describe here are finally some sorts of "reverse proxy" configurations.
   If your backend application only uses relative paths, everything will be fine.
   If they use absolute path, it could became complicated.
   If you could deploy it with the right path-prefix, everything is okay again.
   If the applications insists in the root path, it could be impossible - even if you could parse the returning code (html, css, js etc.).
#. Somebody maybe wants "simpler" solutions, some kind of an appliance working "out-of-the" box.
   My experience with this matter is: The operation of a central entry point for many applications with all their unique characteristics is unfortunatly this complex.
   Don't expect from an appliance more than save buttons and a fancy web-gui for similar settings as described here.
   At this point you are entering the twilight zone between configuration and programming, because your proxy is mostly an integral part of a bigger "web-program".



Technical Data
--------------
The server works very efficient:

#. Hypervisor: VMware ESXi
#. VM: 4x CPU (load: ~0.15), 768 MByte RAM (used: ~12%), 4 GByte HD
#. Base system: Ubuntu 12.04.5/precise
#. Working horse: Nginx 1.6.2-5+precise0 (`ppa:nginx/stable <https://launchpad.net/~nginx/+archive/ubuntu/stable>`_)
#. SSL-Library: LibSSL 1.0.1-4ubuntu5.21
#. Entropy-Daemon: haveged 1.1-2
#. VRRP daemon: Keepalived 1:1.2.2-3ubuntu1.1
#. Software watchdog: Monit 1:5.3.2-1
#. NTP alternative: Chrony 1.24-3.1ubuntu1 (one socket)



Considerations
--------------

Configuration
^^^^^^^^^^^^^
Some kind of a policy ...

#. To avoid problems when updating, the layout of the configuration files and directories should be an addition to the existing ones of the installation.
#. Each setting has to be unique. This leads on the other hand to some additional references of small ``include``-files and a complex layout.
#. ``if``-statement couldn't be nested, Therefore avoid using ``include``-statements inside them.
#. When including whole directories use file extentions as a switch.

New generated directories in ``/etc/nginx``:

* conf.d
* mapping/<segment>/<application>
* sslcerts/<domain of the channel>/[<app-group>|wildcard].[crt|key]
* sites-enabled/<ip-slot>_<app-group>.<customer>.any.<segment>
* scripts


Naming Convention
^^^^^^^^^^^^^^^^^
We had one internal (ADS) domain, some official ones and a complex situation:

* entry point/channel: LAN users (lan), Internet (ext), some kind of a VPN/WAN (vn2) and a old VPN without DNS (vn1)
* customers: Our company, several workgroups, lables, subsidiaries and externel customers
* life cycle/segment: development (dev), integration-1 and -2 (ig1/ig2), approval (apv), demonstration (dem) and production (prd)
* environments: real (local) and labor

Our solution was to start two whole new DNS-Trees and move the application name from DNS to the path::

  http(s)://<app-group>.<customer>.<channel>.<segment>.[local|labor]/<application>/

In the case of production systems, these were mapped to official domains.

.. tip::
  #. Use ``pdnsd`` as a DNS dispatcher on your proxy.
  #. Maybe you shouldn't use the ``*.local`` domain as we did, if you want to use services like **avahi** ...


Application Server
^^^^^^^^^^^^^^^^^^
Most important ...

#. You can reduce your work, if you have one "intelligent" application with different themes for diffenrent customers
#. For Java applications we use the ``Remote IP Valve`` to betray the Tomcat about his URL (like apache+ajp does)



Preparation
-----------

Network Settings
^^^^^^^^^^^^^^^^
I put the network settings into the file ``/etc/sysctl.d/10-network-security.conf``.
Some of the setting were allready in the original configuration.

::

  ### http://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html

  # Avoid a smurf attack
  net.ipv4.icmp_echo_ignore_broadcasts = 1

  # Turn on protection for bad icmp error messages
  net.ipv4.icmp_ignore_bogus_error_responses = 1

  # Turn on syncookies for SYN flood attack protection
  net.ipv4.tcp_syncookies = 1

  # Turn on and log spoofed, source routed, and redirect packets
  #net.ipv4.conf.all.log_martians = 1
  #net.ipv4.conf.default.log_martians = 1

  # No source routed packets here
  net.ipv4.conf.all.accept_source_route = 0
  net.ipv4.conf.default.accept_source_route = 0

  # Turn on reverse path filtering
  net.ipv4.conf.all.rp_filter = 1
  net.ipv4.conf.default.rp_filter = 1

  # Make sure no one can alter the routing tables
  net.ipv4.conf.all.accept_redirects = 0
  net.ipv4.conf.default.accept_redirects = 0
  net.ipv4.conf.all.secure_redirects = 0
  net.ipv4.conf.default.secure_redirects = 0

  # Don't act as a router
  net.ipv4.ip_forward = 0
  net.ipv4.conf.all.send_redirects = 0
  net.ipv4.conf.default.send_redirects = 0

  # Turn on execshild
  kernel.exec-shield = 1
  kernel.randomize_va_space = 1

  # Tuen IPv6
  net.ipv6.conf.default.router_solicitations = 0
  net.ipv6.conf.default.accept_ra_rtr_pref = 0
  net.ipv6.conf.default.accept_ra_pinfo = 0
  net.ipv6.conf.default.accept_ra_defrtr = 0
  net.ipv6.conf.default.autoconf = 0
  net.ipv6.conf.default.dad_transmits = 0
  net.ipv6.conf.default.max_addresses = 1

  # Optimization for port usefor LBs
  # Increase system file descriptor limit
  fs.file-max = 65535

  # Allow for more PIDs (to reduce rollover problems)
  # !!! may break some programs 32768
  #kernel.pid_max = 65536

  # Increase system IP port limits
  net.ipv4.ip_local_port_range = 2000 65000

  # Increase TCP max buffer size setable using setsockopt()
  net.ipv4.tcp_rmem = 4096 87380 8388608
  net.ipv4.tcp_wmem = 4096 87380 8388608

  # Increase Linux auto tuning TCP buffer limits
  # min, default, and max number of bytes to use
  # set max to at least 4MB, or higher if you use very high BDP paths
  # Tcp Windows etc
  net.core.rmem_max = 8388608
  net.core.wmem_max = 8388608
  net.core.netdev_max_backlog = 5000
  net.ipv4.tcp_window_scaling = 1


Virtual Addresses
^^^^^^^^^^^^^^^^^
This is the VRRP configuration ``/etc/keepalived/keepalived.conf`` of one system.
There are two instances configured.
In the case of a failure both VRRP addresses belong to the remaining system.
For the second system change the values of "state" and "priority".

.. note:: You have to restart the ``keepalived`` after you set an interface in promiscuous mode (eg. if you use tcpdump for debugging).

::

  vrrp_instance ONE {
          state MASTER
          priority 120
          interface eth0
          virtual_router_id <id-1>
          advert_int 1
          authentication {
                  auth_type pass
                  auth_pass <pass-1>
          }
          virtual_ipaddress_excluded {
                  <vrrp-ipv4-1>
                  <vrrp-ipv6-1>
          }
  }

  vrrp_instance TWO {
          state BACKUP
          priority 80
          interface eth0
          virtual_router_id <id-2>
          advert_int 1
          authentication {
                  auth_type pass
                  auth_pass <pass-2>
          }
          virtual_ipaddress_excluded {
                  <vrrp-ipv4-2>
                  <vrrp-ipv6-2>
          }
  }


HTTPS Addresses
^^^^^^^^^^^^^^^
One possible solution is to use direct routing and not a NAT (network address translation).
In this case you need local ip addresses with fit to the server of the nginx configuration.
In the file ``/etc/network/interfaces`` you can add a ``post-up`` command for the dummy (or loopback) interface like this.
Don't forget to add the modules ``dummy`` to ``/etc/modules``.

.. code-block:: bash

  auto lo
  iface lo inet loopback

  auto eth0
  iface eth0 inet static
      ...
      post-up /etc/nginx/conf.d/ip-mtu.sh
  iface eth0 inet6 static
      ...

  auto dummy0
  iface dummy0 inet manual
          up      /sbin/ip link set dummy0 up
          post-up /etc/nginx/conf.d/ip-addr.sh
          down    /sbin/ip link set dummy0 down


The referenced script should correct some arp issues, do a blackhole routing to avoid ping-pong packets of the routed networks and of course add the network addresses.

.. code-block:: bash

  #!/bin/bash

  echo 0 > /proc/sys/net/ipv4/ip_no_pmtu_disc
  echo 1 > /proc/sys/net/ipv4/tcp_mtu_probing
  echo 2 > /proc/sys/net/ipv4/conf/all/arp_announce
  echo 1 > /proc/sys/net/ipv4/conf/all/arp_ignore
  echo 2 > /proc/sys/net/ipv4/conf/dummy0/arp_announce
  echo 1 > /proc/sys/net/ipv4/conf/dummy0/arp_ignore

  ip route add blackhole <network-1>
  ip route add blackhole <network-2>
  ...
  ip route add blackhole <network-n>

  ip addr add <address-1>/32  dev dummy0 label <label-1>
  ip addr add <address-2>/32  dev dummy0 label <label-2>
  ...
  ip addr add <address-x>/32  dev dummy0 label <label-x>


Maybe you need a second file for all settings with requires a working network interface
(e.g. if you have to fix some MTU/MSS values, you have to route to real ips on a real interfaces).

.. code-block:: bash

  #!/bin/bash

  # VPN Networks with broken PMTU
  # (ADVMSS = MTU - 40)
  ip route add <host-/network-1> via <default gateway> mtu <mtu> advmss <mtu-40>
  ip route add <host-/network-2> via <default gateway> mtu <mtu> advmss <mtu-40>
  ...
  ip route add <host-/network-m> via <default gateway> mtu <mtu> advmss <mtu-40>



Core Configuration
------------------

nginx.conf
^^^^^^^^^^
I decided to change not too much in the default config file ``/etc/nginx/nginx.conf``.
The VM has four cores, each core get one fixed worker, and I wanted nginx to get an better priority than other processes.
All other setting were included
(the included file ``mime.types`` is taken from the project `HTML5-Boilerplate <https://github.com/h5bp/server-configs-nginx/blob/master/mime.types>`_).

.. code-block:: nginx

  worker_processes 4;
  worker_priority -1;
  worker_rlimit_nofile 8192;
  worker_cpu_affinity 0001 0010 0100 1000;

  user      www-data;
  pid       /var/run/nginx.pid;
  error_log /var/log/nginx/error.log;

  events {
      multi_accept on;
      worker_connections 4096;
  }

  http {
      map_hash_bucket_size 128;
      include /etc/nginx/mime.types;
      include /etc/nginx/conf.d/*.conf;
      include /etc/nginx/sites-enabled/*;
  }


sslproxy.conf
^^^^^^^^^^^^^
The file ``/etc/nginx/conf.d/sslproxy.conf`` holds all important global settings, espacially:

**error_page 404 =410 /40x.html;**
  The 404 error page will be cloaked as 410 to avoid the internal page from ie.
**proxy_intercept_errors on;**
  All errors from the application server will be hidden behind the correspondending local error pages.
**proxy_redirect http:// $scheme://;**
  Every HTTP redirect from an application server will be rewritten to HTTPS.
**proxy_set_header Accept-Encoding "";**
  The proxy interface to the backend should not compress the data (lan connection).

.. code-block:: nginx

  ### global ###
  server_tokens           off;
  server_name_in_redirect off;
  ignore_invalid_headers  on;
  if_modified_since       before;
  root                    /etc/nginx/content/;
  ssi                     on;
  ssi_silent_errors       on; # testing=off
  add_header X-Frame-Options SAMEORIGIN;
  add_header Strict-Transport-Security max-age=16000000;

  ### tcp ###
  tcp_nodelay             off;
  tcp_nopush              on;
  sendfile                on;
  keepalive_requests      100;

  ### timeouts ###
  resolver_timeout        6;
  client_header_timeout   30;
  client_body_timeout     60;
  send_timeout            60;
  keepalive_timeout       65 20;

  ### buffers ###
  client_header_buffer_size   1k;
  client_body_buffer_size     128k;
  large_client_header_buffers 4 4k;
  client_max_body_size        10m;
  client_body_temp_path       /var/spool/nginx/client/;
  output_buffers              1 32k;
  postpone_output             1460;

  ### errors ###
  recursive_error_pages   off;
  error_page              400 402 403 405 406 410 411 413 416 /40x.html;
  error_page              500 501 502 503 504 /50x.html;
  error_page              404 =410 /40x.html;
  error_page              443 =200 /test.png;
  open_log_file_cache     max=1024 inactive=30s min_uses=3 valid=5m;

  ### acl ###
  allow                   10.0.0.0/8;
  allow                   172.16.0.0/12;
  allow                   192.168.0.0/16;
  deny                    all;

  ### ssl ###
  ssl                     on;
  #ssl_stapling           on; # selfsigned=off
  #ssl_stapling_verify    on; # selfsigned=off
  ssl_prefer_server_ciphers on;
  ssl_protocols           TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers             HIGH:!RC4:!3DES:!aDSS:!aNULL:!kPSK:!kSRP:!MD5:@STRENGTH:+SHA1:+kRSA;
  ssl_session_cache       shared:TLSSL:16m;
  ssl_session_timeout     10m;
  ssl_certificate         sslcert/de/<company>/wildcard.crt;
  ssl_certificate_key     sslcert/de/<company>/wildcard.key;

  ### compression ###
  gzip                    on;
  gzip_disable            "msie6";
  gzip_vary               on;
  gzip_min_length         128;
  gzip_buffers            128 32k;
  gzip_comp_level         6;
  gzip_proxied            any;
  gzip_types              text/plain text/css text/x-component
                          text/xml application/xml application/xhtml+xml application/json
                          image/x-icon image/bmp image/svg+xml application/atom+xml
                          text/javascript application/javascript application/x-javascript
                          application/pdf application/postscript
                          application/rtf application/msword
                          application/vnd.ms-powerpoint application/vnd.ms-excel
                          application/vnd.ms-fontobject application/vnd.wap.wml
                          application/x-font-ttf application/x-font-opentype;

  ### proxy-global ###
  #resolver               <dns-proxy>; # we use "pdnsd" here
  proxy_intercept_errors  on; # testing=off
  proxy_ignore_client_abort off;
  proxy_redirect          http:// $scheme://;

  ### proxy-header ###
  proxy_hide_header       Server;
  proxy_hide_header       X-Powered-By;
  proxy_hide_header       X-AspNet-Version;
  proxy_set_header        Accept-Encoding   ""; # no backend compression
  proxy_set_header        Host              $http_host;
  proxy_set_header        X-Forwarded-By    $server_addr:$server_port;
  proxy_set_header        X-Forwarded-For   $remote_addr;
  proxy_set_header        X-Forwarded-Class $classification; # our internal custom header
  proxy_set_header        X-Forwarded-Proto $scheme;
  map $scheme $msiis      { http off; https on; } # compatibility
  proxy_set_header        Front-End-Https   $msiis;

  ### proxy-timeouts ###
  proxy_connect_timeout   6;
  proxy_send_timeout      60;
  proxy_read_timeout      60;

  ### proxy-buffers ###
  proxy_buffering         on;
  proxy_buffer_size       8k;
  proxy_buffers           256 8k;
  proxy_busy_buffers_size    64k;
  proxy_temp_file_write_size 64k;
  proxy_temp_path         /var/spool/nginx/temp/;


logging.conf
^^^^^^^^^^^^
This configuration file ``/etc/nginx/conf.d/logging.conf`` should trigger the logging if we need some additional information.
We defined the SSL-Proxy as a network device and therefore the application is responsible for logging user access.

.. code-block:: nginx

  log_format apache
      '$remote_addr - $remote_user [$time_local] '
      '"$request" $status $body_bytes_sent '
      '"$http_referer" "$http_user_agent" '
      '"$http_cookie"';
  log_format full
      '$remote_addr $remote_user [$time_local] '
      '"$host"->$proxy_host->$upstream_addr '
      '"$request" $status($upstream_status) '
      '$bytes_sent/$gzip_ratio($sent_http_content_type) '
      '$request_time($upstream_response_time)';
  log_format perf
      '$request_time($upstream_response_time) '
      '$bytes_sent/$gzip_ratio($sent_http_content_type) '
      '$status "$upstream_addr$uri"';
  log_format gzip
      '$bytes_sent/$gzip_ratio($sent_http_content_type) '
      '[$http_accept_encoding]"$http_user_agent"';

  log_format redirect
      '$time_local $redir_match $redir_action $redir_url';

  #access_log off;
   access_log /var/log/nginx/access.log      apache;
  #access_log /var/log/nginx/access-full.log full;
  #access_log /var/log/nginx/access-perf.log perf;
  #access_log /var/log/nginx/access-gzip.log gzip;


backend.conf
^^^^^^^^^^^^
We use this file to define the relation of two backend servers with an ID.
The syntax of nginx only let you define these definitions global.
This means you have to touch two files if you define one new backend/upstream.

.. code-block:: nginx

  upstream <backend-id-1>  {
    server <server-ip-1.1>:<internal-port>;
    server <server-ip-1.2>:<internal-port> backup;
  }
  upstream <backend-id-2>  {
    server <server-ip-2.1>:<internal-port>;
    server <server-ip-2.2>:<internal-port> backup;
  }
  ...
  upstream <backend-id-n>  {
    server <server-ip-n.1>:<internal-port>;
    server <server-ip-n.2>:<internal-port> backup;
  }

In our recent version of the ssl-proxy the file is automaticly created from the application definitions with the script ``/etc/nginx/scripts/gen-upstream.conf``.
So now we can add an new service by one ``path_<context>`` file.

.. code-block:: bash

  #!/bin/sh
  START=`pwd`
  cd /etc/nginx

  cat mapping/dem/path_* | grep "#UP#" | cut -c "6-" > conf.d/upstream.dem-auto.conf
  cat mapping/prd/path_* | grep "#UP#" | cut -c "6-" > conf.d/upstream.prd-auto.conf

  nginx -t

  cd $START



Server and Applications
-----------------------

Simple Applications
^^^^^^^^^^^^^^^^^^^
This is the example of a default application in ``/etc/nginx/mapping/<segment>/<application>``, which should fit in most of the cases.
The first part is a comment used for the automatic generation of the backend configuration.

.. code-block:: nginx

  #UP# upstream <backend-id-n>  {
  #UP#   server <server-ip-n.1>:<internal-port>;
  #UP#   server <server-ip-n.2>:<internal-port> backup;
  #UP# }

  location /<app-path>/ { proxy_pass http://<backend-id>; }


Root Applications
^^^^^^^^^^^^^^^^^
Some web applications don't allow changing the root path to a subdirectory.
You can use of course one of them in combination with applications with subdirectories in a server configuration.
But you have to add an ``if``-statement if you want to use the feature ``proxy_intercept_errors``.

.. code-block:: nginx

  location / {
      if (-f $request_filename) { break; }
      proxy_pass http://<backend-id>;
  }


Uploader App
^^^^^^^^^^^^
Some applications like editorial pages of CMS systems often have additional needs.
There you want to upload for example movies or some bigger PDF's.
Then you have to adjust the maximal size of uploads.

.. code-block:: nginx

  location /<app-path>/ {
      client_max_body_size 100m;
      proxy_pass http://<backend-id>; }


Long Running App
^^^^^^^^^^^^^^^^
If the response of an application takes a long time (e.g. to generate a report) and there is no keppalive machanism available (in our case it was the "BIRT" framework), overload the default settings of the timeouts - for the client and the server side.

.. code-block:: nginx

  location /<app-path>/ {
      send_timeout 3600;
      proxy_read_timeout 3600;
      proxy_pass http://<backend-id>;
  }


Soap Web-Service
^^^^^^^^^^^^^^^^
SOAP needs unchanged errors of the type 500, because this is the default way to exchange information with the client.

.. code-block:: nginx

  location /<app-path>/ {
      proxy_intercept_errors off;
      proxy_pass http://<backend-id>;
  }


Simple Server
^^^^^^^^^^^^^
This example shows an internet (allow all) server with one simple application.
The rewrite rule does the initial redirect into the application directory.
The following index page is in the responsibility of the application.

.. code-block:: nginx

  server {
      ssl_certificate     sslcert/<dns-domain>/<subdomain>.crt;
      ssl_certificate_key sslcert/<dns-dmoain>/<subdomain>.key;
      listen              <ip>:443; allow all;
      server_name         <ip> <dns>;
      set $classification "<customer>.<channel>.<segment>";
      rewrite ^/+$        /<app-path>/ redirect;
      include             mapping/<segment>/<app-path>
  }



The Redirector
--------------
This is one of more complicated part in our setup.
Only implement this if you need smooth changes of old/legacy URL's.

Motivation / Goal:

#. redirect, refresh or send an error-page with the new link
#. work for for DNS names or DNS plus context (= first part of the path)
#. implicit matching of a ``www.`` prefix
#. works for URL's and arguments of requests
#. can parse %-codes in the argument

redir-map.conf
^^^^^^^^^^^^^^

.. code-block:: nginx

  map $redir_match $redir_target { hostnames;
  #[<context>.]<hostname> #(static|refresh|redirect)@<scheme>://<target>/<context>/;
  my-app-1.old-url.com    redirect@https://new-url.com/my-app-1/;
  .old-url.com            redirect@https://new-url.com/default-app/;


redir.action
^^^^^^^^^^^^

.. code-block:: nginx

  if ($redir_target ~* ^(.*)@(.*)) { set $redir_action $1; set $redir_url $2; }
  if ($redir_action = "static")    { rewrite ^ /301-static.html      last; }
  if ($redir_action = "refresh")   { rewrite ^ /301-refresh.html     last; }
  if ($redir_action = "redirect")  { rewrite ^ $redir_url permanent; break;
      access_log /var/log/nginx/redirector.log redirect;}


Redirector Server
^^^^^^^^^^^^^^^^^

.. code-block:: nginx

  server {
      allow       all;
      listen      80 default; ssl off;
      listen      443 default ssl;
      server_name <dns-name>;

      include     mapping/security.ext;

      location /  {
          # deliver local files
          if (-f $request_filename) { break; }
          # redirector
          set $redir_host $http_host;
          if ($http_host ~* ^www\.(.*)) { set $redir_host    $1; }
          if ($uri ~* ^/([^/]+))        { set $redir_context $1.; }
          set $redir_match $redir_context$redir_host;
          include mapping/redir.action;
          # global https enforcement
          if ($scheme = "http") {
              rewrite ^ https://$http_host$request_uri permanent; }
      }

      location /status {
          stub_status     on;
          allow           <monitoring system>;
          deny            all;
      }
  }


Redirector App
^^^^^^^^^^^^^^
This part is very special: Most of our customers bookmark the signon page (of our SSO system) so we have to take care of rewriting this as well.

.. code-block:: nginx

  location /<login-app>/ {
      if ( $arg_<return-url> ~* ^https?(://|%3A%2F%2F)([^/%]+)(/|%2F)([^/%]*) ) {
           set $redir_match $4.$2; }
      include mapping/redirector.action;
      proxy_pass http://<backend-id>;
  }



Active-Sync Gateway
-------------------
This is only a simple gateway (no certificates!) for several different Exchange servers.
It validates some kind of a "fingerprint" of the device against a dns entry.
The code can be "plugged" into the context files above as a service.

.. code-block:: nginx

  location /Microsoft-Server-ActiveSync {
      access_log /var/log/nginx/activesync.log;
      resolver your.dns.server.ip;
      # deny anonymous; deny other http methods
      if ( $remote_user     =   "" )              { return 444; break; }
      if ( $request_method !~* ^(POST|OPTIONS)$ ) { return 444; break; }
      # extract domain and user-id
      if ( $remote_user     ~* ^(.+)\x5C(.+)$ )   { set $domain $1; set $userid $2; }
      if ( $remote_user    !~* ^(.+)\x5C(.+)$ )   { return 444; break; }
      # replace underscores in username
      if ( $userid          ~* ^(.+)_(.+)$ )      { set $userdn $1x$2; }
      if ( $userid         !~* ^(.+)_(.+)$ )      { set $userdn $userid; }
      # extract device-type and version
      if ( $http_user_agent ~* ^MSFT-(.+)/(.+)\.(.+)\.(.+)$ )  { set $device MSFT$1;  set $versio $2x$3x$4; }
      if ( $http_user_agent ~* ^Apple-iPhone(.*)/(.+)\.(.+)$ ) { set $device iPhone;  set $versio $1x$2x$3; }
      if ( $http_user_agent ~* ^Apple-iPad(.+)/(.+)\.(.+)$ )   { set $device iPad;    set $versio $1x$2x$3; }
      if ( $http_user_agent ~* ^Apple-iPod(.+)/(.+)\.(.+)$ )   { set $device iPod;    set $versio $1x$2x$3; }
      if ( $http_user_agent ~* ^Android-(.+)/(.+)\.(.+)$ )     { set $device Android; set $versio $1x$2x$3; }
      # always allow initial requests without arguments
      set $initia $request_method:$args;
      if ( $initia ~* ^OPTIONS:$ ) { set $target $domain-exchange; set $versio ok; }
      if ( $versio =  "" )         { return 444; break; }
      # set target, if usernames match
      if ( $userid =  $arg_User )  { set $target $domain-$userdn-$arg_DeviceId-$device-$versio; }
      # forward request
      proxy_pass http://$target.your.internal.sync.domain;
  }

The failed requests are shown in the ``error.log`` as an resolver error.
The ``error.log`` is monitored by rsyslog and transfered to a syslog server.
The syslog server checks for the internal domain and send an email to the support.

::

  ...
  # Mail-Trap: ActiveSync
  $ActionExecOnlyOnceEveryInterval 300
  $ActionMailTo recicpient-1@your.company
  $ActionMailTo recicpient-2@your.company
  :msg,contains,"your.internal.sync.domain" :ommail:;mailBody
  ...



Remote Logging
--------------

The Problem
^^^^^^^^^^^
In few words: **Nginx doesn't support Syslog.**
Therefore you have some possibilities, if you want Syslog support:

#. Compile Nginx with the **syslog patch**:
    I prefer to use the original packages ...
#. Use a **syslog implementation with file support** (e.g. rsyslog with "imfile"):
    That's okay for the ``error.log``, but it is a bad idea for the space consuming ``access.log``, because you don't want to store these data a second time local.


Simple Solution
^^^^^^^^^^^^^^^
1. Create a file **/etc/rsyslog.d/remote.conf** for all (already) syslog messages:

  .. code-block:: nginx

    # export via udp
    *.notice;local0,local1,local2,local3,local4,local5,local6,local7.*;mark,cron.none @<syslog-server>


2. Create a file **/etc/rsyslog.d/nginx.conf** for file monitoring. Repeat the part in the middle for every file you want to see in the syslog.
   The last line is important, otherwise you will log these messages three times (nginx log, udp syslog and local syslog):

  .. code-block:: nginx

    # import-module: file
    $ModLoad imfile

    # nginx/error.log
    $InputFileName          /var/log/nginx/error.log
    $InputFileTag           nginx:
    $InputFileStateFile     nginx_error.log
    $InputFileSeverity      warning
    $InputFileFacility      local7
    $InputRunFileMonitor

    # send and drop
    :syslogtag,isequal,"nginx:"     @<syslog-server>
    & ~


3. Create a script **/etc/cron.daily/logfile-actions**, which will be executed every day and place there the cleanup commands (eg. 1 day for the access logs and 6 month for all other).
   Don't forget to do the ``chmod +x``.
   This this at least process all files, which you don't want to store local a second time.
   But as I sad before, this works only if the amount of access-log of one day isn't to much ... and it's not very smart.

   .. code-block:: bash

     #!/bin/sh
     find /var/log/       -name       *.gz -mtime +180 -delete
     find /var/log/nginx/ -name access*.gz -mtime +2   -delete



Appendix: Scripts
-----------------

sync-config.sh
^^^^^^^^^^^^^^
Its our most important script for the daily use, but it is - for years overs years - a very ugly one.

.. code-block:: bash

  #!/bin/bash

  case `hostname` in
      "sslproxy-01" )
          PEER="sslproxy-02";;
      "sslproxy-02" )
          PEER="sslproxy-01";;
  esac

  START=`pwd`
      /etc/init.d/nginx reload
      sleep 2
      chown www-data:adm /var/log/nginx/*
      /etc/init.d/keepalived reload
      cd /etc/nginx/sslcert/
      tar -cvjpf /etc/nginx/sslcert.tbz2 ./*
  cd $START

  echo "
      put -P /etc/cron.daily/logfile-actions        /etc/cron.daily/
      put -P /etc/sysctl.d/10-network-security.conf /etc/sysctl.d/
      put -P /etc/monit/monitrc                     /etc/monit/
      put -P /etc/monit/conf.d/*                    /etc/monit/conf.d/
      put -P /etc/keepalived/keepalived.conf        /etc/keepalived/remote.conf
      put -P /etc/keepalived/remote.conf            /etc/keepalived/keepalived.conf
      put -P /etc/nginx/sslcert.tbz2                /etc/nginx/
      put -P /etc/nginx/nginx.conf                  /etc/nginx/
      rm     /etc/nginx/conf.d/*
      put -P /etc/nginx/conf.d/*                    /etc/nginx/conf.d/
      rm     /etc/nginx/content/*
      put -P /etc/nginx/content/*                   /etc/nginx/content/
      rm     /etc/nginx/scripts/*
      put -P /etc/nginx/scripts/*                   /etc/nginx/scripts/
      rm     /etc/nginx/sites-enabled/*
      put -P /etc/nginx/sites-enabled/*             /etc/nginx/sites-enabled/
      rm     /etc/nginx/mapping/*
      rm     /etc/nginx/mapping/dem/*
      rm     /etc/nginx/mapping/prd/*
      put -P /etc/nginx/mapping/*                   /etc/nginx/mapping/
      put -P /etc/nginx/mapping/dem/*               /etc/nginx/mapping/dem/
      put -P /etc/nginx/mapping/prd/*               /etc/nginx/mapping/prd/
      rm     /etc/nginx/access/*
      rm     /etc/nginx/access/lan/*
      rm     /etc/nginx/access/ext/*
      rm     /etc/nginx/access/vn1/*
      rm     /etc/nginx/access/vn2/*
      put -P /etc/nginx/access/*                    /etc/nginx/access/
      put -P /etc/nginx/access/lan/*                /etc/nginx/access/lan/
      put -P /etc/nginx/access/ext/*                /etc/nginx/access/ext/
      put -P /etc/nginx/access/vn1/*                /etc/nginx/access/vn1/
      put -P /etc/nginx/access/vn2/*                /etc/nginx/access/vn2/
      bye
  " | sftp -C root@$PEER
  rm /etc/nginx/sslcert.tbz2

  ssh $PEER '
      cd /etc/nginx/sslcert/
      rm -rf ./*
      tar -xvjpf /etc/nginx/sslcert.tbz2
      rm /etc/nginx/sslcert.tbz2
      /etc/init.d/nginx reload
      chown www-data:adm /var/log/nginx/*
      /etc/init.d/keepalived reload
  '

  exit 0


dump-config.sh
^^^^^^^^^^^^^^
Creates a "normalized" configuration file.
Basically it's a recursive script that evaluates include-statements, remove spaces and comments.
This is the base for the most of my scripts doing backup/restore, ssl validations on so on.
Maybe it's not beautiful nor perfect, but it works for me.

.. code-block:: bash

  #!/bin/sh
  START=`pwd`
  cd /etc/nginx

  if [ -x $0 ]
      then CMD=$0
      else CMD=$START/$0
  fi

  if [ "$1" ]
      then FILE=$1
      else FILE="nginx.conf"
  fi

  echo "# start: $FILE"
  cat $FILE | awk '{
      gsub("#.*","",$0);
      gsub(";",";\n",$0);
      gsub("{","\n{\n",$0);
      gsub("}","\n}\n",$0);
      print;
  }' | awk -v HK="'" -v CMD=$CMD '{
      gsub("[ \t]+"," ",$0);
      gsub("^[ \t]","",$0);
      gsub("[ \t]$","",$0);
      gsub(HK,"%%",$0);
      if ($1=="include") {
          sub(";$","",$2);
          print CMD" "HK$2HK; }
      else {
          print "echo "HK$0HK; }
  }' | sh | awk -v HK="'" '{
      gsub("%%",HK,$0);
      if ($0=="") {
          pass; }
      else {
          print; }
  }' | cat
  echo "# stop: $FILE"

  cd $START
  #exit 0


clean-restart.sh
^^^^^^^^^^^^^^^^
This script restart some services, remove logfiles and reactivates the loopback addresses in case of bigger changes.
I use it especially at the development systems.
On the production machines I do the changes and then a reboot instead, to ensure every thing starts up correctly in case of an unexpected reboot.

.. code-block:: bash

  #!/bin/bash

  /etc/init.d/monit      stop
  /etc/init.d/keepalived stop
  /etc/init.d/nginx      stop
  ifconfig -a | grep "lo:" | awk '{print "ifconfig "$1" down"}' | sh

  chmod    +x  /etc/nginx/conf.d/ip-addr.sh
  chmod -R +x  /etc/nginx/scripts/*
  chmod -R 600 /etc/nginx/sslcert/*
  rm /var/log/monit
  rm /var/log/nginx/*
  # other commands, like "apt-get -y upgrade"

  /etc/nginx/conf.d/ip-addr.sh
  /etc/init.d/nginx      start
  /etc/init.d/keepalived start
  /etc/init.d/monit      start

  exit 0



Know Bugs / Wishlist
--------------------

**inline includes**
  With an statement like ``include @<identifier>`` and a block like ``include { include_name <identifier>; ... }`` a seperate file for every include could be avoided.
**global rewrite rules** and **log option for rewrite**
  If you have a inverse proxy it would be the perfect place to enforce a bunch o rewrite rules globaly.
  Because this is an security feature, each firing of one rule should be logged in a (separate?) log.
