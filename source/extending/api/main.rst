Main Module API
===============

Types
-----

ngx_pid_t
^^^^^^^^^

.. c:type:: ngx_pid_t

   An integer used to store a process ID

ngx_cycle_t
^^^^^^^^^^^

.. c:type:: ngx_cycle_t

   An event cycle object

ngx_uint_t
^^^^^^^^^^

.. c:type:: ngx_uint_t

   An alias for ``unsigned int``

ngx_int_t
^^^^^^^^^

.. c:type:: ngx_int_t

   An alias for ``int``

ngx_flag_t
^^^^^^^^^^

.. c:type:: ngx_flag_t

   A boolean flag

ngx_msec_t
^^^^^^^^^^

.. c:type:: ngx_msec_t

   A type for storing millisecond counts, alias for :c:type:`ngx_uint_t`

ngx_file_t
^^^^^^^^^^

.. c:type:: ngx_file_t

   An object containing details about a current open file descriptor

ngx_peer_connection_t
^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_peer_connection_t

   A connection object representing an upstream peer connection.

Structures
----------

ngx_module_t
^^^^^^^^^^^^

.. c:type:: ngx_module_t

   A required structure used to define some basic module hooks.

   Used in example: :doc:`../examples/body_filter`

   .. c:member:: NGX_MODULE_V1

       A macro for the header of the struct

   .. c:member:: void *ctx

       A pointer to be passed to calls made by NGINX's API to your module

   .. c:member:: ngx_command_t *commands

       A pointer to a struct which defines extra configuration directives used by the module

   .. c:member:: ngx_uint_t type

       The type of module defined. Should be filled using one of the following macros:

       ================= ======================
       Macro             Type
       ================= ======================
       NGX_CORE_MODULE   A core module
       NGX_HTTP_MODULE   An HTTP module
       NGX_EVENT_MODULE  An event module
       NGX_MAIL_MODULE   A mail module
       NGX_STREAM_MODULE A TCP/IP stream module
       ================= ======================

   .. c:member:: ngx_int_t (*init_master)(ngx_log_t *log)

       A hook into the initialisation of the master process

       .. note:: This hook has currently not been implemented

   .. c:member:: ngx_int_t (*init_module)(ngx_cycle_t *cycle)

       A hook into the module initiliasation phase. This happens prior to the master process forking.

   .. c:member:: ngx_int_t (*init_process)(ngx_cycle_t *cycle)

       A hook into the module initilisation in new process phase. This happens as the worker processes are forked.

   .. c:member:: ngx_int_t (*init_thread)(ngx_cycle_t *cycle)

       A hook into the initialisation of threads

       .. note:: This hook has currently not been implemented

   .. c:member:: void (*exit_thread)(ngx_cycle_t *cycle)

       A hook into the termination of a thread

       .. note:: This hook has currently not been implemented

   .. c:member:: void (*exit_process)(ngx_cycle_t *cycle)

       A hook into the termination of a child process (such as a worker process)

   .. c:member:: void (*exit_master)(ngx_cycle_t *cycle)

       A hook into the termination of the master process

   .. c:member:: NGX_MODULE_V1_PADDING

       A macro for the footer of the struct

Example
"""""""

.. code-block:: c

    ngx_module_t ngx_http_my_module = {
        NGX_MODULE_V1,
        &ngx_http_my_module_ctx,      /* module context */
        ngx_http_my_module_commands,  /* module directives */
        NGX_HTTP_MODULE,              /* module type */
        NULL,                         /* init master */
        NULL,                         /* init module */
        NULL,                         /* init process */
        NULL,                         /* init thread */
        NULL,                         /* exit thread */
        NULL,                         /* exit process */
        NULL,                         /* exit master */
        NGX_MODULE_V1_PADDING
    };


ngx_core_module_t
^^^^^^^^^^^^^^^^^

.. c:type:: ngx_core_module_t

   .. c:member:: ngx_str_t name

      A string containing the name for the module

   .. c:member:: void *(*create_conf)(ngx_cycle_t *cycle)

      A callback for allocations and initilization of configuration

   .. c:member:: char *(*init_conf)(ngx_cycle_t *cycle)

      A callback to set the configurtion based on directives supplied in the configuration files

ngx_http_module_t
^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_module_t

   Defines the module context of an HTTP module.

   Used in example: :doc:`../examples/body_filter`

   .. c:member:: ngx_int_t (*preconfiguration)(ngx_conf_t *cf)

      A pre-configuration callback

   .. c:member:: ngx_int_t (*postconfiguration)(ngx_conf_t *cf)

      A post-configuration callback

   .. c:member:: void *(*create_main_conf)(ngx_conf_t *cf)

      A callback for allocations and initilizations of configurations for the main block configuration

   .. c:member:: char *(*init_main_conf)(ngx_conf_t *cf, void *conf)

      A callback to set the configuration based on the directives supplied in the configuration files

   .. c:member:: void *(*create_srv_conf)(ngx_conf_t *cf)

      A callback for allocations and initilizations of configurations for the server block configuration

   .. c:member:: char *(*merge_srv_conf)(ngx_conf_t *cf, void *prev, void *conf)

      A callback to merge the server block configuration with the main block

   .. c:member:: void *(*create_loc_conf)(ngx_conf_t *cf)

      A callback for allocations and initilizations of configurations for the location block configuration

   .. c:member:: char *(*merge_loc_conf)(ngx_conf_t *cf, void *prev, void *conf)

      A callback to merge the location block configuration with the server block

ngx_mail_module_t
^^^^^^^^^^^^^^^^^

.. c:type:: ngx_mail_module_t

   .. c:member:: ngx_mail_protocol_t *protocol

      A pointer to a :c:type:`ngx_mail_protocol_t` structure

   .. c:member:: void *(*create_main_conf)(ngx_conf_t *cf)

      A callback for allocations and initilizations of configurations for the main block configuration

   .. c:member:: char *(*init_main_conf)(ngx_conf_t *cf, void *conf)

      A callback to set the configuration based on the directives supplied in the configuration files

   .. c:member:: void *(*create_srv_conf)(ngx_conf_t *cf)

      A callback for allocations and initilizations of configurations for the server block configuration

   .. c:member:: char *(*merge_srv_conf)(ngx_conf_t *cf, void *prev, void *conf)

      A callback to merge the server block configuration with the main block

ngx_connection_t
^^^^^^^^^^^^^^^^

.. c:type:: ngx_connection_t

   .. c:member:: ngx_log_t *log

      A pointer to the logging handler for the connection.
