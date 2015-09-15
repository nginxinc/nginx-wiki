
.. meta::
   :description: The Fancy Index module makes possible the generation of file listings like the built-in autoindex module does, but adds a touch of style.

Fancy Index
===========

Synopsis
--------
The Fancy Index module makes possible the generation of file listings, like the built-in autoindex module does, but adding a touch of style. This is possible because the module module allows a certain degree of customization of the generated content:

* Custom headers (either local or stored remotely).
* Custom footers (either local or stored remotely).
* Add you own CSS style rules.
* Allow choosing to sort elements by name (default), modification time, or size; both ascending (default), or descending (new in 0.3.3).

This module is designed to work with NGINX, a high performance open source web server written by Igor Sysoev.

.. note:: I have compiled this module with NGINX 1.0.10 on a server running Debian Squeeze - however the README only talks about NGINX 0.8



Requirements
------------
* Sources for NGINX 0.8.x, and its requirements.
  - The module compiles with 0.7.x versions as well.
  - It *might* compile with 0.6.x applying "nginx-0.6-support.patch", YMMV.
* Patience, and some Coffee™.



Building
--------
1. Unpack the NGINX sources.

  .. code-block:: bash
    
    $ gunzip -c nginx-?.?.?.tar.gz | tar -xvf -

2. Download the latest version using Git.

  .. code-block:: bash

    $ git clone https://github.com/aperezdc/ngx-fancyindex.git ngx-fancyindex

3. Change to the directory which contains the NGINX sources, run the configuration script with the desired options and be sure to put an ``--add-module`` flag pointing to the directory which contains the source of the fancy indexing module.

  .. code-block:: bash

    $ cd nginx-?.?.?
    $ ./configure --add-module=../ngx-fancyindex  [extra desired options]

4. Build and install the software.

  .. code-block:: bash

    $ make
    $ sudo make install

5. Configure NGINX by using the modules' configuration directives_.



Example Enable
--------------
You can test the default built-in style by adding the following lines into a ``server`` section in your NGINX configuration file:

.. code-block:: nginx

  location / {
    fancyindex on;              # Enable fancy indexes.
    fancyindex_exact_size off;  # Output human-readable file sizes.
  }

.. _directives:

Directives
----------

fancyindex
^^^^^^^^^^
:Syntax: *fancyindex [on|off]*
:Default: *off*
:Context: *http, server, location*

Enables or disables fancy directory indexes.


fancyindex_css_href
^^^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_css_href uri*
:Default: *""*
:Context: *http, server, location*

Allows inserting a link to a CSS style sheet in generated listings. 
The provided *uri* parameter will be inserted as-is in a ``<link>`` HTML tag.
The link is inserted after the built-in CSS rules, so you can override the default styles.


fancyindex_exact_size
^^^^^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_exact_size [on|off]*
:Default: *on*
:Context: *http, server, location*

Defines how to represent file sizes in the directory listing; either accurately, or rounding off to the kilobyte, the megabyte and the gigabyte.


fancyindex_footer
^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_footer path*
:Default: *""*
:Context: *http, server, location*

Specifies which file should be inserted at the foot of directory listings.
If set to an empty string, the default footer supplied by the module will be sent.

.. warning:: When inserting custom header/footer a subrequest will be issued so potentially any URL can be used as source for them. Although it will work with external URLs, only using internal ones is supported. External URLs are totally untested and using them will make NGINX block while waiting for the subrequest to complete. If you feel like external header/footer is a must-have for you, please `let me know <mailto:aperez@igalia.com>`_.


fancyindex_header
^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_header path*
:Default: *""*
:Context: *http, server, location*

Specifies which file should be inserted at the head of directory listings.
If set to an empty string, the default header supplied by the module will be sent.


fancyindex_ignore
^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_ignore string1 [string2 [... stringN]]*
:Default: *none*
:Context: *http, server, location*

Specifies a list of file names which will be not be shown in generated listings. 
If NGINX was built with PCRE support strings are interpreted as regular expressions.


fancyindex_localtime
^^^^^^^^^^^^^^^^^^^^
:Syntax: *fancyindex_localtime [ on | off ]*
:Default: *off*
:Context: *http, server, location*

Enables showing file times as local time. Default is “off” (GMT time).
