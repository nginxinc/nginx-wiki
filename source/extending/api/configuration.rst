Configuration API
=================

Types
-----

ngx_conf_t
^^^^^^^^^^

.. c:type:: ngx_conf_t

   A pointer to a configuration object.

ngx_keyval_t
^^^^^^^^^^^^

.. c:type:: ngx_keyval_t

   A pointer to a configuration key value

Structures
----------

ngx_command_t
^^^^^^^^^^^^^

.. c:type:: ngx_command_t

   A struct to define configuration directives for the module.

   This struct will normally be used to create a static array of configuration directives. The array should be terminated using ``ngx_null_command``. For example with the mail module:

   .. code-block:: c

      static ngx_command_t  ngx_mail_commands[] = {

          { ngx_string("mail"),
            NGX_MAIN_CONF|NGX_CONF_BLOCK|NGX_CONF_NOARGS,
            ngx_mail_block,
            0,
            0,
            NULL },

            ngx_null_command
      };

   Used in example: :doc:`../examples/body_filter`

   .. c:member:: ngx_str_t name

      The name of the directive

   .. c:member:: ngx_uint_t type

      ================== =========================================================================
      Type               Description
      ================== =========================================================================
      NGX_CONF_NOARGS    Directive has no arguments
      NGX_CONF_TAKE1     Directive has one argument
      NGX_CONF_TAKE2     Directive has two arguments
      NGX_CONF_TAKE3     Directive has three arguments
      NGX_CONF_TAKE4     Directive has four arguments
      NGX_CONF_TAKE5     Directive has five arguments
      NGX_CONF_TAKE6     Directive has six arguments
      NGX_CONF_TAKE7     Directive has seven arguments
      NGX_CONF_TAKE12    Directive has one or two arguments (alias for ``NGX_CONF_TAKE1 | NGX_CONF_TAKE2``)
      NGX_CONF_TAKE13    Directive has one or three arguments (alias for ``NGX_CONF_TAKE1 | NGX_CONF_TAKE3``)
      NGX_CONF_TAKE23    Directive has two or three arguments (alias for ``NGX_CONF_TAKE2 | NGX_CONF_TAKE3``)
      NGX_CONF_TAKE123   Directive has one to three arguments (alias for ``NGX_CONF_TAKE1 | NGX_CONF_TAKE2 | NGX_CONF_TAKE3``)
      NGX_CONF_TAKE1234  Directive has one to four arguments (alias for ``NGX_CONF_TAKE1 | NGX_CONF_TAKE2 | NGX_CONF_TAKE3 | NGX_CONF_TAKE4``)
      NGX_CONF_BLOCK     Argument is a configuration block
      NGX_CONF_FLAG      Directive is a flag with values *on* and *off*
      NGX_CONF_ANY       Directive has zero or more arguments
      NGX_CONF_1MORE     Directive has one or more arguments
      NGX_CONF_2MORE     Directive has two or more arguments
      NGX_DIRECT_CONF    Directive only in the main configuration file
      NGX_MAIN_CONF      Directive only in the main configuration level
      NGX_ANY_CONF       Directive can be used in at any level / directive
      NGX_HTTP_MAIN_CONF Directive for the http directive
      NGX_HTTP_SRV_CONF  Directive for the server directive inside the http directive
      NGX_HTTP_LOC_CONF  Directive for the location directive inside the http directive
      NGX_HTTP_UPS_CONF  Directive for the upstream directive inside the http directive
      NGX_HTTP_SIF_CONF  Directive for server block if statements
      NGX_HTTP_LIF_CONF  Directive for location block if statements
      NGX_HTTP_LMT_CONF  Directive for the *limit_except* block
      ================== =========================================================================

   .. c:member:: char *(set)(ngx_conf_t *cf, ngx_command_t *cmd, void *conf)

      A callback function to be called when the directive is found in the configuration. This should return ``NGX_CONF_OK`` if successful or ``NGX_CONF_ERROR`` upon an error.

      There are several callback handlers already supplied with NGINX which you can use:

      ========================= ======================= ========================================================
      Callback name             Data type               Description
      ========================= ======================= ========================================================
      ngx_conf_set_flag_slot    :c:type:`ngx_flag_t`    Allows ``on`` and ``off`` as values for a boolean
      ngx_conf_set_str_slot     :c:type:`ngx_str_t`
      ngx_conf_set_str_array    :c:type:`ngx_array_t` * Returns a pointer to an array of :c:type:`ngx_str_t`
      ngx_conf_set_keyval_slot  :c:type:`ngx_array_t` * Returns a pointer to an array of :c:type:`ngx_keyval_t`
      ngx_conf_set_num_slot     :c:type:`ngx_int_t`
      ngx_conf_set_size_slot    ``size_t``
      ngx_conf_set_off_slot     ``off_t``
      ngx_conf_set_msec_slot    :c:type:`ngx_msec_t`
      ngx_conf_set_sec_slot     ``time_t``
      ngx_conf_set_bufs_slot    :c:type:`ngx_bufs_t`
      ngx_conf_set_bitmask_slot :c:type:`ngx_uint_t`
      ========================= ======================= ========================================================

      :param cf: The configuration object
      :param cmd: A pointer to this struct
      :param conf: A pointer to the context for configuration object

   .. c:member:: ngx_uint_t conf

      Which location the directive's value should be saved to, possible options are:

      * NGX_HTTP_MAIN_CONF_OFFSET

      * NGX_HTTP_LOC_CONF_OFFSET

      * NGX_HTTP_SRV_CONF_OFFSET

      * NGX_MAIL_MAIN_CONF_OFFSET

      * NGX_MAIL_SRV_CONF_OFFSET

      * NGX_MAIL_MAIN_CONF_OFFSET

      * NGX_MAIL_SRV_CONF_OFFSET

      * NGX_STREAM_MAIN_CONF_OFFSET

      * NGX_STREAM_SRV_CONF_OFFSET

   .. c:member:: ngx_uint_t offset

      The offset in a configuration struct to save the data for this directive to. This should be set using the ``offsetof()`` macro from the standard C ``stddef.h``.

   .. c:member:: void *post

      A pointer to a :c:type:`ngx_conf_post_t` struct which contains a post-processor function.


