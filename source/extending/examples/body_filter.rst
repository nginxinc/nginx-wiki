Catch Body Filter Example
=========================

Description
-----------

This is a very basic example of a body filter which will look at the request body and will return a ``403`` error if an ``X`` character is found.

It uses the directive ``catch_body`` to enable and disable it.

The full source for this module can be found at: http://mdounin.ru/hg/ngx_http_catch_body_filter_module/

Code Breakdown
--------------

First we need to use some include files from the NGINX source code to provide the functionality we need.

.. code-block:: c

    #include <ngx_config.h>
    #include <ngx_core.h>
    #include <ngx_http.h>

Next we need to create a structure which will contain the ``catch_body`` flag status, it will be used in each configuration block.

.. code-block:: c

    typedef struct {
        ngx_flag_t         enable;
    } ngx_http_catch_body_conf_t;

A few function prototype declarations are required for use later on in the code.

.. code-block:: c

    static void *ngx_http_catch_body_create_conf(ngx_conf_t *cf);
    static char *ngx_http_catch_body_merge_conf(ngx_conf_t *cf, void *parent,
        void *child);
    static ngx_int_t ngx_http_catch_body_init(ngx_conf_t *cf);

Now we use :c:type:`ngx_command_t` to define the ``catch_body`` flag.

``NGX_HTTP_MAIN_CONF`` declares that it can be used inside the ``http`` configuration block, ``NGX_HTTP_SRV_CONF`` declares that it can be used in the ``server`` configuration block, ``NGX_HTTP_LOC_CONF`` declares that it can be used in the ``location`` configuration block. The ``NGX_CONF_FLAG`` option declares this as a simple boolean flag.

The ``ngx_conf_set_flag_slot`` callback is used to allow ``on`` and ``off`` to be used in the configuration file to enable/disable the boolean flag.

The ``NGX_HTTP_LOC_CONF_OFFSET`` declares that the value should be stored in the location block context.

The ``offsetof`` declares the memory location of this option in relation to the structure declared near the top of the file.

Finally our list of commands should be terminated with ``ngx_null_command``.

.. code-block:: c

    static ngx_command_t  ngx_http_catch_body_commands[] = {

        { ngx_string("catch_body"),
          NGX_HTTP_MAIN_CONF|NGX_HTTP_SRV_CONF|NGX_HTTP_LOC_CONF|NGX_CONF_FLAG,
          ngx_conf_set_flag_slot,
          NGX_HTTP_LOC_CONF_OFFSET,
          offsetof(ngx_http_catch_body_conf_t, enable),
          NULL },

          ngx_null_command
    };

The :c:type:`ngx_http_module_t` structure is used to set up the module context and callbacks for the module. For this module we are interested in the postconfiguration and location block configuration callbacks.

.. code-block:: c

    static ngx_http_module_t  ngx_http_catch_body_module_ctx = {
        NULL,                          /* preconfiguration */
        ngx_http_catch_body_init,      /* postconfiguration */

        NULL,                          /* create main configuration */
        NULL,                          /* init main configuration */

        NULL,                          /* create server configuration */
        NULL,                          /* merge server configuration */

        ngx_http_catch_body_create_conf, /* create location configuration */
        ngx_http_catch_body_merge_conf   /* merge location configuration */
    };

The :c:type:`ngx_module_t` structure is what NGINX looks for when loading the module to declare everything required to set the module up. It is important that the name for instance for this structure is the same as the one declared in the ``config`` file that comes with the module.

This structure should have ``NGX_MODULE_V1`` as a header and ``NGX_MODULE_V1_PADDING`` as a footer. The above declared module context is pointed to here as well as the array of configuration directives we have declared.

The module is an HTTP module so is declared using ``NGX_HTTP_MODULE``. We don't need any of the thread and process callbacks for this module.

