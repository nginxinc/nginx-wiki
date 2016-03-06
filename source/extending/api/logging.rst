Logging API
===========

Types
-----

ngx_log_t
^^^^^^^^^

.. c:type:: ngx_log_t

   An object containing internal information about the NGINX log file.

ngx_err_t
^^^^^^^^^

.. c:type:: ngx_err_t

   An alias for the Operating System error code, ``err`` on \*nix systems

Functions
---------

ngx_log_error
^^^^^^^^^^^^^

.. c:function:: void ngx_log_error(ngx_uint_t level, ngx_log_t *log, ngx_err_t err, const char *fmt, ...)

   Sends an error to the NGINX log file, this accepts a variable list of parameters using printf format placeholders.

   :param level: The severity level of the log
   :param log: A pointer to the NGINX logging object
   :param err: The operating system error code (0 if not applicable)
   :param fmt: The error message text including printf format placeholders

   The level can be one of the following:

   ================== =======================
   Level              Description
   ================== =======================
   NGX_LOG_DEBUG      Debug level
   NGX_LOG_INFO       Information level
   NGX_LOG_NOTICE     Notice level
   NGX_LOG_WARN       Warning level
   NGX_LOG_ERR        Error level
   NGX_LOG_CRIT       Critical error level
   NGX_LOG_ALERT      Alert error level
   NGX_LOG_EMERG      Emergency error level
   ================== =======================

ngx_log_stderr
^^^^^^^^^^^^^^

.. c:function:: void ngx_log_stderr(ngx_err_t err, const char *fmt, ...)

   Sends an error to the system's stderr. Accepts a variable list of parameters using printf format placeholders.

   :param err: A pointer to the NGINX logging object
   :param fmt: The error message text including printf format placeholders

ngx_log_abort
^^^^^^^^^^^^^

.. c:function:: void ngx_log_abort(ngx_err_t err, const char *fmt, ...)

   Aborts NGINX and sends an error message to stderr. Accepts a variable list of parameters using printf format placeholders.

   :param err: A pointer to the NGINX logging object
   :param fmt: The error message text including printf format placeholders

ngx_log_debug
^^^^^^^^^^^^^

.. c:function:: void ngx_log_debug(ngx_uint_t level, ngx_log_t *log, ngx_err_t err, const char *fmt, ...)

   An alias to :c:func:`ngx_log_error` but the level is only checked to see if that level should be logged. All calls to this will actually be logged as ``NGX_LOG_DEBUG``

   There are also aliases to this, ``ngx_log_debug0`` to ``ngx_log_debug8`` which take exactly 0 to 8 arguments for the format placeholders depending on which one is used

   :param level: The severity level of the log
   :param log: A pointer to the NGINX logging object
   :param err: The operating system error code (0 if not applicable)
   :param fmt: The error message text including printf format placeholders

ngx_conf_log_error
^^^^^^^^^^^^^^^^^^

.. c:function:: void ngx_conf_log_error(ngx_uint_t level, ngx_conf_t *cf, ngx_err_t err, const char *fmt, ...)

   Logs an error in the same way as :c:func:`ngx_log_error` but uses a pointer to the configuration object so that details of the configuration file can be logged.

   :param level: The severity level of the log (see :c:func:`ngx_log_error` for possible levels)
   :param cf: A pointer to the configuration object triggering the error
   :param err: The operating system error code (0 if not applicable)
   :param fmt: The error message text including printf format placeholders
