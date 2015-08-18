
.. meta::
   :description: The Form Input module parses HTTP POST and PUT request bodies and saves the results to NGINX variables.

Form Input
==========


Description
-----------

**form-input-nginx-module** - an nginx module that reads HTTP POST and PUT request body encoded in
``application/x-www-form-urlencoded``, and parses the arguments in request body
into nginx variables.

This module depends on the ngx_devel_kit (NDK) module.



Installation
------------

#. Get the nginx source code from `nginx.org <http://nginx.org/>`_.
#. Get the ngx_devel_kit source code from :github:`GitHub simpl-it/ngx_devel_kit repository <simpl-it/ngx_devel_kit>`
#. Unpack the source code and build nginx with this module.

.. code-block:: bash

  $ wget 'http://sysoev.ru/nginx/nginx-0.8.28.tar.gz'
  $ tar -xzvf nginx-0.8.28.tar.gz
  $ cd nginx-0.8.28/

  $ git-clone http://github.com/simpl-it/ngx_devel_kit.git
  $ git-clone http://github.com/calio/form-input-nginx-module.git

  $ ./configure --add-module=/somepath/form-input-nginx-module --add-module=/somepath/ngx_devel_kit
  $ make -j2
  $ make install



Usage
-----

.. code-block:: bash

  set_form_input $variable;
  set_form_input $variable argument;

  set_form_input_multi $variable;
  set_form_input_multi $variable argument;

Example:

.. code-block:: nginx

  #nginx.conf

  location /foo {
    set_form_input $data;     # read "data" field into $data
    set_form_input $foo foo;  # read "foo" field into $foo
  }
  location /bar {
    set_form_input_multi $data;      # read all "data" field into $data
    set_form_input_multi $foo data;  # read all "data" field into $foo
    array_join ' ' $data;            # now $data is a string
    array_join ' ' $foo;             # now $foo is a string
  }



Compatibility
-------------

The following versions of Nginx should work with this module:

* **0.8.x <= 0.8.41**                       (last tested version is 0.8.43)
* **0.7.x**                                 (last tested version is 0.7.67)



Copyright & License
-------------------

Copyright (c) 2010, Taobao Inc., Alibaba Group ( http://www.taobao.com/market/global/index_new.php ).

Copyright (c) 2010, calio <vipcalio@gmail.com>.

This module is licensed under the terms of the BSD license.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of the Taobao Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

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

Changes with form-input-module v0.0.2

  * Supports ``set_form_input_multi``
  * Supports ``PUT`` method

Changes with form-input-module v0.0.1

  * Supports ``set_form_input``