.. code-block:: c

    ngx_module_t  ngx_http_catch_body_filter_module = {
        NGX_MODULE_V1,
        &ngx_http_catch_body_module_ctx, /* module context */
        ngx_http_catch_body_commands,  /* module directives */
        NGX_HTTP_MODULE,               /* module type */
        NULL,                          /* init master */
        NULL,                          /* init module */
        NULL,                          /* init process */
        NULL,                          /* init thread */
        NULL,                          /* exit thread */
        NULL,                          /* exit process */
        NULL,                          /* exit master */
        NGX_MODULE_V1_PADDING
    };

Later on we will need to rearrange the body filter callback chain. We need a pointer to hold the next filter in the chain to do this.

.. code-block:: c

    static ngx_http_request_body_filter_pt   ngx_http_next_request_body_filter;

This is our filter function that will be called on every request body given to NGINX. We will set this up in the body filter chain at the end of this source file.

.. code-block:: c

    static ngx_int_t
    ngx_http_catch_body_filter(ngx_http_request_t *r, ngx_chain_t *in)
    {
        u_char                      *p;
        ngx_chain_t                 *cl;
        ngx_http_catch_body_conf_t  *conf;

We call :c:func:`ngx_http_get_module_loc_conf` to get the configuration setting for the current location block used by the request. If the configuration has this directive turned on for the block we continue, otherwise we skip to the next filter.

.. code-block:: c

        conf = ngx_http_get_module_loc_conf(r, ngx_http_catch_body_filter_module);

        if (!conf->enable) {
            return ngx_http_next_request_body_filter(r, in);
        }

        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "catch request body filter");

The body for the request is stored in a chain. We cycle through the links in the chain reading the buffer contents searching for the character ``X``.

If ``X`` is found we return ``NGX_HTTP_FORBIDDEN`` as found in :ref:`http-return-codes`. Otherwise we move on to the next body filter.

.. code-block:: c

        for (cl = in; cl; cl = cl->next) {

            p = cl->buf->pos;

            for (p = cl->buf->pos; p < cl->buf->last; p++) {

                ngx_log_debug2(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                               "catch body in:%02Xd:%c", *p, *p);

                if (*p == 'X') {
                    ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                                   "catch body: found");

                    /*
                     + As we return NGX_HTTP_FORBIDDEN, the r->keepalive flag
                     + won't be reset by ngx_http_special_response_handler().
                     + Make sure to reset it to prevent processing of unread
                     + parts of the request body.
                     */

                    r->keepalive = 0;

                    return NGX_HTTP_FORBIDDEN;
                }
            }
        }

        return ngx_http_next_request_body_filter(r, in);
    }

The create conf callback allocates the memory required for the configuration directives and sets the defaults.

.. code-block:: c

    static void *
    ngx_http_catch_body_create_conf(ngx_conf_t *cf)
    {
        ngx_http_catch_body_conf_t  *conf;

        conf = ngx_pcalloc(cf->pool, sizeof(ngx_http_catch_body_conf_t));
        if (conf == NULL) {
            return NULL;
        }

        conf->enable = NGX_CONF_UNSET;

        return conf;
    }

The merge conf callback lets child blocks set the ``enable`` flag when the parent blocks have it set.

.. code-block:: c

    static char *
    ngx_http_catch_body_merge_conf(ngx_conf_t *cf, void *parent, void *child)
    {
        ngx_http_catch_body_conf_t *prev = parent;
        ngx_http_catch_body_conf_t *conf = child;

        ngx_conf_merge_value(conf->enable, prev->enable, 0);

        return NGX_CONF_OK;
    }

During the initialization we wish to add the filter in this module to the filter chain. We do this by making this filter the one at the top of the chain (relative to module load order or pre-defined order). The filter in this module will then call the one that was previously the top filter when finished.

.. code-block:: c

    static ngx_int_t
    ngx_http_catch_body_init(ngx_conf_t *cf)
    {
        ngx_http_next_request_body_filter = ngx_http_top_request_body_filter;
        ngx_http_top_request_body_filter = ngx_http_catch_body_filter;

        return NGX_OK;
    }
