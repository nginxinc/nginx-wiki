Iconv
=====

Description
-----------

**iconv-nginx-module** - an nginx module that uses libiconv to convert characters of different
encoding. It brings the ``set_iconv`` command to nginx.

This module depends on the ngx_devel_kit (NDK) module.

Installation
------------

#. Get the nginx source code from nginx.net (`<http://nginx.net/>`_).
#. Untar the source code and build nginx with this module.

.. code-block:: bash

  $ wget 'http://sysoev.ru/nginx/nginx-0.8.28.tar.gz'
  $ tar -xzvf nginx-0.8.28.tar.gz
  $ cd nginx-0.8.28/

  $ git-clone http://github.com/simpl-it/ngx_devel_kit.git
  $ git-clone http://github.com/calio/form-input-module.git

  $ ./configure --add-module=/somepath/iconv-nginx-module/ --add-module=/somepath/ngx_devel_kit
  $ make -j2
  $ make install

Usage
-----

- ``set_iconv <``\ *destination_variable*\ ``> <``\ *from_variable*\ ``> from=<``\ *from_encoding*\ ``> to=<``\ *to_encoding*\ ``>;``
- ``iconv_buffer_size <``\ *size*\ ``>;   #default iconv_buffer_size is ngx_pagesize``
- ``iconv_filter from=<``\ *from_encoding*\ ``> to=<``\ *to_encoding*\ ``>;``

Here is a basic example:

.. code-block:: nginx

  #nginx.conf

  location /foo {
      set $src '你好'; #in UTF-8
      set_iconv $dst $src from=utf8 to=gbk; #now $dst holds 你好 in GBK
  }
  #everything generated from /foo will be converted from utf8 to gbk
  location /bar {
      iconv_filter from=utf-8 to=gbk;
      iconv_buffer_size 1k;
      #content handler here
  }

Copyright & License
-------------------

This program is licenced under the BSD license.

Copyright (c) 2010, Taobao Inc, Alibaba Group ( http://www.taobao.com/).
Copyright (c) 2010, Calio <vipcalio@gmail.com>.

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
* Neither the name of the Taobao Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

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

Changelog
---------

- **v0.02**   *added iconv_filter and iconv_buffer_size instruction*
- **v0.01**   *implemented set_iconv instruction*
