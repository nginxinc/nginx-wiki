Extended Status
===============

Description
-----------

**extended_status module** - an extended module for Nginx status.

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <extended_status.installation_>`_.

Directives
----------

extended_status
^^^^^^^^^^^^^^^

  :Syntax: ``extended_status [on|off]``;
  :Default: ``off``
  :Context: *http, server, location*

Example:

.. code-block:: nginx

  location = /extended_status {
      extended_status on;
  }
  location = /tablesort.min.js {
      root html;
  }


.. _extended_status.installation:

Installation
------------

Before compiling, apply any necessary patches_.

.. code-block:: bash

  ./configure --add-module=[nginx_extended_status_module source dirctory] &&
  make &&
  make install

.. _patches:

Patches
-------

For Nginx **0.8.54** (or **0.8.55**):

.. code-block:: bash

  patch -p0 < extended_status-0.8.54.patch

For Nginx **1.0.11**:

.. code-block:: bash

  patch -p0 < extended_status-1.0.11.patch

For Nginx **1.2.6**:

.. code-block:: bash

  patch -p1 < extended_status-1.0.11.patch
