Headers More
============

= Name =

'''ngx_headers_more''' - Set and clear input and output headers...more than "add"!

''This module is not distributed with the Nginx source.'' See [[#Installation|the installation instructions]].

= Version =

This document describes headers-more-nginx-module [http://github.com/agentzh/headers-more-nginx-module/tags v0.25] released on 10 January 2014.

= Synopsis =

<geshi lang="nginx">
    # set the Server output header
    more_set_headers 'Server: my-server';

    # set and clear output headers
    location /bar {
        more_set_headers 'X-MyHeader: blah' 'X-MyHeader2: foo';
        more_set_headers -t 'text/plain text/css' 'Content-Type: text/foo';
        more_set_headers -s '400 404 500 503' -s 413 'Foo: Bar';
        more_clear_headers 'Content-Type';
        
        # your proxy_pass/memcached_pass/or any other config goes here...
    }

    # set output headers
    location /type {
        more_set_headers 'Content-Type: text/plain';
        # ...
    }

    # set input headers
    location /foo {
        set $my_host 'my dog';
        more_set_input_headers 'Host: $my_host';
        more_set_input_headers -t 'text/plain' 'X-Foo: bah';
       
        # now $host and $http_host have their new values...
        # ...
    }

    # replace input header X-Foo *only* if it already exists
    more_set_input_headers -r 'X-Foo: howdy';
</geshi>

= Description =

This module allows you to add, set, or clear any output
or input header that you specify.

This is an enhanced version of the standard
[[HttpHeadersModule|headers]] module because it provides more utilities like
resetting or clearing "builtin headers" like <code>Content-Type</code>,
<code>Content-Length</code>, and <code>Server</code>.

It also allows you to specify an optional HTTP status code
criteria using the <code>-s</code> option and an optional content
type criteria using the <code>-t</code> option while modifying the
output headers with the [[#more_set_headers|more_set_headers]] and
[[#more_clear_headers|more_clear_headers]] directives. For example,

<geshi lang="nginx">
    more_set_headers -s 404 -t 'text/html' 'X-Foo: Bar';
</geshi>

Input headers can be modified as well. For example

<geshi lang="nginx">
    location /foo {
        more_set_input_headers 'Host: foo' 'User-Agent: faked';
        # now $host, $http_host, $user_agent, and
        #   $http_user_agent all have their new values.
    }
</geshi>

The option <code>-t</code> is also available in the
[[#more_set_input_headers|more_set_input_headers]] and
[[#more_clear_input_headers|more_clear_input_headers]] directives (for request header filtering) while the <code>-s</code> option
is not allowed.

Unlike the standard [[HttpHeadersModule|headers]] module, this module's directives will by
default apply to all the status codes, including <code>4xx</code> and <code>5xx</code>.

= Directives =

== more_set_headers ==
'''syntax:''' ''more_set_headers [-t <content-type list>]... [-s <status-code list>]... <new-header>...''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

Replaces (if any) or adds (if not any) the specified output headers when the response status code matches the codes specified by the <code>-s</code> option ''AND'' the response content type matches the types specified by the <code>-t</code> option.

If either <code>-s</code> or <code>-t</code> is not specified or has an empty list value, then no match is required. Therefore, the following directive set the <code>Server</code> output header to the custom value for ''any'' status code and ''any'' content type:

<geshi lang="nginx">
  more_set_headers    "Server: my_server";
</geshi>

Existing response headers with the same name are always overridden. If you want to add headers incrementally, use the standard [[HttpHeadersModule#add_header|add_header]] directive instead.

A single directive can set/add multiple output headers. For example

<geshi lang="nginx">
  more_set_headers 'Foo: bar' 'Baz: bah';
</geshi>

Multiple occurrences of the options are allowed in a single directive. Their values will be merged together. For instance

<geshi lang="nginx">
  more_set_headers -s 404 -s '500 503' 'Foo: bar';
</geshi>

is equivalent to

<geshi lang="nginx">
  more_set_headers -s '404 500 503' 'Foo: bar';
</geshi>

The new header should be the one of the forms:

# <code>Name: Value</code>
# <code>Name: </code>
# <code>Name</code>

The last two effectively clear the value of the header <code>Name</code>.

Nginx variables are allowed in header values. For example:

<geshi lang="nginx">
   set $my_var "dog";
   more_set_headers "Server: $my_var";
</geshi>

But variables won't work in header keys due to performance considerations.

Multiple set/clear header directives are allowed in a single location, and they're executed sequentially.

Directives inherited from an upper level scope (say, http block or server blocks) are executed before the directives in the location block.

Note that although <code>more_set_headers</code> is allowed in ''location'' if blocks, it is ''not'' allowed in the ''server'' if blocks, as in

<geshi lang="nginx">
      ?  # This is NOT allowed!
      ?  server {
      ?      if ($args ~ 'download') {
      ?          more_set_headers 'Foo: Bar';
      ?      }
      ?      ...
      ?  }
</geshi>

Behind the scene, use of this directive and its friend [[#more_clear_headers|more_clear_headers]] will (lazily) register an ouput header filter that modifies <code>r->headers_out</code> the way you specify.

== more_clear_headers ==
'''syntax:''' ''more_clear_headers [-t <content-type list>]... [-s <status-code list>]... <new-header>...''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''output-header-filter''

Clears the specified output headers.

In fact,

<geshi lang="nginx">
   more_clear_headers -s 404 -t 'text/plain' Foo Baz;
</geshi>

is exactly equivalent to

<geshi lang="nginx">
   more_set_headers -s 404 -t 'text/plain' "Foo: " "Baz: ";
</geshi>

or

<geshi lang="nginx">
   more_set_headers -s 404 -t 'text/plain' Foo Baz
</geshi>

See [[#more_set_headers|more_set_headers]] for more details.

Wildcard <code>*</code> can also be used to specify a header name pattern. For example, the following directive effectively clears ''any'' output headers starting by "<code>X-Hidden-</code>":

<geshi lang="nginx">
    more_clear_headers 'X-Hidden-*';
</geshi>

The <code>*</code> wildcard support was first introduced in [[#v0.09|v0.09]].

== more_set_input_headers ==
'''syntax:''' ''more_set_input_headers [-r] [-t <content-type list>]... <new-header>...''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''rewrite tail''

Very much like [[#more_set_headers|more_set_headers]] except that it operates on input headers (or request headers) and it only supports the <code>-t</code> option.

Note that using the <code>-t</code> option in this directive means filtering by the <code>Content-Type</code> ''request'' header, rather than the response header.

Behind the scene, use of this directive and its friend [[#more_clear_input_headers|more_clear_input_headers]] will (lazily) register a <code>rewrite phase</code> handler that modifies <code>r->headers_in</code> the way you specify. Note that it always run at the ''end'' of the <code>rewrite</code> so that it runs ''after'' the standard [[HttpRewriteModule|rewrite module]] and works in subrequests as well.

If the <code>-r</code> option is specified, then the headers will be replaced to the new values ''only if'' they already exist.

== more_clear_input_headers ==
'''syntax:''' ''more_clear_input_headers [-t <content-type list>]... <new-header>...''

'''default:''' ''no''

'''context:''' ''http, server, location, location if''

'''phase:''' ''rewrite tail''

Clears the specified input headers.

In fact,

<geshi lang="nginx">
   more_clear_input_headers -s 404 -t 'text/plain' Foo Baz;
</geshi>

is exactly equivalent to

<geshi lang="nginx">
   more_set_input_headers -s 404 -t 'text/plain' "Foo: " "Baz: ";
</geshi>

or

<geshi lang="nginx">
   more_set_input_headers -s 404 -t 'text/plain' Foo Baz
</geshi>

See [[#more_set_input_headers|more_set_input_headers]] for more details.

= Limitations =

* Unlike the standard [[HttpHeadersModule|headers]] module, this module does not automatically take care of the constraint among the <code>Expires</code>, <code>Cache-Control</code>, and <code>Last-Modified</code> headers. You have to get them right yourself or use the [[HttpHeadersModule|headers]] module together with this module.
* You cannot remove the <code>Connection</code> response header using this module because the <code>Connection</code> response header is generated by the standard <code>ngx_http_header_filter_module</code> in the Nginx core, whose output header filter runs always ''after'' the filter of this module. The only way to actually remove the <code>Connection</code> header is to patch the Nginx core, that is, editing the C function <code>ngx_http_header_filter</code> in the <code>src/http/ngx_http_header_filter_module.c</code> file.

= Installation =

Grab the nginx source code from [http://nginx.org/ nginx.org], for example,
the version 1.7.7 (see [[#Compatibility|nginx compatibility]]), and then build the source with this module:

<geshi lang="bash">
    wget 'http://nginx.org/download/nginx-1.7.7.tar.gz'
    tar -xzvf nginx-1.7.7.tar.gz
    cd nginx-1.7.7/
    
    # Here we assume you would install you nginx under /opt/nginx/.
    ./configure --prefix=/opt/nginx \
        --add-module=/path/to/headers-more-nginx-module
     
    make
    make install
</geshi>

Download the latest version of the release tarball of this module from [http://github.com/agentzh/headers-more-nginx-module/tags headers-more-nginx-module file list].

Also, this module is included and enabled by default in the [http://openresty.org ngx_openresty bundle].

= Compatibility =

The following versions of Nginx should work with this module:

* '''1.7.x'''                       (last tested: 1.7.7)
* '''1.6.x'''                       (last tested: 1.6.2)
* '''1.5.x'''                       (last tested: 1.5.8)
* '''1.4.x'''                       (last tested: 1.4.4)
* '''1.3.x'''                       (last tested: 1.3.7)
* '''1.2.x'''                       (last tested: 1.2.9)
* '''1.1.x'''                       (last tested: 1.1.5)
* '''1.0.x'''                       (last tested: 1.0.11)
* '''0.9.x'''                       (last tested: 0.9.4)
* '''0.8.x'''                       (last tested: 0.8.54)
* '''0.7.x >= 0.7.44'''             (last tested: 0.7.68)

Earlier versions of Nginx like 0.6.x and 0.5.x will ''not'' work.

If you find that any particular version of Nginx above 0.7.44 does not work with this module, please consider [[#Report Bugs|reporting a bug]].

= Community =

== English Mailing List ==

The [https://groups.google.com/group/openresty-en openresty-en] mailing list is for English speakers.

== Chinese Mailing List ==

The [https://groups.google.com/group/openresty openresty] mailing list is for Chinese speakers.

= Bugs and Patches =

Please submit bug reports, wishlists, or patches by

# creating a ticket on the [http://github.com/chaoslawful/lua-nginx-module/issues GitHub Issue Tracker],
# or posting to the [[#Community|OpenResty community]].

= Source Repository =

Available on github at [http://github.com/agentzh/headers-more-nginx-module agentzh/headers-more-nginx-module].

= Changes =

The changes of every release of this module can be obtained from the ngx_openresty bundle's change logs:

http://openresty.org/#Changes

= Test Suite =

This module comes with a Perl-driven test suite. The [http://github.com/agentzh/headers-more-nginx-module/tree/master/t/ test cases] are
[http://github.com/agentzh/headers-more-nginx-module/blob/master/t/sanity.t declarative] too. Thanks to the [http://search.cpan.org/perldoc?Test::Nginx Test::Nginx] module in the Perl world.

To run it on your side:

<geshi lang="bash">
    $ PATH=/path/to/your/nginx-with-headers-more-module:$PATH prove -r t
</geshi>

To run the test suite with valgrind's memcheck, use the following commands:

<geshi lang="bash">
    $ export PATH=/path/to/your/nginx-with-headers-more-module:$PATH
    $ TEST_NGINX_USE_VALGRIND=1 prove -r t
</geshi>

You need to terminate any Nginx processes before running the test suite if you have changed the Nginx server binary.

Because a single nginx server (by default, <code>localhost:1984</code>) is used across all the test scripts (<code>.t</code> files), it's meaningless to run the test suite in parallel by specifying <code>-jN</code> when invoking the <code>prove</code> utility.

Some parts of the test suite requires modules [[HttpProxyModule|proxy]], [[HttpRewriteModule|rewrite]], and [[HttpEchoModule|echo]] to be enabled as well when building Nginx.

= TODO =

* Support variables in new headers' keys.

= Getting involved =

You'll be very welcomed to submit patches to the [[#Author|author]] or just ask for a commit bit to the [[#Source Repository|source repository]] on GitHub.

= Authors =

* Yichun "agentzh" Zhang (章亦春) ''<agentzh@gmail.com>'', CloudFlare Inc.
* Bernd Dorn ( http://www.lovelysystems.com/ )

This wiki page is also maintained by the author himself, and everybody is encouraged to improve this page as well.

= Copyright & License =

The code base is borrowed directly from the standard [[HttpHeadersModule|headers]] module in Nginx 0.8.24. This part of code is copyrighted by Igor Sysoev.

Copyright (c) 2009-2014, Yichun "agentzh" Zhang (章亦春) <agentzh@gmail.com>, CloudFlare Inc.

Copyright (c) 2010-2013, Bernd Dorn.

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

* The original thread on the Nginx mailing list that inspires this module's development: [http://forum.nginx.org/read.php?2,11206,11738 "A question about add_header replication"].
* The orginal announcement thread on the Nginx mailing list: [http://forum.nginx.org/read.php?2,23460 "The "headers_more" module: Set and clear output headers...more than 'add'!"].
* The original [http://agentzh.blogspot.com/2009/11/headers-more-module-scripting-input-and.html blog post] about this module's initial development.
* The [[HttpEchoModule|echo module]] for Nginx module's automated testing.
* The standard [[HttpHeadersModule|headers]] module.
