
.. meta::
   :description: The Substitutions module performs both regular expression and fixed string substitutions on response bodies.

Substitutions
=============

Description
-----------
**nginx_substitutions_filter** - a filter module which can do both regular expression and fixed string substitutions on response bodies. This module is quite different from the Nginx's native Substitution Module. It scans the output chains buffer and matches string line by line, just like Apache's `mod_substitute <http://httpd.apache.org/docs/trunk/mod/mod_substitute.html>`_.

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <substitutions.installation_>`_.



Example
-------

.. code-block:: nginx

  location / {
      subs_filter_types text/html text/css text/xml;
      subs_filter st(\d*).example.com $1.example.com ir;
      subs_filter a.example.com s.example.com;
  }



Directives
----------
* subs_filter_types_
* subs_filter_


subs_filter_types
^^^^^^^^^^^^^^^^^
:Syntax: *subs_filter_types mime-type [ mime-types ]*
:Default: *text/html*
:Context: *http, server, location*

subs_filter_types_ is used to specify which content types should be checked for subs_filter_.

This module just works with plain text. If the response is compressed, it can't uncompress the
response and will ignore this response. This module can be compatible with gzip filter module.
But it will not work with proxy compressed response. You can disable the compressed response like this:

.. code-block:: nginx

  proxy_set_header Accept-Encoding "";


subs_filter
^^^^^^^^^^^
:Syntax: *subs_filter source_str destination_str [gior]*
:Default: *g*
:Context: *http, server, location*

subs_filter_ allows replacing source string (regular expression or fixed) in the nginx response with
destination string. Substitution text may contain variables. More than one substitution rules per
location is supported. The meaning of the third flags are:

* ``g``: Replace all the match strings.
* ``i``: Perform a case-insensitive match.
* ``o``: Just replace the first one.
* ``r``: The pattern is treated as a regular expression, default is fixed string.



.. _substitutions.installation:

Installation
------------
To install, get the source with subversion:

.. code-block:: bash

  git clone git://github.com/yaoweibin/ngx_http_substitutions_filter_module.git


and then compile nginx with the following option:

.. code-block:: bash

  ./configure --add-module=/path/to/module



Changelog
---------
06/30/2012: Changes with nginx_substitutions_filter 0.6.0

- refactored this module

08/11/2010: Changes with nginx_substitutions_filter 0.5.2

- optimizations
- fixed a bug of buffer overlap
- fixed a segment fault bug when output chain return NGX_AGAIN.
- fixed a bug about last buffer with no linefeed. This may cause segment fault. Thanks for Josef Fröhle

04/15/2010: Changes with nginx_substitutions_filter 0.5

- refactored the source structure, create branches of dev
- fixed a bug of small chunk of buffers causing lose content
- fixed the bug of last_buf and the nginx's compatibility above 0.8.25
- fixed a bug with unwanted capture config error in fix string substitution
- added feature of regex captures

12/23/2009: Changes with nginx_substitutions_filter 0.4

- fixed many bugs

02/04/2009: Changes with nginx_substitutions_filter 0.3

- initial public release



Reporting a bug
---------------
Questions/patches may be directed to Weibin Yao, yaoweibin@gmail.com.
