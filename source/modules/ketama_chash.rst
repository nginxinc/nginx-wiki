Upstream Ketama CHash
=====================

= ngx_http_upstream_hash_module =

''This module is not distributed with the Nginx source. Installation instructions are [[#Installation|Installation]] below.''

The usptream_ketama_chash module is a load balancer which provides upstream load distribution by hashing a configurable variable using ketama consistent hashing algorithm. 

== Directives ==

=== hash ===
'''syntax''' ''ketama_chash $variable''

'''context''' ''upstream''

Enables upstream ketama consistent hashing of $variable.

== Synopsis ==

 upstream backend {
     ...
     ketama_chash    $uri;
 }

== Installation ==

This module is not distributed with the Nginx source. You can download the request_hash module from [https://github.com/flygoast/ngx_http_upstream_ketama_chash Github]

 cd nginx-*version*
 ./configure --add-module=/path/to/this/directory
 make
 make install

== Bugs ==

Send bug reports to [https://github.com/flygoast/ngx_http_upstream_ketama_chash FengGu] .
