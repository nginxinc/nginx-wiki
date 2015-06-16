Redis2
======

= Name =

ngx_redis2 - Nginx upstream module for the Redis 2.0 protocol

''This module is not distributed with the Nginx source.'' See [[#Installation|the installation instructions]].

= Status =

This module is already production ready.

= Version =

This document describes ngx_redis2 [https://github.com/openresty/redis2-nginx-module/tags v0.11] released on 24 April 2014.

= Synopsis =

<geshi lang="nginx">
    location = /foo {
        set $value 'first';
        redis2_query set one $value;
        redis2_pass 127.0.0.1:6379;
    }

    # GET /get?key=some_key
    location = /get {
        set_unescape_uri $key $arg_key;  # this requires ngx_set_misc
        redis2_query get $key;
        redis2_pass foo.com:6379;
    }

    # GET /set?key=one&val=first%20value
    location = /set {
        set_unescape_uri $key $arg_key;  # this requires ngx_set_misc
        set_unescape_uri $val $arg_val;  # this requires ngx_set_misc
        redis2_query set $key $val;
        redis2_pass foo.com:6379;
    }

    # multiple pipelined queries
    location = /foo {
        set $value 'first';
        redis2_query set one $value;
        redis2_query get one;
        redis2_query set one two;
        redis2_query get one;
        redis2_pass 127.0.0.1:6379;
    }

    location = /bar {
        # $ is not special here...
        redis2_literal_raw_query '*1\r\n$4\r\nping\r\n';
        redis2_pass 127.0.0.1:6379;
    }

    location = /bar {
        # variables can be used below and $ is special
        redis2_raw_query 'get one\r\n';
        redis2_pass 127.0.0.1:6379;
    }

    # GET /baz?get%20foo%0d%0a
    location = /baz {
        set_unescape_uri $query $query_string; # this requires the ngx_set_misc module
        redis2_raw_query $query;
        redis2_pass 127.0.0.1:6379;
    }

    location = /init {
        redis2_query del key1;
        redis2_query lpush key1 C;
        redis2_query lpush key1 B;
        redis2_query lpush key1 A;
        redis2_pass 127.0.0.1:6379;
    }

    location = /get {
        redis2_query lrange key1 0 -1;
        redis2_pass 127.0.0.1:6379;
    }
</geshi>

= Description =

This is an Nginx upstream module that makes nginx talk to a [http://redis.io/ Redis] 2.x server in a non-blocking way. The full Redis 2.0 unified protocol has been implemented including the Redis pipelining support.

This module returns the raw TCP response from the Redis server. It's recommended to use my [[LuaRedisParser]] (written in pure C) to parse these responses into lua data structure when combined with [[HttpLuaModule]].

When used in conjunction with [[HttpLuaModule]], it is recommended to use the [http://github.com/openresty/lua-resty-redis lua-resty-redis] library instead of this module though, because the former is much more flexible and memory-efficient.

If you only want to use the <code>get</code> redis command, you can try out the [[HttpRedisModule]]. It returns the parsed content part of the Redis response because only <code>get</code> is needed to implement.

Another option is to parse the redis responses on your client side yourself.

= Directives =

== redis2_query ==
'''syntax:''' ''redis2_query cmd arg1 arg2 ...''

'''default:''' ''no''

'''context:''' ''location, location if''

Specify a Redis command by specifying its individual arguments (including the Redis command name itself) in a similar way to the <code>redis-cli</code> utility.

Multiple instances of this directive are allowed in a single location and these queries will be pipelined. For example,

<geshi lang="nginx">
    location = /pipelined {
        redis2_query set hello world;
        redis2_query get hello;

        redis2_pass 127.0.0.1:$TEST_NGINX_REDIS_PORT;
    }
</geshi>

then <code>GET /pipelined</code> will yield two successive raw Redis responses

<geshi lang="nginx">
    +OK
    $5
    world
</geshi>

while newlines here are actually <code>CR LF</code> (<code>\r\n</code>).

== redis2_raw_query ==
'''syntax:''' ''redis2_raw_query QUERY''

'''default:''' ''no''

'''context:''' ''location, location if''

Specify raw Redis queries and nginx variables are recognized in the <code>QUERY</code> argument.

Only ''one'' Redis command is allowed in the <code>QUERY</code> argument, or you'll receive an error. If you want to specify multiple pipelined commands in a single query, use the [[#redis2_raw_queries|redis2_raw_queries]] directive instead.

== redis2_raw_queries ==
'''syntax:''' ''redis2_raw_queries N QUERIES''

'''default:''' ''no''

'''context:''' ''location, location if''

Specify <code>N</code> commands in the <code>QUERIES</code> argument. Both the <code>N</code> and <code>QUERIES</code>
arguments can take Nginx variables.

Here's some examples
<geshi lang="nginx">
    location = /pipelined {
        redis2_raw_queries 3 "flushall\r\nget key1\r\nget key2\r\n";
        redis2_pass 127.0.0.1:6379;
    }

    # GET /pipelined2?n=2&cmds=flushall%0D%0Aget%20key%0D%0A
    location = /pipelined2 {
        set_unescape_uri $n $arg_n;
        set_unescape_uri $cmds $arg_cmds;

        redis2_raw_queries $n $cmds;

        redis2_pass 127.0.0.1:6379;
    }
</geshi>
Note that in the second sample above, the [[HttpSetMiscModule#set_unescape_uri|set_unescape_uri]] directive is provided by the [[HttpSetMiscModule]].

== redis2_literal_raw_query ==
'''syntax:''' ''redis2_literal_raw_query QUERY''

'''default:''' ''no''

'''context:''' ''location, location if''

Specify a raw Redis query but Nginx variables in it will not be ''not'' recognized. In other words, you're free to use the dollar sign character (<code>$</code>) in your <code>QUERY</code> argument.

Only One redis command is allowed in the <code>QUERY</code> argument.

== redis2_pass ==
'''syntax:''' ''redis2_pass <upstream_name>''

'''syntax:''' ''redis2_pass <host>:<port>''

'''default:''' ''no''

'''context:''' ''location, location if''

'''phase:''' ''content''

Specify the Redis server backend. 

== redis2_connect_timeout ==
'''syntax:''' ''redis2_connect_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for connecting to the Redis server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are <code>s</code>(seconds), <code>ms</code>(milliseconds), <code>y</code>(years), <code>M</code>(months), <code>w</code>(weeks), <code>d</code>(days), <code>h</code>(hours), and <code>m</code>(minutes).

This time must be less than 597 hours.

== redis2_send_timeout ==
'''syntax:''' ''redis2_send_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for sending TCP requests to the Redis server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are <code>s</code>(seconds), <code>ms</code>(milliseconds), <code>y</code>(years), <code>M</code>(months), <code>w</code>(weeks), <code>d</code>(days), <code>h</code>(hours), and <code>m</code>(minutes).

== redis2_read_timeout ==
'''syntax:''' ''redis2_read_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for reading TCP responses from the redis server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are <code>s</code>(seconds), <code>ms</code>(milliseconds), <code>y</code>(years), <code>M</code>(months), <code>w</code>(weeks), <code>d</code>(days), <code>h</code>(hours), and <code>m</code>(minutes).

== redis2_buffer_size ==
'''syntax:''' ''redis2_buffer_size <size>''

'''default:''' ''4k/8k''

'''context:''' ''http, server, location''

This buffer size is used for reading Redis replies, but it's not required to be as big as the largest possible Redis reply.

This default size is the page size, may be 4k or 8k.

== redis2_next_upstream ==
'''syntax:''' ''redis2_next_upstream [ error | timeout | invalid_response | off ]''

'''default:''' ''error timeout''

'''context:''' ''http, server, location''

Specify which failure conditions should cause the request to be forwarded to another
upstream server. Applies only when the value in [[#redis2_pass|redis2_pass]] is an upstream with two or more
servers.

Here's an artificial example:
<geshi lang="nginx">
    upstream redis_cluster {
        server 127.0.0.1:6379;
        server 127.0.0.1:6380;
    }

    server {
        location = /redis {
            redis2_next_upstream error timeout invalid_response;
            redis2_query get foo;
            redis2_pass redis_cluster;
        }
    }
</geshi>

= Connection Pool =

You can use the excellent [[HttpUpstreamKeepaliveModule]] with this module to provide TCP connection pool for Redis.

A sample config snippet looks like this

<geshi lang="nginx">
    http {
        upstream backend {
          server 127.0.0.1:6379;

          # a pool with at most 1024 connections
          # and do not distinguish the servers:
          keepalive 1024;
        }

        server {
            ...
            location = /redis {
                set_unescape_uri $query $arg_query;
                redis2_query $query;
                redis2_pass backend;
            }
        }
    }
</geshi>

= Lua Interoperability =

This module can be served as a non-blocking redis2 client for [[HttpLuaModule]] (but nowadays it is recommended to use the [http://github.com/openresty/lua-resty-redis lua-resty-redis] library instead, which is much simpler to use and more efficient most of the time).
Here's an example using a GET subrequest:

<geshi lang="nginx">
    location = /redis {
        internal;

        # set_unescape_uri is provided by ngx_set_misc
        set_unescape_uri $query $arg_query;

        redis2_raw_query $query;
        redis2_pass 127.0.0.1:6379;
    }

    location = /main {
        content_by_lua '
            local res = ngx.location.capture("/redis",
                { args = { query = "ping\\r\\n" } }
            )
            ngx.print("[" .. res.body .. "]")
        ';
    }
</geshi>

Then accessing <code>/main</code> yields

<geshi lang="text">
    [+PONG\r\n]
</geshi>

where <code>\r\n</code> is <code>CRLF</code>. That is, this module returns the ''raw'' TCP responses from the remote redis server. For Lua-based application developers, they may want to utilize the [[LuaRedisParser]] library (written in pure C) to parse such raw responses into Lua data structures.

When moving the inlined Lua code into an external <code>.lua</code> file, it's important to use the escape sequence <code>\r\n</code> directly. We used <code>\\r\\n</code> above just because the Lua code itself needs quoting when being put into an Nginx string literal.

You can also use POST/PUT subrequests to transfer the raw Redis request via request body, which does not require URI escaping and unescaping, thus saving some CPU cycles. Here's such an example:

<geshi lang="nginx">
    location = /redis {
        internal;

        # $echo_request_body is provided by the ngx_echo module
        redis2_raw_query $echo_request_body;

        redis2_pass 127.0.0.1:6379;
    }

    location = /main {
        content_by_lua '
            local res = ngx.location.capture("/redis",
                { method = ngx.HTTP_PUT,
                  body = "ping\\r\\n" }
            )
            ngx.print("[" .. res.body .. "]")
        ';
    }
</geshi>

This yeilds exactly the same output as the previous (GET) sample.

One can also use Lua to pick up a concrete Redis backend based on some complicated hashing rules. For instance,

<geshi lang="nginx">
    upstream redis-a {
        server foo.bar.com:6379;
    }

    upstream redis-b {
        server bar.baz.com:6379;
    }

    upstream redis-c {
        server blah.blah.org:6379;
    }

    server {
        ...

        location = /redis {
            set_unescape_uri $query $arg_query;
            redis2_query $query;
            redis2_pass $arg_backend;
        }

        location = /foo {
            content_by_lua "
                -- pick up a server randomly
                local servers = {'redis-a', 'redis-b', 'redis-c'}
                local i = ngx.time() % #servers + 1;
                local srv = servers[i]

                local res = ngx.location.capture('/redis',
                    { args = {
                        query = '...',
                        backend = srv
                      }
                    }
                )
                ngx.say(res.body)
            ";
        }
    }
</geshi>

== Pipelined Redis Requests by Lua ==

Here's a complete example demonstrating how to use Lua to issue multiple pipelined Redis requests via this Nginx module.

First of all, we include the following in our <code>nginx.conf</code> file:

<geshi lang="nginx">
    location = /redis2 {
        internal;

        redis2_raw_queries $args $echo_request_body;
        redis2_pass 127.0.0.1:6379;
    }

    location = /test {
        content_by_lua_file conf/test.lua;
    }
</geshi>

Basically we use URI query args to pass the number of Redis requests and request body to pass the pipelined Redis request string.

And then we create the <code>conf/test.lua</code> file (whose path is relative to the server root of Nginx) to include the following Lua code:

<geshi lang="lua">
    -- conf/test.lua
    local parser = require "redis.parser"

    local reqs = {
        {"set", "foo", "hello world"},
        {"get", "foo"}
    }

    local raw_reqs = {}
    for i, req in ipairs(reqs) do
        table.insert(raw_reqs, parser.build_query(req))
    end

    local res = ngx.location.capture("/redis2?" .. #reqs,
        { body = table.concat(raw_reqs, "") })

    if res.status ~= 200 or not res.body then
        ngx.log(ngx.ERR, "failed to query redis")
        ngx.exit(500)
    end

    local replies = parser.parse_replies(res.body, #reqs)
    for i, reply in ipairs(replies) do
        ngx.say(reply[1])
    end
</geshi>

Here we assume that your Redis server is listening on the default port (6379) of the localhost. We also make use of the [[LuaRedisParser]] library to construct raw Redis queries for us and also use it to parse the replies.

Accessing the <code>/test</code> location via HTTP clients like <code>curl</code> yields the following output

<geshi lang="text">
OK
hello world
</geshi>

A more realistic setting is to use a proper upstream definition for our Redis backend and enable TCP connection pool via the [[HttpUpstreamKeepaliveModule#keepalive|keepalive]] directive in it.

= Redis Publish/Subscribe Support =

This module has limited support for Redis publish/subscribe feature. It cannot be fully supported due to the stateless nature of REST and HTTP model.

Consider the following example:

<geshi lang="nginx">
    location = /redis {
        redis2_raw_queries 2 "subscribe /foo/bar\r\n";
        redis2_pass 127.0.0.1:6379;
    }
</geshi>

And then publish a message for the key <code>/foo/bar</code> in the <code>redis-cli</code> command line. And then you'll receive two multi-bulk replies from the <code>/redis</code> location.

You can surely parse the replies with the [[LuaRedisParser]] library if you're using Lua to access this module's location.

== Limitations For Redis Publish/Subscribe ==

If you want to use the [http://redis.io/topics/pubsub Redis pub/sub] feature with this module, then you must note the following limitations:

* You cannot use [[HttpUpstreamKeepaliveModule]] with this Redis upstream. Only short Redis connections will work.
* There may be some race conditions that produce the harmless <code>Redis server returned extra bytes</code> warnings in your nginx's error.log. Such warnings might be rare but just be prepared for it.
* You should tune the various timeout settings provided by this module like [[#redis2_connect_timeout|redis2_connect_timeout]] and [[#redis2_read_timeout|redis2_read_timeout]].

If you cannot stand these limitations, then you are highly recommended to switch to the [https://github.com/openresty/lua-resty-redis lua-resty-redis] library for [[HttpLuaModule]].

= Performance Tuning =

* When you're using this module, please ensure you're using a TCP connection pool (provided by [[HttpUpstreamKeepaliveModule]]) and Redis pipelining wherever possible. These features will significantly improve performance.
* Using multiple instance of Redis servers on your multi-core machines also help a lot due to the sequential processing nature of a single Redis server instance.
* When you're benchmarking performance using something like <code>ab</code> or <code>http_load</code>, please ensure that your error log level is high enough (like <code>warn</code>) to prevent Nginx workers spend too much cycles on flushing the <code>error.log</code> file, which is always non-buffered and blocking and thus very expensive.

= Installation =

You are recommended to install this module (as well as the Nginx core and many many other goodies) via the [http://openresty.org ngx_openresty bundle]. Check out the [http://openresty.org/#Installation installation instructions] for setting up [http://openresty.org ngx_openresty].

Alternatively, you can install this module manually by recompiling the standard Nginx core as follows:

* Grab the nginx source code from [http://nginx.org nginx.org], for example, the version 1.7.4 (see nginx compatibility),
* and then download the latest version of the release tarball of this module from ngx_redis2's [http://github.com/openresty/redis2-nginx-module/tags file list].
* and finally build the source with this module:
<geshi lang="bash">
    wget 'http://nginx.org/download/nginx-1.7.4.tar.gz'
    tar -xzvf nginx-1.7.4.tar.gz
    cd nginx-1.7.4/

    # Here we assume you would install you nginx under /opt/nginx/.
    ./configure --prefix=/opt/nginx \
                --add-module=/path/to/redis2-nginx-module

    make -j2
    make install
</geshi>

= Compatibility =

Redis 2.0, 2.2, 2.4, and above should work with this module without any issues. So is the [http://code.google.com/p/alchemydatabase/ Alchemy Database] (aka redisql in its early days).

The following versions of Nginx should work with this module:

* 1.7.x (last tested: 1.7.4)
* 1.6.x
* 1.5.x (last tested: 1.5.12)
* 1.4.x (last tested: 1.4.3)
* 1.3.x (last tested: 1.3.7)
* 1.2.x (last tested: 1.2.7)
* 1.1.x (last tested: 1.1.5)
* 1.0.x (last tested: 1.0.10)
* 0.9.x (last tested: 0.9.4)
* 0.8.x >= 0.8.31 (last tested: 0.8.54)

Earlier versions of Nginx will ''not'' work.

If you find that any particular version of Nginx above 0.8.31 does not work with this module, please consider reporting a bug.

= Community =

== English Mailing List ==

The [https://groups.google.com/group/openresty-en openresty-en] mailing list is for English speakers.

== Chinese Mailing List ==

The [https://groups.google.com/group/openresty openresty] mailing list is for Chinese speakers.

= Bugs and Patches =

Please submit bug reports, wishlists, or patches by

# creating a ticket on the [http://github.com/openresty/redis2-nginx-module/issues GitHub Issue Tracker],
# or posting to the [[#Community|OpenResty community]].

= Source Repository =

Available on github at [http://github.com/openresty/redis2-nginx-module openresty/redis2-nginx-module].

= TODO =
* Add the <code>redis2_as_json</code> directive to allow emitting JSON directly.

= Author =

Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

= Getting involved =

You'll be very welcomed to submit patches to the author or just ask for
a commit bit to the source repository on GitHub.

= Copyright & License =

This module is licenced under the BSD license.

Copyright (C) 2010-2014, by Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

= SEE ALSO =
* The [http://redis.io/ Redis] server homepage.
* The Redis wire protocol: http://redis.io/topics/protocol
* a redis response parser and a request constructor for Lua: [[LuaRedisParser]].
* [[HttpLuaModule]]
* The [http://openresty.org ngx_openresty bundle].
* The [https://github.com/openresty/lua-resty-redis lua-resty-redis] library based on the [[HttpLuaModule]] cosocket API.
