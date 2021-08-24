NGINX-TRANSCODE-MODULE
======================

NGINX module for media transcoding

Description
-----------

This project is used as NGINX third-party module.

Accept HTTP requests, find the files according to the configuration,
transcode it and return it in the required format.

Install
-------

1. Clone project

``git clone https://github.com/HiSunzhenliang/nginx-transcode-module.git``

1. Requirements

   -  NGINX

   -  libsox

2. Compile NGINX with NGINX-TRANSCODE-MODULE

``./configure --add-dynamic-module=/.../nginx-transcode-module``

``make && make install``

Usage
-----

In NGINX config file:

.. code:: 

   location ~ / {
       nginx-transcode-module;
       transcode_root "/path/audios";
       transcode_output_format "mp3";
   }

.. code:: 

   $ ls /path/audios
   a.wav b.wav c.wav ...

Send request ``http://127.0.0.1:8000/a.mp3``

Get ``a.mp3`` transcoded from ``a.wav``.

.. _copyright--license:

Copyright & License
-------------------

.. code:: 

   MIT License

   Copyright (c) 2021 sunzhenliang

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
