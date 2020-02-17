
.. meta::
   :description: The Concat module enables the concatenation of files in a given context.

Concat
======

Synopsis
--------
This is a module that is distributed with `Tengine <http://tengine.taobao.org>`_ which is a distribution of NGINX that is used by the e-commerce/auction site `Taobao.com <https://en.wikipedia.org/wiki/Taobao>`_. 
This distribution contains some modules that are new on the NGINX scene. 
The *ngx_http_concat* module is one of them.

The module is inspired by Apache's `modconcat <https://code.google.com/archive/p/modconcat>`_. 
It follows the same pattern for enabling the concatenation. It uses two *?*, like this::

    http://example.com/??style1.css,style2.css,foo/style3.css

If a **third** *?* is present it's treated as **version string**. Like this::

    http://example.com/??style1.css,style2.css,foo/style3.css?v=102234

Configuration example:

.. code-block:: nginx

   location /static/css/ {
       concat on;
       concat_max_files 20;
   }

   location /static/js/ {
       concat on;
       concat_max_files 30;
   }
   
    
The original description was written by |perusio|_

.. |perusio| replace:: Ant |oacute| nio P. P. Almeida

.. _perusio: https://github.com/perusio/

.. |oacute| unicode:: 0xf3
    :trim:
    
    
    
Directives
----------

concat
^^^^^^
:Syntax: *concat [on|off]*
:Default: *off*
:Context: *http, server, location*

It enables the concatenation in a given context.


concat_types
^^^^^^^^^^^^
:Syntax: *concat_types MIME types*
:Default: *text/css application/x-javascript*
:Context: *http, server, location*

Defines the `MIME types <https://en.wikipedia.org/wiki/MIME_type>`_ which
can be concatenated in a given context.


concat_unique
^^^^^^^^^^^^^
:Syntax: *concat_unique [on|off]*
:Default: *on*
:Context: *http, server, location*

Defines if only files of a given MIME type can concatenated or if
several MIME types can be concatenated. For example if set to ``off``
then in a given context you can concatenate Javascript and CSS files.

Note that the default value is ``on``, meaning that only files with same
MIME type are concatenated in a given context. So if you have CSS and
JS you cannot do something like this::

  http://example.com/static/??foo.css,bar/foobaz.js

In order to do that you **must** set ``concat_unique off``. This applies
to any other type of files that you decide to concatenate by adding
the respective MIME type via ``concat_types``,


concat_max_files
^^^^^^^^^^^^^^^^
:Syntax: *concat_max_files number*
:Default: *10*
:Context: *http, server, location*

Defines the **maximum** number of files that can be concatenated in a
given context. Note that a given URI cannot be bigger than the page
size of your platform. On Linux you can get the page size issuing::

  getconf PAGESIZE

Usually is 4k. So if you try to concatenate a lot of files together in
a given context you might hit this barrier. To overcome that OS
defined limitation you must use
the `large_client_header_buffers <https://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers>`_
directive. Set it to the value you need.


concat_delimiter
^^^^^^^^^^^^^^^^
:Syntax: *concat_delimiter string*
:Default: *none*
:Context: *http, server, locatione*

Defines the **delimiter** between two files.
If the config is ``concat_delimiter "\n"``,a ``"\n"`` would be inserted betwen 1.js and 2.js when visting ``http://example.com/??1.js,2.js``


concat_ignore_file_error
^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *concat_ignore_file_error [on|off]*
:Default: *off*
:Context: *http, server, location*

Whether to ignore 404 and 403 or not.



Installation
------------
* Clone the git repo.

  .. code-block:: bash

    git clone git://github.com/taobao/nginx-http-concat.git

* Add the module to the build configuration by adding:

  .. code-block:: bash

    --add-module=/path/to/nginx-http-concat

* Build the NGINX binary.
* Install the NGINX binary.
* Configure contexts where concat is enabled.
* Build your links such that the above format, i.e., all URIs that have files that are to be concatenated have a *??* prefix. The HTML produced would have something like this inside the *<head>* element for concatenating CSS files.

  .. code-block:: html

    <link rel="stylesheet" href="??foo1.css,foo2.css,subdir/foo3.css?v=2345" />

  Similarly for JavaScript files you should have:
  
  .. code-block:: html

    <script src="??bar1.js,bar22.css,subdir/bar3.js?v=3245" />

* Now if you open up the network tab on firebug or on safari/chrome/chromium browser inspector you should see a single bar where before here were many. Congratulations you're now using file concatenation at the server level. No longer messing around with scripts for aggregating files. Note although that there's no `minification <https://en.wikipedia.org/wiki/Minification_(programming)>`_ of files. So you might want to minify the files before concatenating them.
* Done.



Tagging releases
----------------
I'm tagging each release in synch with the
`Tengine <http://tengine.taobao.org>`_ releases.



Other tengine modules on Github
-------------------------------
*  :github:`footer filter <taobao/nginx-http-footer-filter>`
    allows to add some extra data (markup or not) at the end of a request body. It's pratical for things like adding time stamps or other miscellaneous stuff without having to tweak your application.
*  :github:`http slice <taobao/nginx-http-slice>`
    allows to serve a file by slices. A sort of reverse byte-range. Useful for serving large files while not hogging the network.



Other builds
------------
1. As referred at the outset this module is part of the `Tengine <http://tengine.taobao.org>`_ NGINX distribution. So you might want to save yourself some work and just build it from scratch using *Tengine* in lieu if the official NGINX source.
2. If you fancy a bleeding edge NGINX package (from the dev releases) for Debian made to measure then you might be interested in my `debian <http://debian.perusio.net/unstable>`_ NGINX package. Instructions for using the repository and making the package live happily inside a stable distribution installation are `provided <http://debian.perusio.net>`_.



Acknowledgments
---------------
Thanks to Joshua Zhu and the Taobao platform engineering team for releasing *Tengine*. Also for being kind
enough to clarify things regarding this module on the `NGINX mailing list <http://mailman.nginx.org/pipermail/nginx/2011-December/030830.html>`_.



License
-------
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
