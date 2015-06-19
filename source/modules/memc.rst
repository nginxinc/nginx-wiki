Memc
====

= Name =

'''ngx_memc''' - An extended version of the standard memcached module that supports set, add, delete, and many more memcached commands.

''This module is not distributed with the Nginx source.'' See [[#Installation|the installation instructions]].

= Version =

This document describes ngx_memc [http://github.com/openresty/memc-nginx-module/tags v0.15] released on 8 July 2014.

= Synopsis =

<geshi lang="nginx">
    # GET /foo?key=dog
    #
    # POST /foo?key=cat
    # Cat's value...
    #
    # PUT /foo?key=bird
    # Bird's value...
    #
    # DELETE /foo?key=Tiger
    location /foo {
        set $memc_key $arg_key;

        # $memc_cmd defaults to get for GET,
        #   add for POST, set for PUT, and
        #   delete for the DELETE request method.

        memc_pass 127.0.0.1:11211;
    }
</geshi>

<geshi lang="nginx">
    # GET /bar?cmd=get&key=cat
    #
    # POST /bar?cmd=set&key=dog
    # My value for the "dog" key...
    #
    # DELETE /bar?cmd=delete&key=dog
    # GET /bar?cmd=delete&key=dog
    location /bar {
        set $memc_cmd $arg_cmd;
        set $memc_key $arg_key;
        set $memc_flags $arg_flags; # defaults to 0
        set $memc_exptime $arg_exptime; # defaults to 0

        memc_pass 127.0.0.1:11211;
    }
</geshi>

<geshi lang="nginx">
    # GET /bar?cmd=get&key=cat
    # GET /bar?cmd=set&key=dog&val=animal&flags=1234&exptime=2
    # GET /bar?cmd=delete&key=dog
    # GET /bar?cmd=flush_all
    location /bar {
        set $memc_cmd $arg_cmd;
        set $memc_key $arg_key;
        set $memc_value $arg_val;
        set $memc_flags $arg_flags; # defaults to 0
        set $memc_exptime $arg_exptime; # defaults to 0

        memc_cmds_allowed get set add delete flush_all;

        memc_pass 127.0.0.1:11211;
    }
</geshi>

<geshi lang="nginx">
  http {
    ...
    upstream backend {
       server 127.0.0.1:11984;
       server 127.0.0.1:11985;
    }
    server {
        location /stats {
            set $memc_cmd stats;
            memc_pass backend;
        }
        ...
    }
  }
  ...
</geshi>

<geshi lang="nginx">
    # read the memcached flags into the Last-Modified header
    # to respond 304 to conditional GET
    location /memc {
        set $memc_key $arg_key;

        memc_pass 127.0.0.1:11984;

        memc_flags_to_last_modified on;
    }
</geshi>

<geshi lang="nginx">
    location /memc {
        set $memc_key foo;
        set $memc_cmd get;

        # access the unix domain socket listend by memcached
        memc_pass unix:/tmp/memcached.sock;
    }
</geshi>

= Description =

This module extends the standard [[HttpMemcachedModule|memcached module]] to support almost the whole [http://code.sixapart.com/svn/memcached/trunk/server/doc/protocol.txt memcached ascii protocol].

It allows you to define a custom [http://en.wikipedia.org/wiki/REST REST] interface to your memcached servers or access memcached in a very efficient way from within the nginx server by means of subrequests or [http://github.com/srlindsay/nginx-independent-subrequest independent fake requests].

This module is not supposed to be merged into the Nginx core because I've used [http://www.complang.org/ragel/ Ragel] to generate the memcached response parsers (in C) for joy :)

If you are going to use this module to cache location responses out of the box, try [[HttpSRCacheModule]] with this module to achieve that.

When used in conjunction with [[HttpLuaModule]], it is recommended to use the [http://github.com/openresty/lua-resty-memcached lua-resty-memcached] library instead of this module though, because the former is much more flexible and memory-efficient.

== Keep-alive connections to memcached servers ==

You need [[HttpUpstreamKeepaliveModule]] together with this module for keep-alive TCP connections to your backend memcached servers.

Here's a sample configuration:

<geshi lang="nginx">
  http {
    upstream backend {
      server 127.0.0.1:11211;

      # a pool with at most 1024 connections
      # and do not distinguish the servers:
      keepalive 1024;
    }

    server {
        ...
        location /memc {
            set $memc_cmd get;
            set $memc_key $arg_key;
            memc_pass backend;
        }
    }
  }
</geshi>

== How it works ==

It implements the memcached TCP protocol all by itself, based upon the <code>upstream</code> mechanism. Everything involving I/O is non-blocking.

The module itself does not keep TCP connections to the upstream memcached servers across requests, just like other upstream modules. For a working solution, see section [[#Keep-alive connections to memcached servers|Keep-alive connections to memcached servers]].

= Memcached commands supported =

The memcached storage commands [[#set $memc_key $memc_flags $memc_exptime $memc_value|set]], [[#add $memc_key $memc_flags $memc_exptime $memc_value|add]], [[#replace $memc_key $memc_flags $memc_exptime $memc_value|replace]], [[#prepend $memc_key $memc_flags $memc_exptime $memc_value|prepend]], and [[#append $memc_key $memc_flags $memc_exptime $memc_value|append]] uses the <code>$memc_key</code> as the key, <code>$memc_exptime</code> as the expiration time (or delay) (defaults to 0), <code>$memc_flags</code> as the flags (defaults to 0), to build the corresponding memcached queries.

If <code>$memc_value</code> is not defined at all, then the request body will be used as the value of the <code>$memc_value</code> except for the [[#incr $memc_key $memc_value|incr]] and [[#decr $memc_key $memc_value|decr]] commands. Note that if <code>$memc_value</code> is defined as an empty string (<code>""</code>), that empty string will still be used as the value as is.

The following memcached commands have been implemented and tested (with their parameters marked by corresponding
nginx variables defined by this module):

== get $memc_key ==

Retrieves the value using a key.

<geshi lang="nginx">
  location /foo {
      set $memc_cmd 'get';
      set $memc_key 'my_key';
      
      memc_pass 127.0.0.1:11211;
      
      add_header X-Memc-Flags $memc_flags;
  }
</geshi>

Returns <code>200 OK</code> with the value put into the response body if the key is found, or <code>404 Not Found</code> otherwise. The <code>flags</code> number will be set into the <code>$memc_flags</code> variable so it's often desired to put that info into the response headers by means of the standard [[HttpHeadersModule#add_header|add_header directive]].

It returns <code>502</code> for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

== set $memc_key $memc_flags $memc_exptime $memc_value ==

To use the request body as the memcached value, just avoid setting the <code>$memc_value</code> variable:

<geshi lang="nginx">
  # POST /foo
  # my value...
  location /foo {
      set $memc_cmd 'set';
      set $memc_key 'my_key';
      set $memc_flags 12345;
      set $memc_exptime 24;
      
      memc_pass 127.0.0.1:11211;
  }
</geshi>

Or let the <code>$memc_value</code> hold the value:

<geshi lang="nginx">
  location /foo {
      set $memc_cmd 'set';
      set $memc_key 'my_key';
      set $memc_flags 12345;
      set $memc_exptime 24;
      set $memc_value 'my_value';

      memc_pass 127.0.0.1:11211;
  }
</geshi>

Returns <code>201 Created</code> if the upstream memcached server replies <code>STORED</code>, <code>200</code> for <code>NOT_STORED</code>, <code>404</code> for <code>NOT_FOUND</code>, <code>502</code> for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

The original memcached responses are returned as the response body except for <code>404 NOT FOUND</code>.

== add $memc_key $memc_flags $memc_exptime $memc_value ==

Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].

== replace $memc_key $memc_flags $memc_exptime $memc_value ==

Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].

== append $memc_key $memc_flags $memc_exptime $memc_value ==

Similar to the [[#set $memc_key $memc_flags $memc_exptime $memc_value|set command]].

Note that at least memcached version 1.2.2 does not support the "append" and "prepend" commands. At least 1.2.4 and later versions seem to supports these two commands.

== prepend $memc_key $memc_flags $memc_exptime $memc_value ==

Similar to the [[#append $memc_key $memc_flags $memc_exptime $memc_value|append command]].

== delete $memc_key ==

Deletes the memcached entry using a key.

<geshi lang="nginx">
  location /foo
      set $memc_cmd delete;
      set $memc_key my_key;
      
      memc_pass 127.0.0.1:11211;
  }
</geshi>

Returns <code>200 OK</code> if deleted successfully, <code>404 Not Found</code> for <code>NOT_FOUND</code>, or <code>502</code> for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

The original memcached responses are returned as the response body except for <code>404 NOT FOUND</code>.

== delete $memc_key $memc_exptime ==

Similar to the [[#delete $memc_key|delete $memc_key]] command except it accepts an optional <code>expiration</code> time specified by the <code>$memc_exptime</code> variable.

This command is no longer available in the latest memcached version 1.4.4.

== incr $memc_key $memc_value ==

Increments the existing value of <code>$memc_key</code> by the amount specified by <code>$memc_value</code>:

<geshi lang="nginx">
  location /foo {
      set $memc_key my_key;
      set $memc_value 2;
      memc_pass 127.0.0.1:11211;
  }
</geshi>

In the preceding example, every time we access <code>/foo</code> will cause the value of <code>my_key</code> increments by <code>2</code>.

Returns <code>200 OK</code> with the new value associated with that key as the response body if successful, or <code>404 Not Found</code> if the key is not found.

It returns <code>502</code> for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

== decr $memc_key $memc_value ==

Similar to [[#incr $memc_key $memc_value|incr $memc_key $memc_value]].

== flush_all ==

Mark all the keys on the memcached server as expired:

<geshi lang="nginx">
  location /foo {
      set $memc_cmd flush_all;
      memc_pass 127.0.0.1:11211;
  }
</geshi>

== flush_all $memc_exptime ==

Just like [[#flush_all|flush_all]] but also accepts an expiration time specified by the <code>$memc_exptime</code> variable.

== stats ==

Causes the memcached server to output general-purpose statistics and settings

<geshi lang="nginx">
  location /foo {
      set $memc_cmd stats;
      memc_pass 127.0.0.1:11211;
  }
</geshi>

Returns <code>200 OK</code> if the request succeeds, or 502 for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

The raw <code>stats</code> command output from the upstream memcached server will be put into the response body. 

== version ==

Queries the memcached server's version number:

<geshi lang="nginx">
  location /foo {
      set $memc_cmd version;
      memc_pass 127.0.0.1:11211;
  }
</geshi>

Returns <code>200 OK</code> if the request succeeds, or 502 for <code>ERROR</code>, <code>CLIENT_ERROR</code>, or <code>SERVER_ERROR</code>.

The raw <code>version</code> command output from the upstream memcached server will be put into the response body.

= Directives =

All the standard [[HttpMemcachedModule|memcached module]] directives in nginx 0.8.28 are directly inherited, with the <code>memcached_</code> prefixes replaced by <code>memc_</code>. For example, the <code>memcached_pass</code> directive is spelled <code>memc_pass</code>.

Here we only document the most important two directives (the latter is a new directive introduced by this module).

== memc_pass ==

'''syntax:''' ''memc_pass <memcached server IP address>:<memcached server port>''

'''syntax:''' ''memc_pass <memcached server hostname>:<memcached server port>''

'''syntax:''' ''memc_pass <upstream_backend_name>''

'''syntax:''' ''memc_pass unix:<path_to_unix_domain_socket>''

'''default:''' ''none''

'''context:''' ''http, server, location, if''

'''phase:''' ''content''

Specify the memcached server backend.

== memc_cmds_allowed ==
'''syntax:''' ''memc_cmds_allowed <cmd>...''

'''default:''' ''none''

'''context:''' ''http, server, location, if''

Lists memcached commands that are allowed to access. By default, all the memcached commands supported by this module are accessible.
An example is

<geshi lang="nginx">
   location /foo {
       set $memc_cmd $arg_cmd;
       set $memc_key $arg_key;
       set $memc_value $arg_val;
       
       memc_pass 127.0.0.1:11211;
        
       memc_cmds_allowed get;
   }
</geshi>

== memc_flags_to_last_modified ==
'''syntax:''' ''memc_flags_to_last_modified on|off''

'''default:''' ''off''

'''context:''' ''http, server, location, if''

Read the memcached flags as epoch seconds and set it as the value of the <code>Last-Modified</code> header. For conditional GET, it will signal nginx to return <code>304 Not Modified</code> response to save bandwidth.

== memc_connect_timeout ==
'''syntax:''' ''memc_connect_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for connecting to the memcached server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), "w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.

== memc_send_timeout ==
'''syntax:''' ''memc_send_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for sending TCP requests to the memcached server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), "w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.

== memc_read_timeout ==
'''syntax:''' ''memc_read_timeout <time>''

'''default:''' ''60s''

'''context:''' ''http, server, location''

The timeout for reading TCP responses from the memcached server, in seconds by default.

It's wise to always explicitly specify the time unit to avoid confusion. Time units supported are "s"(seconds), "ms"(milliseconds), "y"(years), "M"(months), "w"(weeks), "d"(days), "h"(hours), and "m"(minutes).

This time must be less than 597 hours.

== memc_buffer_size ==
'''syntax:''' ''memc_buffer_size <size>''

'''default:''' ''4k/8k''

'''context:''' ''http, server, location''

This buffer size is used for the memory buffer to hold

* the complete response for memcached commands other than <code>get</code>,
* the complete response header (i.e., the first line of the response) for the <code>get</code> memcached command.

This default size is the page size, may be <code>4k</code> or <code>8k</code>.

== memc_ignore_client_abort ==
'''syntax:''' ''memc_ignore_client_abort on|off''

'''default:''' ''off''

'''context:''' ''location''

Determines whether the connection with a memcache server should be closed when a client closes a connection without waiting for a response.

This directive was first added in the <code>v0.14</code> release.

= Installation =

You're recommended to install this module (as well as the Nginx core and many other goodies) via the [http://openresty.org ngx_openresty bundle]. See the [http://openresty.org/#Installation installation steps] for <code>ngx_openresty</code>.

Alternatively, you can compile this module into the standard Nginx source distribution by hand:

Grab the nginx source code from [http://nginx.org/ nginx.org], for example,
the version 1.7.2 (see [[#Compatibility|nginx compatibility]]), and then build the source with this module:

<geshi lang="bash">
    wget 'http://nginx.org/download/nginx-1.7.2.tar.gz'
    tar -xzvf nginx-1.7.2.tar.gz
    cd nginx-1.7.2/
    
    # Here we assume you would install you nginx under /opt/nginx/.
    ./configure --prefix=/opt/nginx \
        --add-module=/path/to/memc-nginx-module
     
    make -j2
    make install
</geshi>

Download the latest version of the release tarball of this module from [http://github.com/openresty/memc-nginx-module/tags memc-nginx-module file list].

== For Developers ==

The memached response parsers were generated by [http://www.complang.org/ragel/ Ragel]. If you want to
regenerate the parser's C file, i.e., [http://github.com/openresty/memc-nginx-module/blob/master/src/ngx_http_memc_response.c src/ngx_http_memc_response.c], use the following command from the root of the memc module's source tree:

<geshi lang="bash">
    $ ragel -G2 src/ngx_http_memc_response.rl
</geshi>

= Compatibility =

The following versions of Nginx should work with this module:

* '''1.7.x'''                       (last tested: 1.7.2)
* '''1.5.x'''                       (last tested: 1.5.12)
* '''1.4.x'''                       (last tested: 1.4.4)
* '''1.2.x'''                       (last tested: 1.2.9)
* '''1.1.x'''                       (last tested: 1.1.5)
* '''1.0.x'''                       (last tested: 1.0.10)
* '''0.9.x'''                       (last tested: 0.9.4)
* '''0.8.x'''                       (last tested: 0.8.54)
* '''0.7.x >= 0.7.46'''             (last tested: 0.7.68)

It's worth mentioning that some 0.7.x versions older than 0.7.46 might also work, but I can't easily test them because the test suite makes extensive use of the [[HttpEchoModule|echo module]]'s [[HttpEchoModule#echo_location|echo_location directive]], which requires at least nginx 0.7.46 :)

Earlier versions of Nginx like 0.6.x and 0.5.x will ''not'' work.

If you find that any particular version of Nginx above 0.7.46 does not work with this module, please consider [[#Report Bugs|reporting a bug]].

= Community =

== English Mailing List ==

The [https://groups.google.com/group/openresty-en openresty-en] mailing list is for English speakers.

== Chinese Mailing List ==

The [https://groups.google.com/group/openresty openresty] mailing list is for Chinese speakers.

= Report Bugs =

Although a lot of effort has been put into testing and code tuning, there must be some serious bugs lurking somewhere in this module. So whenever you are bitten by any quirks, please don't hesitate to

# create a ticket on the [http://github.com/openresty/memc-nginx-module/issues issue tracking interface] provided by GitHub,
# or send a bug report or even patches to the [http://mailman.nginx.org/mailman/listinfo/nginx nginx mailing list].

= Source Repository =

Available on github at [http://github.com/openresty/memc-nginx-module openresty/memc-nginx-module].

= Changes =

The changes of every release of this module can be obtained from the ngx_openresty bundle's change logs:

http://openresty.org/#Changes

= Test Suite =

This module comes with a Perl-driven test suite. The [http://github.com/openresty/memc-nginx-module/tree/master/t/ test cases] are
[http://github.com/openresty/memc-nginx-module/blob/master/t/storage.t declarative] too. Thanks to the [http://search.cpan.org/perldoc?Test::Base Test::Base] module in the Perl world.

To run it on your side:

<geshi lang="bash">
    $ PATH=/path/to/your/nginx-with-memc-module:$PATH prove -r t
</geshi>

You need to terminate any Nginx processes before running the test suite if you have changed the Nginx server binary.

Either [http://search.cpan.org/perldoc?LWP::UserAgent LWP::UserAgent] or [http://search.cpan.org/perldoc?IO::Socket IO::Socket] is used by the [http://github.com/openresty/memc-nginx-module/blob/master/test/lib/Test/Nginx/LWP.pm test scaffold].

Because a single nginx server (by default, <code>localhost:1984</code>) is used across all the test scripts (<code>.t</code> files), it's meaningless to run the test suite in parallel by specifying <code>-jN</code> when invoking the <code>prove</code> utility.

You should also keep a memcached server listening on the <code>11211</code> port at localhost before running the test suite.

Some parts of the test suite requires modules [[HttpRewriteModule|rewrite]] and [[HttpEchoModule|echo]] to be enabled as well when building Nginx.

= TODO =

* add support for the memcached commands <code>cas</code>, <code>gets</code> and <code>stats $memc_value</code>.
* add support for the <code>noreply</code> option.

= Getting involved =

You'll be very welcomed to submit patches to the [[#Author|author]] or just ask for a commit bit to the [[#Source Repository|source repository]] on GitHub.

= Author =

Yichun "agentzh" Zhang (章亦春) ''<agentzh@gmail.com>'', CloudFlare Inc.

This wiki page is also maintained by the author himself, and everybody is encouraged to improve this page as well.

= Copyright & License =

The code base is borrowed directly from the standard [[HttpMemcachedModule|memcached module]] in the Nginx core. This part of code is copyrighted by Igor Sysoev and Nginx Inc.

Copyright (c) 2009-2013, Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

This module is licensed under the terms of the BSD license.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

= See Also =

* The original announcement email on the nginx mailing list: [http://forum.nginx.org/read.php?2,28359 ngx_memc: "an extended version of ngx_memcached that supports set, add, delete, and many more commands"]
* My slides demonstrating various ngx_memc usage: http://agentzh.org/misc/slides/nginx-conf-scripting/nginx-conf-scripting.html#34 (use the arrow or pageup/pagedown keys on the keyboard to swith pages)
* The latest [http://code.sixapart.com/svn/memcached/trunk/server/doc/protocol.txt memcached TCP protocol].
* The [http://github.com/openresty/srcache-nginx-module ngx_srcache] module
* The [https://github.com/openresty/lua-resty-memcached lua-resty-memcached] library based on the [[HttpLuaModule]] cosocket API.
* The standard [[HttpMemcachedModule|memcached]] module.
* The [[HttpEchoModule|echo module]] for Nginx module's automated testing.
* The standard [[HttpHeadersModule|headers]] module and the 3rd-parth [[HttpHeadersMoreModule|headers-more]] module.
