Foot Filter
===========

Synopsis
--------

This is a module that is distributed with `Tengine <http://tengine.taobao.org>`_ which is a distribution of Nginx that is used by the e-commerce/auction site Taobao.com.
This distribution contains some modules that are new on the Nginx scene.
The **ngx_http_footer_filter_module** is one of them.

This module implements a body filter that adds a given string
to the page footer.

You might say that it provides a particular case of the http
sub module in the sense that it adds something to the footer.
You can do the same using the http sub module but using the
footer filter should be faster since there's no string matching
done on the request body.

Directives
----------

footer
^^^^^^

:Syntax: ``footer`` *string*
:Default: ``''``
:Context: *http, server, location*

It defines the string to be printed at the footer of the request body. This string can have variables embedded.

footer_types
^^^^^^^^^^^^

:Syntax: ``footer_types`` *MIME types*
:Default: ``text/html``
:Context: *http, server, location*

Defines the `MIME types <https://en.wikipedia.org/wiki/MIME_type>`_ of the files where the footer will be included.

Installation
------------

#. Clone the git repo.

  .. code-block:: bash

    git clone  git://github.com/taobao/nginx-http-footer-filter.git
    
#. Add the module to the build configuration by adding:

  .. code-block:: bash

    --add-module=/path/to/nginx-http-footer-filter
  
#. Build the nginx binary.
#. Install the nginx binary.
#. Configure contexts where footer filter is enabled.
#. Done.

Tagging releases
----------------

I'm tagging each release in synch with the `Tengine <http://tengine.taobao.org>`_ releases.

Other tengine modules on Github
-------------------------------

* :github:`backtrace_module <taobao/nginx-backtrace>`
    Can be used to dump backtrace of nginx in case a worker process exits abnormally,
    e.g. when some signal is received (SIGABR, SIGBUS, SIGFPE, SIGILL, SIGIOT, SIGSEGV).
    It's quite handy for debugging purpose.

* :github:`http slice <taobao/nginx-http-slice>`
    Allows to serve a file by slices. A sort of reverse byte-range. Useful for serving large files while not hogging the network.

Other builds
------------

1. As referred at the outset this module is part of the `Tengine <http://tengine.taobao.org>`_ Nginx distribution. So you might want to save yourself some work and just build it from scratch using *Tengine* in lieu if the official Nginx source.

2. If you fancy a bleeding edge Nginx package (from the dev releases) for Debian made to measure then you might be interested in my `debian <http://debian.perusio.net/unstable>`_ Nginx package. Instructions for using the repository and making the package live happily inside a stable distribution installation are `provided <http://debian.perusio.net>`_.

Acknowledgments
---------------

Thanks to `Joshua Zhu <http://blog.zhuzhaoyuan.com>`_ and the Taobao platform engineering team for releasing *Tengine*. Also for being kind
enough to clarify things regarding this module on the `Nginx mailing list <http://mailman.nginx.org/pipermail/nginx/2011-December/030830.html>`_.

License
-------

Copyright (C) 2010-2012 Alibaba Group Holding Limited

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of con#.ditions and the following disclaimer.
    
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
Foot Filter
===========

Synopsis
--------

This is a module that is distributed with
`Tengine <http://tengine.taobao.org>`_ which is a distribution
of Nginx that is used by the e-commerce/auction site Taobao.com.
This distribution contains some modules that are new on the Nginx
scene.The ngx_http_footer_filter_module is one of them.

This module implements a body filter that adds a given string
to the page footer.

You might say that it provides a particular case of the http
sub module in the sense that it adds something to the footer.
You can do the same using the http sub module but using the
footer filter should be faster since there's no string matching
done on the request body.

Directives
----------

footer
^^^^^^

:Syntax: ``footer`` *string*
:Default: ``""``
:Context: *http, server, location*

It defines the string to be printed at the footer of the request body. This string can have variables embedded.

footer_types
^^^^^^^^^^^^

:Syntax: ``footer_types`` *MIME types*
:Default: ``text/html``
:Context: *http, server, location*

Defines the `MIME types <https://en.wikipedia.org/wiki/MIME_type>`_ of the files where the footer will be included.

Installation
------------

#. Clone the git repo.

  .. code-block:: bash

    git clone  git://github.com/taobao/nginx-http-footer-filter.git
    
#. Add the module to the build configuration by adding:

  .. code-block:: bash

    --add-module=/path/to/nginx-http-footer-filter
  
#. Build the nginx binary.
#. Install the nginx binary.
#. Configure contexts where footer filter is enabled.
#. Done.

Tagging releases
----------------

I'm tagging each release in synch with the `Tengine <http://tengine.taobao.org>`_ releases.

Other tengine modules on Github
-------------------------------

* :github:`backtrace_module <taobao/nginx-backtrace>`
    Can be used to dump backtrace of nginx in case a worker process exits abnormally,
    e.g. when some signal is received (SIGABR, SIGBUS, SIGFPE, SIGILL, SIGIOT, SIGSEGV).
    It's quite handy for debugging purpose.

* :github:`http slice <taobao/nginx-http-slice>`
    Allows to serve a file by slices. A sort of reverse byte-range. Useful for serving large files while not hogging the network.

Other builds
------------

1. As referred at the outset this module is part of the `Tengine <http://tengine.taobao.org>`_ Nginx distribution. So you might want to save yourself some work and just build it from scratch using *Tengine* in lieu if the official Nginx source.

2. If you fancy a bleeding edge Nginx package (from the dev releases) for Debian made to measure then you might be interested in my `debian <http://debian.perusio.net/unstable>`_ Nginx package. Instructions for using the repository and making the package live happily inside a stable distribution installation are `provided <http://debian.perusio.net>`_.

Acknowledgments
---------------

Thanks to `Joshua Zhu <http://blog.zhuzhaoyuan.com>`_ and the Taobao platform engineering team for releasing *Tengine*. Also for being kind
enough to clarify things regarding this module on the `Nginx mailing list <http://mailman.nginx.org/pipermail/nginx/2011-December/030830.html>`_.

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
