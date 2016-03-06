Configuration Variables API
===========================

Structures
----------

.. c:type:: ngx_http_variable_value_t

   The structure containing the details of a variable's value.

   .. c:member:: unsigned len:28

      The length of the ``data`` parameter (a 28bit number)

   .. c:member:: unsigned valid:1

      A boolean to determine whether or not a cached value is valid

   .. c:member:: unsigned no_cacheable:1

      A boolean to determine whether or not the value is cachable

   .. c:member:: unsigned not_found:1

      A boolean stating whether or not the requested variable was found

   .. c:member:: unsigned char *data

      The value of the variable


.. c:type:: ngx_http_variable_t

   A structure to hold details about a configuration variable

   .. c:member:: ngx_int_t (*ngx_http_get_variable_pt) (ngx_http_request_t *r, ngx_http_variable_value_t *v, uintptr_t data)

      A callback to execute when retrieving a value of variable

   .. c:member:: void (*ngx_http_set_variable_pt) (ngx_http_request_t *r, ngx_http_variable_value_t *v, uintptr_t data)

      A callback to execute when setting a value of a variable

   .. c:member:: uintptr_t data

      A pointer to data for use with the get/set callback functions

Functions
---------

ngx_http_add_variable
^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_http_variable_t *ngx_http_add_variable(ngx_conf_t *cf, ngx_str_t *name, ngx_uint_t flags)

   Adds a variable to a configuration. This should be called from the pre-configuration hook of :c:type:`ngx_http_module_t`

   ============================= ======================================================================================================
   Flag                          Description
   ============================= ======================================================================================================
   ``NGX_HTTP_VAR_CHANGEABLE``   Enables the setting of the variable in the configuration file
   ``NGX_HTTP_VAR_NOCACHEABLE``  The variable should not be cached
   ``NGX_HTTP_VAR_NOHASH``       An optimistaition which removes the ability to use :c:func:`ngx_http_get_variable` on a variable
   ============================= ======================================================================================================

   :param cf: The configuration object to add the variable to
   :param name: The name of the variable
   :param flags: Flags for the variable
   :returns: A pointer to a newly created variable

ngx_http_get_variable_index
^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_http_get_variable_index(ngx_conf_t *cf, ngx_str_t *name)

   Get the index of variable based on its name

   :param cf: The configuration object to search
   :param name: The configuration name to search for
   :returns: The index ID of the variable or ``NGX_ERROR`` upon error

ngx_http_get_indexed_variable
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_http_variable_value_t *ngx_http_get_indexed_variable(ngx_http_request_t *r, ngx_uint_t index)

   Get the current value for a variable

   :param r: The request object requiring the variable
   :param index: The index for the variable
   :returns: A pointer to the structure containing the variable

ngx_http_get_flushed_variable
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_http_variable_value_t *ngx_http_get_flushed_variable(ngx_http_request_t *r, ngx_uint_t index)

   Flush the cache of a variable and get a new value for it

   :param r: The request object requiring the variable
   :param index: The index for the variable
   :returns: A pointer to the structure containing the variable

ngx_http_get_variable
^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_http_variable_value_t *ngx_http_get_variable(ngx_http_request_t *r, ngx_str_t *name, ngx_uint_t key)

   Gets a variable based on a hash lookup of the variable name. Does not work on variables that were initialized ``NGX_HTTP_VAR_NOHASH`` flag enabled.

   The hash can be generated using :c:func:`ngx_hash_strlow`. For example:

   .. code-block:: c

      key = ngx_hash_strlow(var.data, var.data, var.len);
      vv = ngx_http_get_variable(r, &var, key);

   :param r: The request object requiring the variable
   :param name: The name of the requested variable
   :param key: The hash of the variable name
   :returns: A pointer to the structure containing the variable
