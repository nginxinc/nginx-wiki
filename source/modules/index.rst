.. _modules:

.. todo::

   * How to compile modules (a separate doc)
   * Information about writing modules (a separate doc)
   * Move more modules over (LinuxJedi got up to the end of 'B')


Nginx 3\ :sup:`rd` Party Modules
================================

+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Module                    | Description                                                             | Repository                                                                             |
+===========================+=========================================================================+========================================================================================+
| :doc:`accept_language`    | Accept-Language header parser                                           | :github:`giom/nginx_accept_language_module`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| AFCGI                     | Asynchronous/multiplexing FastCGI for nginx                             | :github:`rsms/afcgi`                                                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Akamai G2O                | Restricts access to content to Akamai edge servers using G2O headers    | :github:`refractalize/nginx_mod_akamai_g2o`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Array Var                 | Add support for array variables to nginx config files                   | :github:`openresty/array-var-nginx-module`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`audio_track`        | Generate audio track for HTTP Live Streaming (HLS) streams on the fly   | :github:`flavioribeiro/nginx-audio-track-for-hls-module`                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`auth_digest`        | HTTP Digest Authentication                                              | :github:`samizdatco/nginx-http-auth-digest`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| PAM Authentication        | HTTP Basic Authentication using PAM                                     | :github:`stogh/ngx_http_auth_pam_module`                                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Request Authentication    | Allows authorization based on subrequest result                         | `ngx_http_auth_request_module <http://mdounin.ru/hg/ngx_http_auth_request_module/>`_   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Auto Lib                  | Reuse pre-compiled/installed versions of OpenSSL, PCRE and Zlib         | :github:`simpl/ngx_auto_lib`                                                           |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| AWS Auth                  | Generate security headers for GET requests to Amazon S3                 | :github:`anomalizer/ngx_aws_auth`                                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Backtrace                 | A nginx module to dump backtrace case a worker process exits abnormally | :github:`alibaba/nginx-backtrace`                                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Cache Purge               | Adds ability to purge content from FastCGI, proxy, and uWSGI caches     | :github:`FRiCKLE/nginx-cache-purge`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`circle_gif`         | Generates simple circle images with colors/size specified in the URL    | :github:`evanmiller/nginx_circle_gif`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`clojure`            | A module for embedding Clojure, Java, and Groovy programs               | :github:`nginx-clojure/nginx-clojure`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`concat`             | Concatenates files in a given context                                   | :github:`alibaba/nginx-http-concat`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`consistent_hash`    | Select backend based on Consistent hash ring                            | :github:`replay/ngx_http_consistent_hash`                                              |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Development Kit           | An extension to the core functionality of Nginx                         | :github:`simpl/ngx_devel_kit`                                                          |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`domain_resolve`     | An asynchronous domain name resolve module for nginx upstream           | :github:`wdaike/ngx_upstream_jdomain/`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`drizzle`            | Make nginx talk directly to mysql and drizzle                           | :github:`chaoslawful/drizzle-nginx-module`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Dynamic etags             | Nginx module for etags on dynamic content                               | :github:`kali/nginx-dynamic-etags`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Dynamic Upstream          | Update upstreams' config by restful interface                           | :github:`yzprofile/ngx_http_dyups_module`                                              |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`echo`               | Provides familiar shell commands to nginx config files                  | :github:`agentzh/echo-nginx-module`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Encrypted Session         | Encrypt nginx variables for light-weight session-based authentication   | :github:`agentzh/encrypted-session-nginx-module`                                       |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Enhanced Memcached        | Repackaging of the standard memcached module to add features            | :github:`bpaquet/ngx_http_enhanced_memcached_module`                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Eval                      | A module for evaluating memcached or proxy response into variable       | :github:`vkholodkov/nginx-eval-module`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Eval (agentzh's fork)     | Captures arbitrary subrequest's responses into nginx variables          | :github:`agentzh/nginx-eval-module`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`extended_status`    | Extended status module for nginx                                        | :github:`zealot83/ngx_http_extended_status_module`                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| EY Balancer               | Provides a request queue for limiting concurrent requests               | :github:`ry/nginx-ey-balancer/tree/master`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`fair_balancer`      | Distributes incoming requests to least-busy servers                     | :github:`gnosek/nginx-upstream-fair`                                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`fancy_index`        | Like the built-in autoindex module, but fancier                         | :github:`aperezdc/ngx-fancyindex`                                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`foot_filter`        | Implements a body filter that adds a given string to the page footer    | :github:`alibaba/nginx-http-footer-filter`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Footer If Filter          | Applies a footer if a response meets a specified condition              | :github:`flygoast/ngx_http_footer_if_filter/`                                          |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`form_input`         | Parses HTTP POST request bodies and saves results to nginx variables    | :github:`calio/form-input-nginx-module`                                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| GeoIP2                    | City and country code lookups via the MaxMind GeoIP2 API                | :github:`leev/ngx_http_geoip2_module`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| GridFS                    | Nginx module for serving files from MongoDB's GridFS                    | :github:`mdirolf/nginx-gridfs`                                                         |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`groovy_handler`     | A module for embedding Clojure, Java, and Groovy programs               | :github:`nginx-clojure/nginx-clojure`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`headers_more`       | Set and clear input and output headers... more than "add"!              | :github:`agentzh/headers-more-nginx-module`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`healthcheck`        | Health check HTTP servers inside an upstream                            | :github:`cep21/healthcheck_nginx_upstreams`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| HTTP Accounting           | Realtime netflow and status code monitoring                             | :github:`Lax/ngx_http_accounting_module`                                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| HTTP Push                 | Turns nginx into an adept long-polling HTTP Push server                 | :github:`slact/nginx_http_push_module`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`iconv`              | Converts character encodings                                            | :github:`calio/iconv-nginx-module`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Internal Redirect         | A nginx module for internal redirection                                 | :github:`flygoast/ngx_http_internal_redirect/`                                         |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| IP2Location               | Identifies the country name/code of an IP address                       | :github:`chrislim2888/ip2location-nginx`                                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`java_handler`       | A module for embedding Clojure, Java, and Groovy programs               | :github:`nginx-clojure/nginx-clojure`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| JavaScript                | Embedding SpiderMonkey, a full port of Perl module, and more            | :github:`kung-fu-tzu/ngx_http_js_module#readme`                                        |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`keepalive`          | Provides keep-alive connections to memcached upstreams                  | http://mdounin.ru/hg/ngx_http_upstream_keepalive/                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`ketama_chash`       | Provides upstream load distribution by hashing a configurable variable  | :github:`flygoast/ngx_http_upstream_ketama_chash/releases/`                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Limit Upload Rate         | Limit the transmission rate of request body from a client               | :github:`cfsego/limit_upload_rate`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Limit Upstream Connection | Limits the maximum connections to each server in a upstream             | :github:`cfsego/nginx-limit-upstream/`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Log If                    | Log the requests only when given conditions are met                     | :github:`cfsego/ngx_log_if/`                                                           |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Lower Upper Case          | Provides upper/lowercase string functions in nginx config files         | :github:`replay/ngx_http_lower_upper_case`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`lua`                | Embed the power of Lua into nginx                                       | :github:`chaoslawful/lua-nginx-module`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Luafile                   | Embed the power of Lua into nginx                                       | :github:`alacner/nginx_lua_module`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| MD5 Filter                | Returns the MD5 sum of content that would've otherwise been served      | :github:`kainswor/nginx_md5_filter`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`memc`               | Extension of the standard memcached module                              | :github:`agentzh/memc-nginx-module`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| ModSecurity               | Web application firewall                                                |                                                                                        |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Mogilefs                  | Implements a MogileFS client                                            | `Download <http://www.grid.net.ru/nginx/download/nginx_mogilefs_module-1.0.2.tar.gz>`_ |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Mongo                     | Upstream module for direct communication with MongoDB                   | :github:`simpl/ngx_mongo`                                                              |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`mp4_streaming`      | Seeks time within H.264/MP4 files if a "start" parameter is in the URL  |                                                                                        |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Naxsi                     | Web Application Firewall for nginx                                      | :github:`nbs-system/naxsi`                                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Notice                    | Serve static file to POST requests                                      | `Download <http://xph.us/software/nginx-notice/nginx-notice-2.tar.gz>`_                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| OCSP proxy                | OCSP processing module designed for response caching                    | :github:`kyprizel/nginx_ocsp_proxy-module`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| OpenSSL Version           | OpenSSL minimum version constraints in configuration                    | :github:`apcera/nginx-openssl-version`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`owner_match`        | Provides a simple file owner-based access control                       | `Download <http://heiher.info/sftp/files/Nginx-0.8.54-Add-OwnerMatch-module.patch>`_   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| PageSpeed                 | Rewrites webpages and associated assets to reduce latency and bandwidth | :github:`pagespeed/ngx_pagespeed`                                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| PHP Session Parser        | Extract values that are stored in a serialized PHP session              | :github:`replay/ngx_http_php_session`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| PHP-Memache Standard Hash | Load balancer that imitates the PHP-Memcache standard hash's behaviour  | :github:`replay/ngx_http_php_memcache_standard_balancer`                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Postgres                  | Allows nginx to communicate directly with PostgreSQL database           | `Download <http://labs.frickle.com/nginx_ngx_postgres>`_                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Pubcookie                 | Adds Pubcookie-based cross-site authentication method to nginx          | `Download <http://vitki.net/pubcookie>`_                                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`push_stream`        | Turns nginx into an adept stream HTTP Push server                       | :github:`wandenberg/nginx-push-stream-module`                                          |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`rdns`               | Makes a reverse DNS lookup and provides control of incoming hostname    | :github:`flant/nginx-http-rdns`                                                        |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| RDS CSV                   | Helps ngx_drizzle, ngx_postgres, and others emit Comma-Separated Values | :github:`agentzh/rds-csv-nginx-module`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| RDS JSON                  | Helps ngx_drizzle, ngx_postgres, and others emit JSON data              | :github:`agentzh/rds-json-nginx-module`                                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`redis`              | Redis support module                                                    | `Download <http://people.FreeBSD.ORG/~osa/ngx_http_redis-0.3.5.tar.gz>`_               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`redis2`             | Upstream module for the full Redis 2.0 protocol                         | :github:`agentzh/redis2-nginx-module/tags`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Replace Filter            | Performs regular expression substitutions on response bodies            | :github:`agentzh/replace-filter-nginx-module#name`                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Roboo                     | HTTP Robot Mitigator that integrates easily with Nginx                  | :github:`yuri-gushin/Roboo/downloads`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`rrd_graph`          | This module provides an HTTP interface to RRDtool's graphing facilities | :github:`evanmiller/mod_rrd_graph`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| RTMP                      | RTMP protocol support. Live streaming and video on demand               | :github:`arut/nginx-rtmp-module`                                                       |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Sass                      | Compiles SASS files in nginx before sending the response                | :github:`mneudert/sass-nginx-module`                                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`secure_download`    | Create expiring links                                                   | :github:`replay/ngx_http_secure_download`                                              |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Selective Cache Purge     | A cache purge module that allows GLOB expressions like *.jpg or /test*  | :github:`wandenberg/nginx-selective-cache-purge-module`                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Set CConv                 | Conversion between Simplified and Traditional Chinese at rewrite phase  | :github:`liseen/set-cconv-nginx-module`                                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Set Hash                  | Set a variable to hash functions, including MD5, SHA1 and Murmurhash 2  | :github:`simpl/ngx_http_set_hash`                                                      |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Set Lang                  | Set a variable to indicate the language based on a variety of sources   | :github:`simpl/ngx_http_set_lang/downloads`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`set_misc`           | Various set_xxx directives added to nginx's rewrite module              | :github:`agentzh/set-misc-nginx-module`                                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| sFlow                     | Operational performance monitoring with standard sFlow protocol         | `Download <http://code.google.com/p/nginx-sflow-module/downloads/list>`_               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`slice`              | Nginx module for serving a file in slices (reverse byte-range)          | :github:`alibaba/nginx-http-slice`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| SlowFS Cache              | Adds ability to cache static files                                      | `Download <http://labs.frickle.com/nginx_ngx_slowfs_cache>`_                           |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| SmallLight                | Dynamic Image Transformation Module For nginx                           | :github:`cubicdaiya/ngx_small_light`                                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Sphinx                    | Nginx upstream module for Sphinx 2.x                                    | :github:`reeteshranjan/sphinx2-nginx-module`                                           |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| SPNEGO                    | Support for SPNEGO/gssapi in nginx                                      | :github:`stnoonan/spnego-http-auth-nginx-module`                                       |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`sr_cache`           | Transparent subrequest-based caching layout for nginx locations         | :github:`agentzh/srcache-nginx-module`                                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Static etags              | Generates etags for static content                                      | :github:`mikewest/nginx-static-etags`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Statsd                    | Adds the ability for Nginx to interacting with Statsd                   | :github:`zebrafishlabs/nginx-statsd`                                                   |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Sticky upstream           | Adds an upstream server persistance using cookies                       | :bitbucket:`nginx-goodies/nginx-sticky-module-ng/get/master.tar.gz`                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Subrange                  | Split one big HTTP/Range request to multiple subrange requesets         | :github:`Qihoo360/ngx_http_subrange_module`                                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`substitutions`      | Performs regular expression and string substitutions on response bodies | :github:`yaoweibin/ngx_http_substitutions_filter_module`                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Summarizer                | An upstream module for Summarizer 1.0                                   | :github:`reeteshranjan/summarizer-nginx-module`                                        |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Supervisord               | Communicate with supervisord and manage backends on-demand              | `Download <http://labs.frickle.com/nginx_ngx_supervisord>`_                            |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| SysGuard                  | Protects servers when system load or memory use goes too high           | :github:`alibaba/nginx-http-sysguard`                                                  |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| TCP Proxy                 | Protects servers when system load or memory use goes too high           | :github:`yaoweibin/nginx_tcp_proxy_module`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| TestCookie module         | Simple robot (DDoS) mitigation module                                   | :github:`kyprizel/testcookie-nginx-module`                                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Types Filter              | Changes the *Content-Type* output header on specified conditions        | :github:`flygoast/ngx_http_types_filter`                                               |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| UnZip                     | serve file directly from the archives                                   | :github:`youzee/nginx-unzip-module`                                                    |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`upload`             | Adds support for TCP proxying                                           | `Download <http://www.grid.net.ru/nginx/upload.en.html#download>`_                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`upload_progress`    | Tracks and reports upload progress                                      | :github:`masterzen/nginx-upload-progress-module/downloads`                             |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Url                       | A module to convert uri to user-defined encoding                        | :github:`vozlt/nginx-module-url`                                                       |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`user_agent`         | A more powerful module than the native BrowserModule                    | :github:`alibaba/nginx-http-user-agent`                                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| Video Thumb Extractor     | Nginx module to extract thumbs from a video file                        | :github:`wandenberg/nginx-video-thumbextractor-module`                                 |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| VTS                       | A virtual host and upstream traffic status module                       | :github:`vozlt/nginx-module-vts`                                                       |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`wsgi`               | WSGI for nginx. Allows easy deployment of Python applications           | `Download <http://hg.mperillo.ath.cx/nginx/mod_wsgi/>`_                                |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| XSS                       | Native support for cross-site scripting (XSS)                           | :github:`agentzh/xss-nginx-module`                                                     |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+
| :doc:`zip`                | Assemble ZIP archives on the fly                                        | :github:`evanmiller/mod_zip/`                                                          |
+---------------------------+-------------------------------------------------------------------------+----------------------------------------------------------------------------------------+

