Slice
=====


= Synopsis  =

This is a module that is distributed with [http://tengine.taobao.org Tengine] which is a distribution of Nginx that is used by the e-commerce/auction site [http://en.wikipedia.org/wiki/Taobao Taobao.com]. This distribution contains some modules that are new on the Nginx scene. The ''ngx_http_slice_module'' module is one of them.

This module can be thought out as a '''reverse byte-range''' request header. It's main utility is to allow Nginx to slice a big file in small pieces (byte-ranges) while permitting to use on-the-fly gzip compression.

A typical example is for allowing someone to download a large video file while keeping the bandwith usage minimal. This might also be used
as device for selling a video file by pieces where each link points to different zones of the file splitted by file ranges.

Other use would be to use a generic CSS file and use only part of it for each section of a site. Granted that byte-range slicing isn't the
most intuitive for such.

Note also that using arguments is more '''useful''' than byte-ranges in the sense that they can be set in a normal link, while byte ranges
require a special [https://en.wikipedia.org/wiki/Byte_serving HTTP header].

Configuration example:

<geshi lang="nginx">
location ^~ /video-dump/ {
    slice; # enable slicing
    slice_start_arg s;
    slice_end_arg e;    
}
</geshi>

So we would request the first 1k of the file like this:
    http://example.com/video-dump/large_vid.mp4?s=0&e=1024

Notice ''s=0'', start at ''0'' and ''e=1024'', stop at ''1024'' bytes (1k).

This documentation was originally written by [https://github.com/perusio António P. P. Almeida]

= Directives =

'''slice'''

'''context:''' ''location''

It enables the content slicing in a given location.


'''slice_arg_begin''' ''string''

'''default:''' ''begin''

'''context:''' ''http, server, location''

Defines the argument that defines the request range of bytes '''start'''.


'''slice_arg_end''' ''string''

'''default:''' ''end''

'''context:''' ''http, server, location''

Defines the argument that defines the request range of bytes '''end'''.


'''slice_header''' ''string''

'''context:''' ''http, server, location''

Defines the string to be used as the '''header''' of each slice being served by Nginx.


'''slice_footer''' ''string''

'''context:''' ''http, server, location''

Defines the string to be used as the '''footer''' of each slice being served by Nginx.


'''slice_header_first''' ''on'' | ''off''

'''default:''' ''on''

'''context:''' ''http, server, location''

If set to ''off'' and when requesting the '''first''' byte of the file do '''not serve''' the header.

This directive is particularly useful to differentiate the '''first''' slice from the remaining slices. The first slice is the one which has '''no''' header.


'''slice_footer_last''' ''on'' |  ''off ''

'''default:''' ''on''

'''context:''' ''http, server, location''

If set to ''off'' and when requesting the '''last''' byte of the file do '''not serve''' the header.

This directive is particularly useful to differentiate the '''last''' slice from the remaining slices. The last slice is the one which has
'''no''' footer.

= Examples =

Here're some examples that explore all the options.

'''Serve a huge DB file while sending headers except on the first slice'''
<geshi lang="nginx">
location ^~ /dbdumps/ {
    slice; # enable slicing
    slice_start_arg first;
    slice_end_arg last;
    slice_header '-- '''db-slice-start'''';
    slice_header_first off;
}
</geshi>

Then a request like this:
    http://example.com/dbdumps/somedb.sql?first=0&last=1048576
Send the first 1M and skip the ''-- '''db-slice-start''''' header.


'''Serve a huge DB file while sending headers except on the first slice'''
<geshi lang="nginx">
location ^~ /dbdumps/ {
    slice; # enable slicing
    slice_start_arg first;
    slice_end_arg last;
    slice_header '-- '''db-slice-start'''';
    slice_header_first off;
    slice_footer '-- '''db-slice-end'''';
}
</geshi>
This differs from the previous in the sense that it sends a footer.

'''Serve a huge DB file while sending headers except on the first slice and send footer except on the last slice'''
<geshi lang="nginx">
location ^~ /dbdumps/ {
    slice; # enable slicing
    slice_start_arg first;
    slice_end_arg last;
    slice_header '-- '''db-slice-start'''';
    slice_header_first off;
    slice_footer '-- '''db-slice-end'''';
    slice_footer_last off; 
}
</geshi>
Then a request like this:
    http://example.com/dbdumps/somedb.sql?first=0&last=1048576
Send the first 1M and skip the ''-- '''db-slice-start''''' header.

If the file is 200MB, we get the last slice with:
    http://example.com/dbdumps/somedb.sql?first=208666624&last=209715200

this last slice has no footer.

= Installation =

* Clone the git repo.
    git clone git://github.com/taobao/nginx-http-slice.git

* Add the module to the build configuration by adding
    ''--add-module=/path/to/nginx-http-slice''.
* Build the nginx binary.
 
* Install the nginx binary.
 
* Configure contexts where concat is enabled.
 
* Build your links such that the above format, i.e., all URIs that correspond to specific ranges. As example here's how to link to the first 4k of a file.
    <a href="http://example.com/datadumps/dump0.sql?start=0&end=4096" />db dump</a>

* Done.

= Tagging releases  =

I'm tagging each release in synch with the [http://tengine.taobao.org Tengine] releases.

= Other tengine modules on Github =

* [https://github.com/taobao/nginx-http-concat http concat]:
Allows to concatenate a given set of files and ship a single response from the server. It's particularly useful for '''aggregating''' CSS and Javascript files.

* [https://github.com/taobao/nginx-http-footer-filter footer filter]:
Allows to add some extra data (markup or not) at the end of a request body. It's pratical for things like adding time stamps or other miscellaneous stuff without having to tweak your application.

= Other builds =

* As referred at the outset this module is part of the [http://tengine.taobao.org ''Tengine''] Nginx distribution. So you might want to save yourself some work and just build it from scratch using ''tengine'' in lieu if the official Nginx source.

* If you fancy a bleeding edge Nginx package (from the dev releases) for Debian made to measure then you might be interested in my [http://debian.perusio.net/unstable debian] Nginx package. Instructions for using the repository and making the package live happily inside a stable distribution installation are [http://debian.perusio.net provided].

= Acknowledgments =

Thanks to [http://blog.zhuzhaoyuan.com Joshua Zhu] and the Taobao platform engineering team for releasing ''tengine''. Also for being kind
enough to clarify things regarding this module on the [http://code.taobao.org/mailman/listinfo/tengine Tengine mailing list].

= License =

Copyright (C) 2010-2012 Alibaba Group Holding Limited

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
    
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY AUTHOR AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL AUTHOR OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN
IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
