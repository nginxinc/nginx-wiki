Old Config Shell File
=====================

.. note:: This document outlines the old ``config`` file prior to NGINX 1.9.11. For new modules that are intended to be dynamic modules you should use the :doc:`new_config`. A guide to converting a module to the new format can be found :doc:`here <converting>`.

Every module needs a ``config`` file which is a Bourne shell file guiding the NGINX build system on how to build a module. A typical basic ``config`` file would look like the following:

.. code-block:: bash

   ngx_addon_name=ngx_http_my_module
   HTTP_MODULES="$HTTP_MODULES ngx_http_my_module"
   NGX_ADDON_SRCS="$NGX_ADDON_SRCS $ngx_addon_dir/ngx_http_my_module.c"

Options
-------

.. note::

    With all these options ``$ngx_addon_dir`` can be used as a placeholder for the source directory for the module.

.. ini:key:: nxg_addon_name

   The name of the module. This is used for the console output of the ``configure`` script.

.. ini:key:: HTTP_MODULES

   This adds your module to the list of HTTP modules to be loaded. It should be prepended with ``$HTTP_MODULES`` so that it is addative to the list of HTTP modules already defined.

.. ini:key:: HTTP_FILTER_MODULES

   Similar to :ini:key:`HTTP_MODULES` this adds your module to the list of HTTP filter modules to be loaded. It should be prepended with ``$HTTP_FILTER_MODULES`` so that it is additive to the list of HTTP filter modules already defined.

.. ini:key:: MAIL_MODULES

   Similar to :ini:key:`HTTP_MODULES` this adds your module to the list of mail modules to be loaded. It should be prepended with ``$MAIL_MODULES`` so that it is additive to the list of mail modules already defined.

.. ini:key:: STREAM_MODULES

   Similar to :ini:key:`HTTP_MODULES` this adds your module to the list of TCP/IP stream modules to be loaded. It should be prepended with ``$HTTP_FILTER_MODULES`` so that it is additive to the list of TCP/IP stream modules already defined.

.. ini:key:: NGX_ADDON_SRCS

   A list of source files to be used to build the module. This should be prepended with ``$NGX_ADDON_SRCS`` so that previous module sources are also included.

.. ini:key:: HTTP_INCS

   A list of include directories to be used to build the module. This should be prepended with ``$HTTP_INCS`` so that the include directories for other modules are included.

.. ini:key:: HTTP_DEPS

   A list of include files the build depends on. This should be prepended with ``$HTTP_DEPS`` so that include files from other modules are included.