..
   This is a list of modules that didn't have a wiki page on the old wiki:
   * AFCGI
   * Akamai G2O
   * Array Var
   * Auth PAM 
   * Auth Request
   * Auto Lib
   * AWS Auth
   * Backtrace
   * Cache Purge
   * Development Kit
   * Dynamic etags
   * Dynamic Upstream
   * Encrypted Session
   * Enhanced Memcached
   * Eval
   * Eval (agentzh's fork)
   * EY Balancer
   * Footer If Filter
   * GeoIP2
   * GridFS
   * HTTP Accounting
   * HTTP Push
   * Internal Redirect
   * IP2Location
   * JavaScript
   * Limit Upload Rate
   * Limit Upstream Connection
   * Log If
   * Lower Upper Case
   * Luafile
   * MD5 Filter
   * ModSecurity
   * Mogilefs
   * Mongo
   * Naxsi
   * Notice
   * OCSP proxy
   * OpenSSL Version
   * PageSpeed
   * PHP Session Parser
   * PHP-Memache Standard Hash
   * Postgres
   * Pubcookie
   * RDS CSV
   * RDS JSON
   * Replace Filter
   * Roboo
   * RTMP
   * Sass
   * Selective Cache Purge
   * Set CConv
   * Set Hash
   * Set Lang
   * sFlow
   * SlowFS Cache
   * SmallLight
   * Sphinx
   * SPNEGO
   * Static etags
   * Statsd
   * Sticky upstream
   * Subrange
   * Summarizer
   * Supervisord
   * SysGuard
   * TCP Proxy
   * TestCookie module
   * Types Filter
   * UnZip
   * Url
   * Video Thumb Extractor
   * VTS
   * XSS
..
   This is a list of modules we haven't added and why:
   * Access Key - no revision tree, was locally hosted
   * Chunkin Module - obsolete as of Nginx 1.3.9
   * Expressz - project deffered, never made a release
   * Strip Whitespace - no revision tree, was locally hosted
   * Upstream Request Hash - obsolete as of Nginx 1.7.2
   
.. toctree::
   :hidden:

   accept_language
   audio_track
   auth_digest
   circle_gif
   clojure
   concat
   consistent_hash
   domain_resolve
   drizzle
   echo
   extended_status
   fair_balancer
   fancy_index
   foot_filter
   form_input
   groovy_handler
   headers_more
   healthcheck
   iconv
   java_handler
   keepalive
   ketama_chash
   lua
   memc
   mp4_streaming
   owner_match
   push_stream
   rdns
   redis
   redis2
   rrd_graph
   secure_download
   set_misc
   slice
   sr_cache
   strip
   substitutions
   upload
   upload_progress
   user_agent
   wsgi
   zip