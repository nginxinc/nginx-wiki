MP4 Streaming Lite
==================

= mod_mp4_streaming_lite =

''Note: this module is not distributed with the Nginx source. Installation instructions are [#installation below] .''

mod_mp4_streaming_lite will seek to a certain time within H.264/MP4 files when provided with a "start" parameter in the URL.

All users installed this module before Nov 20, 2008 are encouraged to upgrade to the latest source package.

This module is written by Jiang Hong. You can contact him for a full (but commercial) version which supports a wider variety of MP4 files.

The most recent package can be downloaded at:

http://i.6.cn/nginx_mp4_streaming_public_20081229.tar.bz2

== Revision History ==

*  2008-11-01
: - start=0 (or 0.0) was allowed in order to send the re-indexed whole file.<BR> 
: - a directio-related neglect was fixed.<BR> 
: - mp4_directio directive was removed and the module now follows the server-wide directio setting.<BR> 
: - Content-Length calculation bug was fixed. Thanks go to Nick Melnikov.<BR> 

*  2008-11-13
: - directio-related bug fixed.<BR> 
: - The access denials and pread() errors, which caused by an uninitialized variable, are fixed.<BR> 

*  2008-11-20
: - Another Content-Length bug fixed.

*  2008-12-05
: - An 'off-by-one' bug fixed.

*  2008-12-28
: - more return value checks (reported by Jan Ślusarczyk).


== Directives ==

* [#mp4 mp4] 

{{Anchor|mp4}}
== mp4 ==

'''syntax''': ''mp4''

'''default''': ''n/a''

'''context''': ''location''

Enable MP4 streaming at a particular location.

{{Anchor|installation}}
== Installation ==

Download the tarball as described above and 'tar jx' it.

After extracting, add the following option to your Nginx ./configure command:

<pre>
: --add-module=path/to/mp4_streaming_lite/directory
</pre>

By default, nginx uses -O to compile the source code. You should use

<pre>
: --with-cc-opt='-O3'
</pre>

with configure to retrieve maximum performance.

== More ==
More widely MP4 files supported can be found here:
http://h264.code-shop.com/trac/wiki/Mod-H264-Streaming-Nginx-Version2

And you may ask '''arjen''' for help if you have some questions
