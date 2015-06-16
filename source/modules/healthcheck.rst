HTTP Healthcheck
================

= ngx_http_healthcheck_module =

''This module is not distributed with the Nginx source. Installation instructions are below.  You can get the module [http://github.com/cep21/healthcheck_nginx_upstreams here]''

Healthcheck plugin for nginx.  It polls backends and if they respond with
HTTP 200 + an optional request body, they are marked good.  Otherwise, they
are marked bad.

Note this also gives you access to a health status page that lets you see
how well your healthcheck are doing.

The docs on this wiki can get out of date.  For the authoritative information, please see the README file inside the plugin's [http://github.com/cep21/healthcheck_nginx_upstreams git repository].

== Directives ==

=== healthcheck_enabled ===
'''syntax''' ''healthcheck_enabled''

'''context''' ''upstream''

Enables health checking of an upstream

=== healthcheck_delay ===
'''syntax''' ''healthcheck_delay''

'''default''' ''10000''

'''context''' ''upstream''

Delay in msec between healthchecks for a single peer.

=== healthcheck_timeout ===
'''syntax''' ''healthcheck_timeout''

'''default''' ''2000''

'''context''' ''upstream''

How long in msec a healthcheck is allowed to take place

=== healthcheck_failcount ===
'''syntax''' ''healthcheck_failcount''

'''default''' ''2''

'''context''' ''upstream''

Number of healthchecks good or bad in a row it takes to switch from down to up and back. Good to prevent flapping

=== healthcheck_send ===
'''syntax''' ''healthcheck_send''

'''default''' ''<empty>''

'''context''' ''upstream''

Required directive.  What to send for the healthcheck.  Each argument is appended by \r\n and the entire thing is suffixed with another \r\n. For example:

<geshi lang="nginx">
  healthcheck_send 'GET /health HTTP/1.0'
   'Host: www.yourhost.com';
</geshi>

Note that you probably want to end your health check with some directive that closes the connection, like Connection: close.

=== healthcheck_expected ===
'''syntax''' ''healthcheck_expected''

'''default''' ''<UNSET>''

'''context''' ''upstream''

What to expect in the HTTP BODY, (meaning not the headers), in a correct response.  If unset, just a HTTP 200 status code is required for a peer

=== healthcheck_buffer ===
'''syntax''' ''healthcheck_buffer''

'''default''' ''1000''

'''context''' ''upstream''

How big a buffer to use for the health check. Remember to include headers PLUS body, not just body.

=== healthcheck_status ===
'''syntax''' ''healthcheck_status''

'''context''' ''upstream''

When inside a /location block, replaced the HTTP body with backend health status. Use similarly to the stub_status module.

== Installation ==

This module is not distributed with the Nginx source. You can download the module from [http://github.com/cep21/healthcheck_nginx_upstreams here].  Read the installation instructions inside the README file.

== Bugs ==

Please report bugs to [http://github.com/cep21/healthcheck_nginx_upstreams/issues here]
