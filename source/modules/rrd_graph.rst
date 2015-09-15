
.. meta::
   :description: The RRD Graph module provides an HTTP interface to RRDtool's graphing facilities, and is faster than scripts and CGIs with similar purposes.

RRD Graph
=========

Description
-----------
`RRDtool <http://oss.oetiker.ch/rrdtool/index.en.html>`_ stores and graphs time-series data. 

**mod_rrd_graph** - is an NGINX module that provides an HTTP interface to RRDtool's graphing facilities. By linking RRDtool directly into NGINX, ngx_rrd_graph is faster than scripts and CGIs with similar purposes.

.. note:: *This module is not distributed with the NGINX source.* See the `installation instructions <rrd_graph.installation_>`_.



Directives
----------
* rrd_graph_
* rrd_graph_root_


rrd_graph
^^^^^^^^^
:Syntax: *rrd_graph*
:Default: *none*
:Context: *location*

ngx_rrd_graph can be enabled at a particular location with the rrd_graph_ directive, like so:

.. code-block:: nginx

  location /rrdtool {
      rrd_graph;
  }

RRDtool graphing commands can then be appended to that location in request URLs. The syntax is just the same as the arguments to the ``rrdtool graph`` command, omitting the filename (refer to `rrdgraph(1) <http://oss.oetiker.ch/rrdtool/doc/rrdgraph.en.html>`_). These commands should be URL-encoded, so that this command-line invocation:

.. code-block:: bash

  rrdtool graph --start now-300s \
  --end now \
  DEF:ds0=test.rrd:reading:AVERAGE \
  LINE1:ds0#00FF00

becomes::

  http://mysite.com/rrdtool--start%20now-300s%20--end%20now%20DEF%3Ads0%3Dtest.rrd%3Areading%3AAVERAGE%20LINE1%3Ads0%2300FF00

The module supports all the features of your copy of RRDtool. It can output PNG, PDF, SVG, and EPS graphics (see the ``--imgformat`` option of `rrdgraph(1) <http://oss.oetiker.ch/rrdtool/doc/rrdgraph.en.html>`_).


rrd_graph_root
^^^^^^^^^^^^^^
:Syntax: *rrd_graph_root /path/to/rrds*
:Default: *none*
:Context: *location*

If you'd prefer not to provide absolute paths to files referenced in DEF commands, you may supply a root directory with the rrd_graph_root_ directive. Files mentioned in DEF commands will be automatically prefixed with the value of rrd_graph_root_.



.. _rrd_graph.installation:

Installation
------------
* ngx_rrd_graph requires `RRDtool 1.3 <http://oss.oetiker.ch/rrdtool-trac/wiki/RRDtool13>`_  or later.
* After installing RRDtool, get the mod_rrd_graph source code from :github:`Github <evanmiller/mod_rrd_graph>`
* Extract the archive and add the following option to your NGINX ``./configure`` command:

  .. code-block:: bash

    --add-module=/path/to/mod_rrd_graph

* Then ``make`` and ``make install`` as usual.



Bugs
----
Please report bugs to `Evan Miller <http://www.evanmiller.org/>`_.
