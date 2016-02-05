Compiling Modules
=================

Static Modules
--------------

Static modules are compiled into the NGINX server binary at compile time. To tell the build system that you wish to compile in your module you need to use the ``add-module`` parameter to ``./configure`` as follows:

.. code-block:: bash

   $ ./configure --prefix=/opt/nginx --add-module=/path/to/my-module

The build system will look for the :doc:`config <old_config>` file and use the information in this to build the module.

Dynamic Modules
---------------

See the :ref:`compiling-dynamic` section in the Converting Static Modules guide.
