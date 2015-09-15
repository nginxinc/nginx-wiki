
.. meta::
   :description: The Zip module assembles ZIP archives on the fly. In simple configurations, it takes a list of local files and serves them as a single ZIP archive.
   
Zip
===

Description
-----------

**mod_zip** - an HTTP module for NGINX that assembles ZIP archives dynamically. In simple configurations, mod_zip will take a list of files on the local file system and serve them as a single ZIP archive. In more complex setups, mod_zip can stream component files from upstream servers with NGINX's native proxying code. Unlike many ZIP creation scripts, the process never takes up more than a few KB of RAM at time, even while assembling archives that are (potentially) hundreds of megabytes.

Installation
------------

To install, download the source tarball, expand it, and then compile NGINX with the following option:

.. code-block:: bash

  --add-module=/path/to/mod_zip-1.x

NGINX 0.7.25 or greater is required.

Usage
-----

The module has no configuration directives. It is activated when the original response (presumably from an upstream) includes the following HTTP header:

.. code-block:: nginx

  X-Archive-Files: zip

It then scans the response body for a list of files. The syntax is a space-separated list of the file checksum (CRC-32), size (in bytes), location (properly URL-encoded), and file name. One file per line.  The file location corresponds to a location in your nginx.conf; the file can be on disk, from an upstream, or from another module.  The file name can include a directory path, and is what will be extracted from the ZIP file. Example:

.. code-block:: nginx

  1034ab38 428    /foo.txt   My Document1.txt
  83e8110b 100339 /bar.txt   My Other Document1.txt

Files are retrieved and encoded in order. If a file cannot be found or the file request returns any sort of error, the download is aborted.

If all files in the list have a CRC-32 value, mod_zip will support the "Range" header for the download. Unknown CRC-32's should be indicated with a dash ("-"), e.g.

.. code-block:: nginx

  - 428    /foo.txt   My Document1.txt
  - 100339 /bar.txt   My Other Document1.txt

Remote Upstreams
^^^^^^^^^^^^^^^^

You can use the following setup to compose archives from multiple remote servers:

.. code-block:: nginx

  1034ab38 428    /server1/foo.txt   My Document1.txt
  83e8110b 100339 /server2/bar.txt   My Other Document1.txt

  location ~ "^/(?<srv>server[12])/(?<file>.*txt)" {
      proxy_pass http://$srv.domain.com/$file
  }

Tips
----

* add a header "Content-Disposition: attachment; filename=foobar.zip" in the upstream response if you would like the client to name the file "foobar.zip"
* provide the CRC-32 value for files if you'd like to have maximum compatibility with BOMArchiveHelper ('Archiver Utility') and Stuffit Expander.
* Each line should have no whitespace before the CRC-32 field. At the end of the line, \r\n. No empty or extra lines.
* To save bandwidth, add a "Last-Modified" header in the upstream response; mod_zip will then honor the "If-Range" header from clients.
* Make sure the upstream file list is not gzip compressed (e.g. by Apache).
* Make sure the upstream file list has a final newline.


Changelog
---------

1.1
^^^

* 1.1.6: Features: Zip64 for large archives, serial subrequests, UTF-8 filenames. Bugfix: Allow spaces in URLs.
* 1.1.5: Features: "If-Range" support, Range support with local files. Bugfix: NGINX 0.7.25 compatibility.
* 1.1.4: Feature: Range end is optional (e.g. "bytes=0-"). Bugfix: compilation error on FreeBSD.
* 1.1.3: Feature: optional CRC-32's. Bugfix: support BOMArchiveHelper.app on Mac OS X. Bugfix: occasional crash when file returned 404.
* 1.1.2: Bugfix: Compilation error with NGINX 0.6 series.
* 1.1.1: Bugfix: Compilation error on certain platforms.
* 1.1.0: Feature: Full byte-range support. Change: New file list syntax.

1.0
^^^

* 1.0.1: Initial public release
* 1.0.2: Bugfix: Fixed compilation with no ``--with-http-debug flag``
* 1.0.3: Feature: support for Content-Length when X-Archive-Files-* headers are provided
* 1.0.4: Bugfix: support empty files in an archive
* 1.0.5: Bugfix: support archives larger than 2GB
* 1.0.7: Bugfix: clear outgoing "Accept-Ranges" header
* 1.0.8: Bugfix: strip "Range" header from subrequests

Bugs
----

Send bug reports to `Evan Miller <http://www.evanmiller.org/>`_.

`mod_zip <http://code.google.com/p/mod-zip/>`_ at Google Code.

Thanks
------

Thanks to `box.com <https://www.box.com/>`_  for sponsoring the initial development of mod_zip and to `vtunnel.com <http://vtunnel.com/>`_  for sponsoring byte-range support.
