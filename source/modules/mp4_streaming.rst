
.. meta::
   :description: The MP4 Streaming Lite module seeks a certain time within H.264/MP4 files when a "start" parameter is provided in the URL.

MP4 Streaming Lite
==================

Description
-----------
**mod_mp4_streaming_lite** - seeks a certain time within H.264/MP4 files when provided when a "start" parameter is provided in the URL.

This module is written by Jiang Hong. You can contact him for a full (but commercial) version which supports a wider variety of MP4 files.

The most recent package can be downloaded here:

`<http://i.6.cn/nginx_mp4_streaming_public_20081229.tar.bz2>`_.

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <mp4_streaming.installation_>`_.



Revision History
----------------
* **12/28/2008**
    - more return value checks (reported by Jan Ślusarczyk).

* **12/05/2008**
    - An 'off-by-one' bug fixed.

* **11/20/2008**
    - Another ``Content-Length`` bug fixed.

* **11/13/2008**
    - directio-related bug fixed.
    - The access denials and pread() errors, which caused by an uninitialized variable, are fixed.

* **11/01/2008**
    - start=0 (or 0.0) was allowed in order to send the re-indexed whole file.
    - a directio-related neglect was fixed.
    - ``mp4_directio`` directive was removed and the module now follows the server-wide directio setting.
    - ``Content-Length`` calculation bug was fixed. Thanks go to Nick Melnikov.



Directives
----------

mp4
^^^

:Syntax: *mp4*
:Default: *none*
:Context: *location*

Enable MP4 streaming at a particular location.



.. _mp4_streaming.installation:

Installation
------------

Download the tarball as described above and ``tar jx`` it.

After extracting, add the following option to your Nginx ``./configure`` command:

.. code-block:: bash

  --add-module=path/to/mp4_streaming_lite/directory


By default, nginx uses ``-O`` to compile the source code. You should use:

.. code-block:: bash

  --with-cc-opt='-O3'


with ``./configure`` to retrieve maximum performance.



More
----

More widely MP4 files supported can be found here:

`<http://h264.code-shop.com/trac/wiki/Mod-H264-Streaming-Nginx-Version2>`_.

And you may ask *arjen* for help if you have some questions
