New Config Shell File
=====================

With NGINX 1.9.11 onwards the way ``config`` shell file should be written has changed. It is still compatible with the :doc:`old method <old_config>` but the new method should be used if the module is intended to be a dynamic module.

The new format works when compiling a module as either a static or dynamic module. The config file is in Bourne shell format which is the same as the old method.

An example of the new format is as follows:

.. code-block:: bash

   ngx_module_type=HTTP
   ngx_module_name=ngx_http_my_module
   ngx_module_srcs="$ngx_addon_dir/ngx_http_my_module.c"

   . auto/module

   ngx_addon_name=$ngx_module_name

You do not need to set empty variables for things that are not required as these will be cleared for each module by the build system.

.. note:: the ``. auto/module`` line is required to trigger the new module build system.

If the module is to be used with previous versions of NGINX it is possible to have a config file support bothe the old and new methods. See the :doc:`converting` guide for an example of this.

Compiling
---------

With the new configure system a module can be added to the configure line with ``--add-module=/path/to/module`` for static compilation and ``--add-dynamic-module=/path/to/module`` for dynamic compilation.

Options
-------

.. ini:key:: ngx_module_type

   The type of module to build. Possible options are ``HTTP``, ``CORE``, ``HTTP_FILTER``, ``HTTP_INIT_FILTER``, ``HTTP_AUX_FILTER``, ``MAIL``, ``STREAM`` or ``MISC``

.. ini:key:: ngx_module_name

   The name of the module. This is used in the build system for compiling a dynamic module. Multiple whitespace separated values are possible here for multiple modules in a single set of source files, the first name in this list will be used for the name of the output binary for a dynamic module. See the complex example in :doc:`converting`. The names used in this should be the same names as the :c:type:`module definition struct <ngx_module_t>`.

.. ini:key:: ngx_module_incs

   Include paths required to build the module.

.. ini:key:: ngx_module_deps

   A list of ``.h`` files which are part of the module which are required to build it.

.. ini:key:: ngx_module_srcs

   A whitespace separated list of source files used to compile the module. The ``$ngx_addon_dir`` variable can be used as a placeholder for the path of the module source.

.. ini:key:: ngx_module_libs

   A list of libraries to link with the module. For example libpthread would be linked using ``ngx_module_libs=-lpthread``. The following macros can be used to link against the same libraries as NGINX: ``LIBXSLT``, ``LIBGD``, ``GEOIP``, ``PCRE``, ``OPENSSL``, ``MD5``, ``SHA1``, ``ZLIB`` and ``PERL``.

.. ini:key:: ngx_addon_name

   Supplies the name of the module in the console output text of the ``configure`` script.

.. ini:key:: ngx_module_link

   This is set by the build system to ``DYNAMIC`` for a dynamic module or ``ADDON`` for a static module. It is not used often but can be useful if something different needs to happen for different compile modes. The value of this variable can be tested using a standard ``if`` as used in a shell script.

.. ini:key:: ngx_module_order

   Set the load order for the module which is useful for ``HTTP_FILTER`` and ``HTTP_AUX_FILTER`` module types.

   The order is stored in a reverse list. The ``ngx_http_copy_filter_module`` is near the bottom of the list so is one of the first to be executed. This reads the data for other filters. Near the top of the list is ``ngx_http_write_filter_module`` which writes the data out and is one of the last to be executed.

   The format for this option is typically the current module's name followed by a whitespace separated list of modules to insert before, and therefore execute after. The module will be inserted before the last module in the list that is found to be currently loaded.

   By default for filter modules this is set to ``"$ngx_module_name ngx_http_copy_filter"`` which will insert the module before the copy filter in the list and therefore will execute after the copy filter. For other module types the default is empty.
