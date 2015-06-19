SR Cache
========

= Name =

'''ngx_srcache''' - Transparent subrequest-based caching layout for arbitrary nginx locations

''This module is not distributed with the Nginx source.'' See [[#Installation|the installation instructions]].

= Status =

This module is production ready.

= Version =

This document describes srcache-nginx-module [https://github.com/openresty/srcache-nginx-module/tags v0.29] released on 18 February 2015.

= Synopsis =

<geshi lang="nginx">
    upstream my_memcached {
        server 10.62.136.7:11211;
        keepalive 10;
    }

    location = /memc {
        internal;

        memc_connect_timeout 100ms;
        memc_send_timeout 100ms;
        memc_read_timeout 100ms;
        memc_ignore_client_abort on;

        set $memc_key $query_string;
        set $memc_exptime 300;

        memc_pass my_memcached;
    }

    location /foo {
        set $key $uri$args;
        srcache_fetch GET /memc $key;
        srcache_store PUT /memc $key;
        srcache_store_statuses 200 301 302;
  
        # proxy_pass/fastcgi_pass/drizzle_pass/echo/etc...
        # or even static files on the disk
    }
</geshi>

<geshi lang="nginx">
    location = /memc2 {
        internal;

        memc_connect_timeout 100ms;
        memc_send_timeout 100ms;
        memc_read_timeout 100ms;
        memc_ignore_client_abort on;

        set_unescape_uri $memc_key $arg_key;
        set $memc_exptime $arg_exptime;

        memc_pass unix:/tmp/memcached.sock;
    }

    location /bar {
        set_escape_uri $key $uri$args;
        srcache_fetch GET /memc2 key=$key;
        srcache_store PUT /memc2 key=$key&exptime=$srcache_expire;
  
        # proxy_pass/fastcgi_pass/drizzle_pass/echo/etc...
        # or even static files on the disk
    }
</geshi>

<geshi lang="nginx">
    map $request_method $skip_fetch {
        default     0;
        POST        1;
        PUT         1;
    }

    server {
        listen 8080;

        location /api/ {
            set $key "$uri?$args";

            srcache_fetch GET /memc $key;
            srcache_store PUT /memc $key;

            srcache_methods GET PUT POST;
            srcache_fetch_skip $skip_fetch;

            # proxy_pass/drizzle_pass/content_by_lua/echo/...
        }
    }
</geshi>

= Description =

This module provides a transparent caching layer for arbitrary nginx locations (like those use an upstream or even serve static disk files). The caching behavior is mostly compatible with [http://www.ietf.org/rfc/rfc2616.txt RFC 2616].

Usually, [[HttpMemcModule]] is used together with this module to provide a concrete caching storage backend. But technically, any modules that provide a REST interface can be used as the fetching and storage subrequests used by this module.

For main requests, the [[#srcache_fetch|srcache_fetch]] directive works at the end of the access phase, so the [[HttpAccessModule|standard access module]]'s [[HttpAccessModule#allow|allow]] and [[HttpAccessModule#deny|deny]] direcives run ''before'' ours, which is usually the desired behavior for security reasons.

The workflow of this module looks like below:

http://agentzh.org/misc/image/srcache-flowchart.png

== Subrequest caching ==

For ''subrequests'', we explicitly '''disallow''' the use of this module because it's too difficult to get right. There used to be an implementation but it was buggy and I finally gave up fixing it and abandoned it.

However, if you're using [[HttpLuaModule]], it's easy to do subrequest caching in Lua all by yourself. That is, first issue a subrequest to an [[HttpMemcModule]] location to do an explicit cache lookup, if cache hit, just use the cached data returned; otherwise, fall back to the true backend, and finally do a cache insertion to feed the data into the cache.

Using this module for main request caching and Lua for subrequest caching is the approach that we're taking in our business. This hybrid solution works great in production.

== Distributed Memcached Caching ==

Here is a simple example demonstrating a distributed memcached caching mechanism built atop this module. Suppose we do have three different memcacached nodes and we use simple modulo to hash our keys.

<geshi lang="nginx">
    http {
        upstream moon {
            server 10.62.136.54:11211;
            server unix:/tmp/memcached.sock backup;
        }

        upstream earth {
            server 10.62.136.55:11211;
        }

        upstream sun {
            server 10.62.136.56:11211;
        }

        upstream_list universe moon earth sun;

        server {
            memc_connect_timeout 100ms;
            memc_send_timeout 100ms;
            memc_read_timeout 100ms;

            location = /memc {
                internal;

                set $memc_key $query_string;
                set_hashed_upstream $backend universe $memc_key;
                set $memc_exptime 3600; # in seconds
                memc_pass $backend;
            }

            location / {
                set $key $uri;
                srcache_fetch GET /memc $key;
                srcache_store PUT /memc $key;

                # proxy_pass/fastcgi_pass/content_by_lua/drizzle_pass/...
            }
        }
    }
</geshi>
Here's what is going on in the sample above:
# We first define three upstreams, <code>moon</code>, <code>earth</code>, and <code>sun</code>. These are our three memcached servers.
# And then we group them together as an upstream list entity named <code>universe</code> with the <code>upstream_list</code> directive provided by [[HttpSetMiscModule]].
# After that, we define an internal location named <code>/memc</code> for talking to the memcached cluster.
# In this <code>/memc</code> location, we first set the <code>$memc_key</code> variable with the query string (<code>$args</code>), and then use the [[HttpSetMiscModule#set_hashed_upstream|set_hashed_upstream]] directive to hash our [[HttpMemcModule#$memc_key|$memc_key]] over the upsteam list <code>universe</code>, so as to obtain a concrete upstream name to be assigned to the variable <code>$backend</code>.
# We pass this <code>$backend</code> variable into the [[HttpMemcModule#memc_pass|memc_pass]] directive. The <code>$backend</code> variable can hold a value among <code>moon</code>, <code>earth</code>, and <code>sun</code>.
# Also, we define the memcached caching expiration time to be 3600 seconds (i.e., an hour) by overriding the [[HttpMemcModule#$memc_exptime|$memc_exptime]] variable.
# In our main public location <code>/</code>, we configure the <code>$uri</code> variable as our cache key, and then configure [[#srcache_fetch|srcache_fetch]] for cache lookups and [[#srcache_store|srcache_store]] for cache updates. We're using two subrequests to our <code>/memc</code> location defined earlier in these two directives.

One can use [[HttpLuaModule]]'s [[HttpLuaModule#set_by_lua|set_by_lua]] or [[HttpLuaModule#rewrite_by_lua|rewrite_by_lua]] directives to inject custom Lua code to compute the <code>$backend</code> and/or <code>$key</code> variables in the sample above.

One thing that should be taken care of is that memcached does have restriction on key lengths, i.e., 250 bytes, so for keys that may be very long, one could use the [[HttpSetMiscModule#set_md5|set_md5]] directive or its friends to pre-hash the key to a fixed-length digest before assigning it to <code>$memc_key</code> in the <code>/memc</code> location or the like.

Further, one can utilize the [[#srcache_fetch_skip|srcache_fetch_skip]] and [[#srcache_store_skip|srcache_store_skip]] directives to control what to cache and what not on a per-request basis, and Lua can also be used here in a similar way. So the possibility is really unlimited.

To maximize speed, we often enable TCP (or Unix Domain Socket) connection pool for our memcached upstreams provided by [[HttpUpstreamKeepaliveModule]], for example,

<geshi lang="nginx">
    upstream moon {
        server 10.62.136.54:11211;
        server unix:/tmp/memcached.sock backup;
        keepalive 10;
    }
</geshi>

where we define a connection pool which holds up to 10 keep-alive connections (per nginx worker process) for our <code>moon</code> upstream (cluster).

== Caching with Redis ==

One annoyance with Memcached backed caching is Memcached server's 1 MB value size limit. So it is often desired to use some more permissive backend storage services like Redis to serve as this module's backend.

Here is a working example by using Redis:

<geshi lang="nginx">
    location /api {
        default_type text/css;

        set $key $uri;
        set_escape_uri $escaped_key $key;

        srcache_fetch GET /redis $key;
        srcache_store PUT /redis2 key=$escaped_key&exptime=120;

        # fastcgi_pass/proxy_pass/drizzle_pass/postgres_pass/echo/etc
    }

    location = /redis {
        internal;

        set_md5 $redis_key $args;
        redis_pass 127.0.0.1:6379;
    }

    location = /redis2 {
        internal;

        set_unescape_uri $exptime $arg_exptime;
        set_unescape_uri $key $arg_key;
        set_md5 $key;

        redis2_query set $key $echo_request_body;
        redis2_query expire $key $exptime;
        redis2_pass 127.0.0.1:6379;
    }
</geshi>

This example makes use of the [[HttpEchoModule#$echo_request_body|$echo_request_body]] variable provided by [[HttpEchoModule]]. Note that you need the latest version of [[HttpEchoModule]], <code>v0.38rc2</code> because earlier versions may not work reliably.

Also, you need both [[HttpRedisModule]] and [[HttpRedis2Module]]. The former is used in the [[#srcache_fetch|srcache_fetch]] subrequest and the latter is used in the [[#srcache_store|srcache_store]] subrequest.

The Nginx core also has a bug that could prevent [[HttpRedis2Module]]'s pipelining support from working properly in certain extreme conditions. And the following patch fixes this:

   http://mailman.nginx.org/pipermail/nginx-devel/2012-March/002040.html

Note that, however, if you are using the [http://openresty.org/ ngx_openresty] 1.0.15.3 bundle or later, then you already have everything that you need here in the bundle.

== Cache Key Preprocessing ==

It is often desired to preprocess the cache key to exclude random noises that may hurt the cache hit rate. For example, random session IDs in the URI arguments are usually desired to get removed.

Consider the following URI querystring

    SID=BC3781C3-2E02-4A11-89CF-34E5CFE8B0EF&UID=44332&L=EN&M=1&H=1&UNC=0&SRC=LK&RT=62

we want to remove the <code>SID</code> and <code>UID</code> arguments from it. It is easy to achieve if you use [[HttpLuaModule]] at the same time:

<geshi lang="nginx">
    location = /t {
        rewrite_by_lua '
            local args = ngx.req.get_uri_args()
            args.SID = nil
            args.UID = nil
            ngx.req.set_uri_args(args)
        ';

        echo $args;
    }
</geshi>

Here we use the [[HttpEchoModule#echo|echo]] directive from [[HttpEchoModule]] to dump out
the final value of [[HttpCoreModule#$args|$args]] in the end. You can replace it with your
[[HttpSRCacheModule]] configurations and upstream configurations instead for
your case. Let's test this /t interface with curl:

    $ curl 'localhost:8081/t?RT=62&SID=BC3781C3-2E02-4A11-89CF-34E5CFE8B0EF&UID=44332&L=EN&M=1&H=1&UNC=0&SRC=LK'
    M=1&UNC=0&RT=62&H=1&L=EN&SRC=LK

It is worth mentioning that, if you want to retain the order of the URI
arguments, then you can do string substitutions on the value of [[HttpCoreModule#$args|$args]]
directly, for example,

    location = /t {
        rewrite_by_lua '
            local args = ngx.var.args
            newargs, n, err = ngx.re.gsub(args, [[\b[SU]ID=[^&]*&?]], "", "jo")
            if n and n > 0 then
                ngx.var.args = newargs
            end
        ';

        echo $args;
    }

Now test it with the original curl command again, we get exactly what
we would expect:

    RT=62&L=EN&M=1&H=1&UNC=0&SRC=LK

But for caching purposes, it's good to normalize the URI argument
order so that you can increase the cache hit rate. And the hash table
entry order used by LuaJIT or Lua can be used to normalize the order
as a nice side effect.

= Directives =

== srcache_fetch ==
'''syntax:''' ''srcache_fetch <method> <uri> <args>?''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''post-access''

This directive registers an access phase handler that will issue an Nginx subrequest to lookup the cache.

When the subrequest returns status code other than <code>200</code>, than a cache miss is signaled and the control flow will continue to the later phases including the content phase configured by [[HttpProxyModule]], [[HttpFcgiModule]], and others. If the subrequest returns <code>200 OK</code>, then a cache hit is signaled and this module will send the subrequest's response as the current main request's response to the client directly.

This directive will always run at the end of the access phase, such that [[HttpAccessModule]]'s [[HttpAccessModule#allow|allow]] and [[HttpAccessModule#deny|deny]] will always run ''before'' this.

You can use the [[#srcache_fetch_skip|srcache_fetch_skip]] directive to disable cache look-up selectively.

== srcache_fetch_skip ==
'''syntax:''' ''srcache_fetch_skip <flag>''

'''default:''' ''srcache_fetch_skip 0''

'''context:''' ''http, server, location, location if''

'''phase:''' ''post-access''

The <code><flag></code> argument supports nginx variables. When this argument's value is not empty ''and'' not equal to <code>0</code>, then the fetching process will be unconditionally skipped.

For example, to skip caching requests which have a cookie named <code>foo</code> with the value <code>bar</code>, we can write

<geshi lang="nginx">
    location / {
        set $key ...;
        set_by_lua $skip '
            if ngx.var.cookie_foo == "bar" then
                return 1
            end
            return 0
        ';

        srcache_fetch_skip $skip;
        srcache_store_skip $skip;

        srcache_fetch GET /memc $key;
        srcache_store GET /memc $key;

        # proxy_pass/fastcgi_pass/content_by_lua/...
    }
</geshi>
where [[HttpLuaModule]] is used to calculate the value of the <code>$skip</code> variable at the (earlier) rewrite phase. Similarly, the <code>$key</code> variable can be computed by Lua using the [[HttpLuaModule#set_by_lua|set_by_lua]] or [[HttpLuaModule#rewrite_by_lua|rewrite_by_lua]] directive too.

The standard [[HttpMapModule#map|map]] directive can also be used to compute the value of the <code>$skip</code> variable used in the sample above:

<geshi lang="nginx">
    map $cookie_foo $skip {
        default     0;
        bar         1;
    }
</geshi>

but your [[HttpMapModule#map|map]] statement should be put into the <code>http</code> config block in your <code>nginx.conf</code> file though.

== srcache_store ==
'''syntax:''' ''srcache_store <method> <uri> <args>?''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-filter''

This directive registers an output filter handler that will issue an Nginx subrequest to save the response of the current main request into a cache backend. The status code of the subrequest will be ignored.

You can use the [[#srcache_store_skip|srcache_store_skip]] and [[#srcache_store_max_size|srcache_store_max_size]] directives to disable caching for certain requests in case of a cache miss.

Since the <code>v0.12rc7</code> release, both the response status line, response headers, and response bodies will be put into the cache. By default, the following special response headers will not be cached:

* Connection
* Keep-Alive
* Proxy-Authenticate
* Proxy-Authorization
* TE
* Trailers
* Transfer-Encoding
* Upgrade
* Set-Cookie

You can use the [[#srcache_store_pass_header|srcache_store_pass_header]] and/or [[#srcache_store_hide_header|srcache_store_hide_header]] directives to control what headers to cache and what not.

The original response's data chunks get emitted as soon as 
they arrive. <code>srcache_store</code> just copies and collects the data in an output filter without postponing them from being sent downstream.

But please note that even though all the response data will be sent immediately, the current Nginx request lifetime will not finish until the srcache_store subrequest completes. That means a delay in closing the TCP connection on the server side (when HTTP keepalive is disabled, but proper HTTP clients should close the connection actively on the client side, which adds no extra delay or other issues at all) or serving the next request sent on the same TCP connection (when HTTP keepalive is in action).

== srcache_store_max_size ==
'''syntax:''' ''srcache_store_max_size <size>''

'''default:''' ''srcache_store_max_size 0''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

When the response body length is exceeding this size, this module will not try to store the response body into the cache using the subrequest template that is specified in [[#srcache_store|srcache_store]].

This is particular useful when using cache storage backend that does have a hard upper limit on the input data. For example, for Memcached server, the limit is usually <code>1 MB</code>.

When <code>0</code> is specified (the default value), there's no limit check at all.

== srcache_store_skip ==
'''syntax:''' ''srcache_store_skip <flag>''

'''default:''' ''srcache_store_skip 0''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

The <code><flag></code> argument supports Nginx variables. When this argument's value is not empty ''and'' not equal to <code>0</code>, then the storing process will be unconditionally skipped.

Starting from the <code>v0.25</code> release, the <code><flag></code> expression (possibly containing Nginx variables) can be evaluated up to twice: the first time is right after the response header is being sent and when the <code><flag></code> expression is not evaluated to true values it will be evaluated again right after the end of the response body data stream is seen. Before <code>v0.25</code>, only the first time evaluation is performed.

Here's an example using Lua to set $nocache to avoid storing URIs that contain the string "/tmp":

<geshi lang="nginx">
    set_by_lua $nocache '
        if string.match(ngx.var.uri, "/tmp") then
            return 1
        end
        return 0';

    srcache_store_skip $nocache;
</geshi>

== srcache_store_statuses ==
'''syntax:''' ''srcache_store_statuses <status1> <status2> ..''

'''default:''' ''srcache_store_statuses 200 301 302''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

This directive controls what responses to store to the cache according to their status code.

By default, only <code>200</code>, <code>301</code>, and <code>302</code> responses will be stored to cache and any other responses will skip [[#srcache_store|srcache_store]].

You can specify arbitrary positive numbers for the response status code that you'd like to cache, even including error code like <code>404</code> and <code>503</code>. For example:

<geshi lang="nginx">
    srcache_store_statuses 200 201 301 302 404 503;
</geshi>

At least one argument should be given to this directive.

This directive was first introduced in the <code>v0.13rc2</code> release.

== srcache_store_ranges ==
'''syntax:''' ''srcache_store_ranges on|off''

'''default:''' ''srcache_store_ranges off''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-body-filter''

When this directive is turned on (default to <code>off</code>), [[#srcache_store|srcache_store]] will also store 206 Partial Content responses generated by the standard <code>ngx_http_range_filter_module</code>. If you turn this directive on, you MUST add <code>$http_range</code> to your cache keys. For example,

<geshi lang="nginx">
    location / {
        set $key "$uri$args$http_range";
        srcache_fetch GET /memc $key;
        srcache_store PUT /memc $key;
    }
</geshi>

This directive was first introduced in the <code>v0.27</code> release.

== srcache_header_buffer_size ==
'''syntax:''' ''srcache_header_buffer_size <size>''

'''default:''' ''srcache_header_buffer_size 4k/8k''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

This directive controles the header buffer when serializing response headers for [[#srcache_store|srcache_store]]. The default size is the page size, usually <code>4k</code> or <code>8k</code> depending on specific platforms.

Note that the buffer is not used to hold all the response headers, but just each individual header. So the buffer is merely needed to be big enough to hold the longest response header.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_store_hide_header ==
'''syntax:''' ''srcache_store_hide_header <header>''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

By default, this module caches all the response headers except the following ones:

* Connection
* Keep-Alive
* Proxy-Authenticate
* Proxy-Authorization
* TE
* Trailers
* Transfer-Encoding
* Upgrade
* Set-Cookie

You can hide even more response headers from [[#srcache_store|srcache_store]] by listing their names (case-insensitive) by means of this directive. For examples,

<geshi lang="nginx">
    srcache_store_hide_header X-Foo;
    srcache_store_hide_header Last-Modified;
</geshi>

Multiple occurrences of this directive are allowed in a single location.

This directive was first introduced in the <code>v0.12rc7</code> release.

See also [[#srcache_store_pass_header|srcache_store_pass_header]].

== srcache_store_pass_header ==
'''syntax:''' ''srcache_store_pass_header <header>''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

By default, this module caches all the response headers except the following ones:

* Connection
* Keep-Alive
* Proxy-Authenticate
* Proxy-Authorization
* TE
* Trailers
* Transfer-Encoding
* Upgrade
* Set-Cookie

You can force [[#srcache_store|srcache_store]] to store one or more of these response headers from [[#srcache_store|srcache_store]] by listing their names (case-insensitive) by means of this directive. For examples,

<geshi lang="nginx">
    srcache_store_pass_header Set-Cookie;
    srcache_store_pass_header Proxy-Autenticate;
</geshi>

Multiple occurrences of this directive are allowed in a single location.

This directive was first introduced in the <code>v0.12rc7</code> release.

See also [[#srcache_store_hide_header|srcache_store_hide_header]].

== srcache_methods ==
'''syntax:''' ''srcache_methods <method>...''

'''default:''' ''srcache_methods GET HEAD''

'''context:''' ''http, server, location''

'''phase:''' ''post-access, output-header-filter''

This directive specifies HTTP request methods that are considered by either [[#srcache_fetch|srcache_fetch]] or [[#srcache_store|srcache_store]]. HTTP request methods not listed will be skipped completely from the cache.

The following HTTP methods are allowed: <code>GET</code>, <code>HEAD</code>, <code>POST</code>, <code>PUT</code>, and <code>DELETE</code>. The <code>GET</code> and <code>HEAD</code> methods are always implicitly included in the list regardless of their presence in this directive.

Note that since the <code>v0.17</code> release <code>HEAD</code> requests are always skipped by [[#srcache_store|srcache_store]] because their responses never carry a response body.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_ignore_content_encoding ==
'''syntax:''' ''srcache_ignore_content_encoding on|off''

'''default:''' ''srcache_ignore_content_encoding off''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

When this directive is turned <code>off</code> (which is the default), non-empty <code>Content-Encoding</code> response header will cause [[#srcache_store|srcache_store]] skip storing the whole response into the cache and issue a warning into nginx's <code>error.log</code> file like this:

<geshi lang="text">
    [warn] 12500#0: *1 srcache_store skipped due to response header "Content-Encoding: gzip"
                (maybe you forgot to disable compression on the backend?)
</geshi>

Turning on this directive will ignore the <code>Content-Encoding</code> response header and store the response as usual (and also without warning).

It's recommended to always disable gzip/deflate compression on your backend server by specifying the following line in your <code>nginx.conf</code> file:

<geshi lang="nginx">
    proxy_set_header  Accept-Encoding  "";
</geshi>

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_request_cache_control ==
'''syntax:''' ''srcache_request_cache_control on|off''

'''default:''' ''srcache_request_cache_control off''

'''context:''' ''http, server, location''

'''phase:''' ''post-access, output-header-filter''

When this directive is turned <code>on</code>, the request headers <code>Cache-Control</code> and <code>Pragma</code> will be honored by this module in the following ways:

# [[#srcache_fetch|srcache_fetch]], i.e., the cache lookup operation, will be skipped when request headers <code>Cache-Control: no-cache</code> and/or <code>Pragma: no-cache</code> are present.
# [[#srcache_store|srcache_store]], i.e., the cache store operation, will be skipped when the request header <code>Cache-Control: no-store</code> is specified.

Turning off this directive will disable this functionality and is considered safer for busy sites mainly relying on cache for speed.

This directive was first introduced in the <code>v0.12rc7</code> release.

See also [[#srcache_response_cache_control|srcache_response_cache_control]].

== srcache_response_cache_control ==
'''syntax:''' ''srcache_response_cache_control on|off''

'''default:''' ''srcache_response_cache_control on''

'''context:''' ''http, server, location''

'''phase:''' ''output-header-filter''

When this directive is turned <code>on</code>, the response headers <code>Cache-Control</code> and <code>Expires</code> will be honored by this module in the following ways:

* <code>Cache-Control: private</code> skips [[#srcache_store|srcache_store]],
* <code>Cache-Control: no-store</code> skips [[#srcache_store|srcache_store]],
* <code>Cache-Control: no-cache</code> skips [[#srcache_store|srcache_store]],
* <code>Cache-Control: max-age=0</code> skips [[#srcache_store|srcache_store]],
* and <code>Expires: <date-no-more-recently-than-now></code> skips [[#srcache_store|srcache_store]].

This directive takes priority over the [[#srcache_store_no_store|srcache_store_no_store]], [[#srcache_store_no_cache|srcache_store_no_cache]], and [[#srcache_store_private|srcache_store_private]] directives.

This directive was first introduced in the <code>v0.12rc7</code> release.

See also [[#srcache_request_cache_control|srcache_request_cache_control]].

== srcache_store_no_store ==
'''syntax:''' ''srcache_store_no_store on|off''

'''default:''' ''srcache_store_no_store off''

'''context:''' ''http, server, location''

'''phase:''' ''output-header-filter''

Turning this directive on will force responses with the header <code>Cache-Control: no-store</code> to be stored into the cache when [[#srcache_response_cache_control|srcache_response_cache_control]] is turned <code>on</code> ''and'' other conditions are met. Default to <code>off</code>.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_store_no_cache ==
'''syntax:''' ''srcache_store_no_cache on|off''

'''default:''' ''srcache_store_no_cache off''

'''context:''' ''http, server, location''

'''phase:''' ''output-header-filter''

Turning this directive on will force responses with the header <code>Cache-Control: no-cache</code> to be stored into the cache when [[#srcache_response_cache_control|srcache_response_cache_control]] is turned <code>on</code> ''and'' other conditions are met. Default to <code>off</code>.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_store_private ==
'''syntax:''' ''srcache_store_private on|off''

'''default:''' ''srcache_store_private off''

'''context:''' ''http, server, location''

'''phase:''' ''output-header-filter''

Turning this directive on will force responses with the header <code>Cache-Control: private</code> to be stored into the cache when [[#srcache_response_cache_control|srcache_response_cache_control]] is turned <code>on</code> ''and'' other conditions are met. Default to <code>off</code>.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_default_expire ==
'''syntax:''' ''srcache_default_expire <time>''

'''default:''' ''srcache_default_expire 60s''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

This directive controls the default expiration time period that is allowed for the [[#$srcache_expire|$srcache_expire]] variable value when neither <code>Cache-Control: max-age=N</code> nor <code>Expires</code> are specified in the response headers.

The <code><time></code> argument values are in seconds by default. But it's wise to always explicitly specify the time unit to avoid confusion. Time units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), "w"(weeks), "d"(days), "h"(hours), and "m"(minutes). For example,

<geshi lang="nginx">
    srcache_default_expire 30m; # 30 minutes
</geshi>

This time must be less than 597 hours.

This directive was first introduced in the <code>v0.12rc7</code> release.

== srcache_max_expire ==
'''syntax:''' ''srcache_max_expire <time>''

'''default:''' ''srcache_max_expire 0''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

This directive controls the maximal expiration time period that is allowed for the [[#$srcache_expire|$srcache_expire]] variable value. This setting takes priority over other calculating methods.

The <code><time></code> argument values are in seconds by default. But it's wise to always explicitly specify the time unit to avoid confusion. Time units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), "w"(weeks), "d"(days), "h"(hours), and "m"(minutes). For example,

<geshi lang="nginx">
    srcache_max_expire 2h;  # 2 hours
</geshi>

This time must be less than 597 hours.

When <code>0</code> is specified, which is the default setting, then there will be ''no'' limit at all.

This directive was first introduced in the <code>v0.12rc7</code> release.

= Variables =
== $srcache_expire ==
'''type:''' ''integer''

'''cacheable:''' ''no''

'''writable:''' ''no''

This Nginx variable gives the recommended expiration time period (in seconds) for the current response being stored into the cache. The algorithm of computing the value is as follows:

# When the response header <code>Cache-Control: max-age=N</code> is specified, then <code>N</code> will be used as the expiration time,
# otherwise if the response header <code>Expires</code> is specified, then the expiration time will be obtained by subtracting the current time stamp from the time specified in the <code>Expires</code> header,
# when neither <code>Cache-Control: max-age=N</code> nor <code>Expires</code> headers are specified, use the value specified in the [[#srcache_default_expire|srcache_default_expire]] directive.

The final value of this variable will be the value specified by the [[#srcache_max_expire|srcache_max_expire]] directive if the value obtained in the algorithm above exceeds the maximal value (if any).

You don't have to use this variable for the expiration time.

This variable was first introduced in the <code>v0.12rc7</code> release.

== $srcache_fetch_status ==
'''type:''' ''string''

'''cacheable:''' ''no''

'''writable:''' ''no''

This Nginx variable is evaluated to the status of the "fetch" phase for the caching system. Three values are possible, <code>HIT</code>, <code>MISS</code>, and <code>BYPASS</code>.

When the "fetch" subrequest returns status code other than <code>200</code> or its response data is not well-formed, then this variable is evaluated to the value <code>MISS</code>.

The value of this variable is only meaningful after the <code>access</code> request processing phase, or <code>BYPASS</code> is always given.

This variable was first introduced in the <code>v0.14</code> release.

== $srcache_store_status ==
'''type:''' ''string''

'''cacheable:''' ''no''

'''writable:''' ''no''

This Nginx variable gives the current caching status for the "store" phase. Two possible values, <code>STORE</code> and <code>BYPASS</code> can be obtained.

Because the responses for the "store" subrequest are always discarded, so the value of this variable will always be <code>STORE</code> as long as the "store" subrequest is actually issued.

The value of this variable is only meaningful at least when the request headers of the current (main) request are being sent. The final result can only be obtained after all the response body has been sent if the <code>Content-Length</code> response header is not specified for the main request.

This variable was first introduced in the <code>v0.14</code> release.

= Known Issues =
* On certain systems, enabling aio and/or sendfile may stop [[#srcache_store|srcache_store]] from working. You can disable them in the locations configured by [[#srcache_store|srcache_store]].
* The [[#srcache_store|srcache_store]] directive can not be used to capture the responses generated by [[HttpEchoModule]]'s subrequest directivees like [[HttpEchoModule#echo_subrequest_async|echo_subrequest_async]] and [[HttpEchoModule#echo_location|echo_location]]. You are recommended to use HttpLuaModule to initiate and capture subrequests, which should work with [[#srcache_store|srcache_store]].

= Caveats =
* It is recommended to disable your backend server's gzip compression and use nginx's [[HttpGzipModule]] to do the job. In case of [[HttpProxyModule]], you can use the following configure setting to disable backend gzip compression:
<geshi lang="nginx">
    proxy_set_header  Accept-Encoding  "";
</geshi>
* Do ''not'' use [[HttpRewriteModule]]'s [[HttpRewriteModule#if|if]] directive in the same location as this module's, because "[[HttpRewriteModule#if|if]] is evil". Instead, use [[HttpMapModule]] or [[HttpLuaModule]] combined with this module's [[#srcache_store_skip|srcache_store_skip]] and/or [[#srcache_fetch_skip|srcache_fetch_skip]] directives. For example:
<geshi lang="nginx">
    map $request_method $skip_fetch {
        default     0;
        POST        1;
        PUT         1;
    }
 
    server {
        listen 8080;
 
        location /api/ {
            set $key "$uri?$args";
 
            srcache_fetch GET /memc $key;
            srcache_store PUT /memc $key;
 
            srcache_methods GET PUT POST;
            srcache_fetch_skip $skip_fetch;
 
            # proxy_pass/drizzle_pass/content_by_lua/echo/...
        }
    }
</geshi>

= Trouble Shooting =

To debug issues, you should always check your Nginx <code>error.log</code> file first. If no error messages are printed, you need to enable the Nginx debugging logs to get more details, as explained in [http://nginx.org/en/docs/debugging_log.html debugging log].

Several common pitfalls for beginners:

* The original response carries a <code>Cache-Control</code> header that explicitly disables caching and you do not configure directives like [[#srcache_response_cache_control|srcache_response_cache_control]].
* The original response is already gzip compressed, which is not cached by default (see [[#srcache_ignore_content_encoding|srcache_ignore_content_encoding]]).

= Installation =

It is recommended to install this module as well as the Nginx core and many other goodies via the [http://openresty.org ngx_openresty bundle]. It is the easiest way and most safe way to set things up. See OpenResty's [http://openresty.org/#Installation installation instructions] for details.

Alternatively, you can build Nginx with this module all by yourself:

* Grab the nginx source code from [http://nginx.org nginx.org], for example, the version 1.7.10 (see [[#Compatibility|Nginx Compatibility]]),
* and then apply the patch to your nginx source tree that fixes an important bug in the mainline Nginx core: https://raw.github.com/openresty/ngx_openresty/master/patches/nginx-1.4.3-upstream_truncation.patch (you do NOT need this patch if you are using nginx 1.5.3 and later versions.)
* after that, download the latest version of the release tarball of this module from srcache-nginx-module [http://github.com/openresty/srcache-nginx-module/tags file list],
* and finally build the Nginx source with this module
<geshi lang="nginx">
        wget 'http://nginx.org/download/nginx-1.7.10.tar.gz'
        tar -xzvf nginx-1.7.10.tar.gz
        cd nginx-1.7.10/
     
        # Here we assume you would install you nginx under /opt/nginx/.
        ./configure --prefix=/opt/nginx \
             --add-module=/path/to/srcache-nginx-module
    
        make -j2
        make install
</geshi>

= Compatibility =

The following versions of Nginx should work with this module:

* 1.7.x (last tested: 1.7.10)
* 1.5.x (last tested: 1.5.12)
* 1.4.x (last tested: 1.4.4)
* 1.3.x (last tested: 1.3.7)
* 1.2.x (last tested: 1.2.9)
* 1.1.x (last tested: 1.1.5)
* 1.0.x (last tested: 1.0.11)
* 0.9.x (last tested: 0.9.4)
* 0.8.x >= 0.8.54 (last tested: 0.8.54)

Earlier versions of Nginx like 0.7.x, 0.6.x and 0.5.x will ''not'' work.

If you find that any particular version of Nginx above 0.7.44 does not work with this module, please consider reporting a bug.

= Community =

== English Mailing List ==

The [https://groups.google.com/group/openresty-en openresty-en] mailing list is for English speakers.

== Chinese Mailing List ==

The [https://groups.google.com/group/openresty openresty] mailing list is for Chinese speakers.

= Bugs and Patches =

Please submit bug reports, wishlists, or patches by

# creating a ticket on the [http://github.com/openresty/srcache-nginx-module/issues GitHub Issue Tracker],
# or posting to the [[#Community|OpenResty community]].

= Source Repository =
Available on github at [http://github.com/openresty/srcache-nginx-module openresty/srcache-nginx-module].

= Test Suite =
This module comes with a Perl-driven test suite. The [http://github.com/openresty/srcache-nginx-module/tree/master/test/t test cases] are [http://github.com/openresty/srcache-nginx-module/blob/master/test/t/main-req.t declarative] too. Thanks to the [http://search.cpan.org/perldoc?Test::Base Test::Nginx] module in the Perl world.

To run it on your side:
<geshi lang="bash">
    $ PATH=/path/to/your/nginx-with-srcache-module:$PATH prove -r t
</geshi>
You need to terminate any Nginx processes before running the test suite if you have changed the Nginx server binary.

Because a single nginx server (by default, <code>localhost:1984</code>) is used across all the test scripts (<code>.t</code> files), it's meaningless to run the test suite in parallel by specifying <code>-jN</code> when invoking the <code>prove</code> utility.

Some parts of the test suite requires modules [[HttpRewriteModule]], [[HttpEchoModule]], [[HttpRdsJsonModule]], and [[HttpDrizzleModule]] to be enabled as well when building Nginx.

= TODO =
* add gzip compression and decompression support.
* add new nginx variable <code>$srcache_key</code> and new directives <code>srcache_key_ignore_args</code>, <code>srcache_key_filter_args</code>, and <code>srcache_key_sort_args</code>.

= Getting involved =
You'll be very welcomed to submit patches to the author or just ask for a commit bit to the source repository on GitHub.

= Author =
Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

= Copyright & License =

Copyright (c) 2010-2015, Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

This module is licensed under the terms of the BSD license.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

= See Also =
* [[HttpMemcModule]]
* [[HttpLuaModule]]
* [[HttpSetMiscModule]]
* The [http://openresty.org ngx_openresty bundle]