ngx_conf_post_t
^^^^^^^^^^^^^^^

.. c:type:: ngx_conf_post_t

   A struct containing a pointer to a configuration post processor

   .. c:member:: char *(*ngx_conf_post_handler_pt) (ngx_conf_t *cf, void *data, void *conf)

      A callback function to be called after the processing of a configuration option. This should return ``NGX_CONF_OK`` if successful or ``NGX_CONF_ERROR`` upon an error.

      :param cf: The configuration object
      :param data: An arbitrary data pointer, usually set to the pointer for this struct
      :param conf: The configuration data pointer

Functions
---------

ngx_http_conf_get_module_main_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_conf_get_module_main_conf(ngx_conf_t *cf, ngx_module_t *module)

   A macro which gets the module's http core configuration object from the configuration object

   :param cf: The configuration object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the core configuration struct for that module

ngx_http_conf_get_module_srv_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_conf_get_module_srv_conf(ngx_conf_t *cf, ngx_module_t *module)

   A macro which gets the module's http server block configuration object from the configuration object

   :param cf: The configuration object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the server block configuration struct for that module

ngx_http_conf_get_module_loc_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_conf_get_module_loc_conf(ngx_conf_t *cf, ngx_module_t *module)

   A macro which gets the module's http location block configuration object from the configuration object

   :param cf: The configuration object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the location block configuration struct for that module

ngx_http_get_module_main_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_get_module_main_conf(ngx_http_request_t *r, ngx_module_t *module)

   A macro which gets the module's http core configuration object from the request object

   :param request: The request object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the core configuration struct for that module

ngx_http_get_module_srv_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_get_module_srv_conf(ngx_http_request_t *r, ngx_module_t *module)

   A macro which gets the module's http server block configuration object from the request object

   :param request: The request object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the server block configuration struct for that module

ngx_http_get_module_loc_conf
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_get_module_loc_conf(ngx_http_request_t *r, ngx_module_t *module)

   A macro which gets the module's http location block configuration object from the request object

   Used in example: :doc:`../examples/body_filter`

   :param request: The request object
   :param module: The module we are getting the configuration for
   :returns: A pointer to the location block configuration struct for that module

