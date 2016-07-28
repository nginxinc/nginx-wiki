Auth Request Example
====================

Description
-----------

This example implements authorization based on the result of a subrequest. If the subrequest returns a 2xx status access is allowed, 401 and 403 are considered authorization failures and all other codes are errors.

The full source for this module can be found at: http://mdounin.ru/hg/ngx_http_auth_request_module/

Code Breakdown
--------------

We need some aspects of NGINX's core, configuration and http functions and structures so we include these.

.. code-block:: c

    #include <ngx_config.h>
    #include <ngx_core.h>
    #include <ngx_http.h>

There are two configuration directives for this module:

* ``auth_request`` - Sets the URI for the subrequest (or ``off``)

* ``auth_request_set`` - Sets a specified request variable to a specified value when authorization is successful

The following structure defines how this information is stored.

.. code-block:: c

    typedef struct {
        ngx_str_t                 uri;
        ngx_array_t              *vars;
    } ngx_http_auth_request_conf_t;

We need a context structure to hold the state of things through various callbacks used in the module. This structure defines the context.

The ``done`` variable stores whether or not the subrequest has completed, the ``status`` stores the subrequest status code and ``subrequest`` is the :c:type:`ngx_http_request_t` structure containing the subrequest information.

.. code-block:: c

    typedef struct {
        ngx_uint_t                done;
        ngx_uint_t                status;
        ngx_http_request_t       *subrequest;
    } ngx_http_auth_request_ctx_t;


This structure is to store variables for the ``auth_request_set`` directive.

.. code-block:: c

    typedef struct {
        ngx_int_t                 index;
        ngx_http_complex_value_t  value;
        ngx_http_set_variable_pt  set_handler;
    } ngx_http_auth_request_variable_t;

Several function prototype declarations are required for use later on in the code.

.. code-block:: c

    static ngx_int_t ngx_http_auth_request_handler(ngx_http_request_t *r);
    static ngx_int_t ngx_http_auth_request_done(ngx_http_request_t *r,
        void *data, ngx_int_t rc);
    static ngx_int_t ngx_http_auth_request_set_variables(ngx_http_request_t *r,
        ngx_http_auth_request_conf_t *arcf, ngx_http_auth_request_ctx_t *ctx);
    static ngx_int_t ngx_http_auth_request_variable(ngx_http_request_t *r,
        ngx_http_variable_value_t *v, uintptr_t data);
    static void *ngx_http_auth_request_create_conf(ngx_conf_t *cf);
    static char *ngx_http_auth_request_merge_conf(ngx_conf_t *cf,
        void *parent, void *child);
    static ngx_int_t ngx_http_auth_request_init(ngx_conf_t *cf);
    static char *ngx_http_auth_request(ngx_conf_t *cf, ngx_command_t *cmd,
        void *conf);
    static char *ngx_http_auth_request_set(ngx_conf_t *cf, ngx_command_t *cmd,
        void *conf);

Now we need to use :c:type:`ngx_command_t` to define the variable for this module.

``NGX_HTTP_MAIN_CONF`` declares that it can be used inside the ``http`` configuration block, ``NGX_HTTP_SRV_CONF`` declares that it can be used in the ``server`` configuration block, ``NGX_HTTP_LOC_CONF`` declares that it can be used in the ``location`` configuration block. The ``NGX_CONF_TAKE1`` states that one argument is required for this directive and ``NGX_CONF_TAKE2`` states that two arguments are required for this directive.

``ngx_http_auth_request``, which is implented further on in this code, is the callback triggered when ``auth_request`` is found in the NGINX configuration. The ``ngx_http_auth_request_set`` callback which is also implemented further in this code is triggered when ``ngx_request_set`` is found.

The ``NGX_HTTP_LOC_CONF_OFFSET`` states that this configuration option is local to the ``location`` configuration block context.

Since we are using a custom callback to handle the variables we do not need to define an offset to the variables so this is set to ``0``.

Finally our list of commands should be terminated with ``ngx_null_command``.

.. code-block:: c

    static ngx_command_t  ngx_http_auth_request_commands[] = {

        { ngx_string("auth_request"),
          NGX_HTTP_MAIN_CONF|NGX_HTTP_SRV_CONF|NGX_HTTP_LOC_CONF|NGX_CONF_TAKE1,
          ngx_http_auth_request,
          NGX_HTTP_LOC_CONF_OFFSET,
          0,
          NULL },

        { ngx_string("auth_request_set"),
          NGX_HTTP_MAIN_CONF|NGX_HTTP_SRV_CONF|NGX_HTTP_LOC_CONF|NGX_CONF_TAKE2,
          ngx_http_auth_request_set,
          NGX_HTTP_LOC_CONF_OFFSET,
          0,
          NULL },

          ngx_null_command
    };

The :c:type:`ngx_http_module_t` structure is used to setup the module context and callbacks for the module. For this module we are interested in the postconfiguration and location block configuration callbacks.

.. code-block:: c

    static ngx_http_module_t  ngx_http_auth_request_module_ctx = {
        NULL,                                  /* preconfiguration */
        ngx_http_auth_request_init,            /* postconfiguration */

        NULL,                                  /* create main configuration */
        NULL,                                  /* init main configuration */

        NULL,                                  /* create server configuration */
        NULL,                                  /* merge server configuration */

        ngx_http_auth_request_create_conf,     /* create location configuration */
        ngx_http_auth_request_merge_conf       /* merge location configuration */
    };

The :c:type:`ngx_module_t` structure is needed so that NGINX knows how to ser up the module. It is important that the name of the instance of this structure is the same as the one in the ``config`` file in the module source.

The structure should always have a header of ``NGX_MODULE_V1`` and a footer of ``NGX_MODULE_V1_PADDING``.

This module is an HTTP module so is declared using ``NGX_HTTP_MODULE``. We don't need any of the thread and process callbacks for this module.

.. code-block:: c

    ngx_module_t  ngx_http_auth_request_module = {
        NGX_MODULE_V1,
        &ngx_http_auth_request_module_ctx,     /* module context */
        ngx_http_auth_request_commands,        /* module directives */
        NGX_HTTP_MODULE,                       /* module type */
        NULL,                                  /* init master */
        NULL,                                  /* init module */
        NULL,                                  /* init process */
        NULL,                                  /* init thread */
        NULL,                                  /* exit thread */
        NULL,                                  /* exit process */
        NULL,                                  /* exit master */
        NGX_MODULE_V1_PADDING
    };

This handler code is called on every request during the access phase. We will set this up in the handlers list in the ``ngx_http_auth_request_init`` function later on in the code.

.. code-block:: c

    static ngx_int_t
    ngx_http_auth_request_handler(ngx_http_request_t *r)
    {
        ngx_table_elt_t               *h, *ho;
        ngx_http_request_t            *sr;
        ngx_http_post_subrequest_t    *ps;
        ngx_http_auth_request_ctx_t   *ctx;
        ngx_http_auth_request_conf_t  *arcf;

We get the auth request url directive setting from the configuration. If it is empty (set to ``off`` in the directive) then we return ``NGX_DECLINED`` which means the request should be routed to the next handler in the chain.

.. code-block:: c

        arcf = ngx_http_get_module_loc_conf(r, ngx_http_auth_request_module);

        if (arcf->uri.len == 0) {
            return NGX_DECLINED;
        }

If the subrequest for auth has been sent but we haven't had a response yet then send ``NGX_AGAIN`` which tells NGINX to try again on the next event loop.

.. code-block:: c

        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "auth request handler");

        ctx = ngx_http_get_module_ctx(r, ngx_http_auth_request_module);

        if (ctx != NULL) {
            if (!ctx->done) {
                return NGX_AGAIN;
            }

As the comment below indicates, variables are set as required for internal redirects.

.. code-block:: c

            /*
             + as soon as we are done - explicitly set variables to make
             + sure they will be available after internal redirects
             */

            if (ngx_http_auth_request_set_variables(r, arcf, ctx) != NGX_OK) {
                return NGX_ERROR;
            }

Then we check the response status for the subrequest. If it is forbidden then we just return this, if it is unauthorized then we push the "WWW-Authenticate" header to the client and return the unauthorized status.

.. code-block:: c

            /* return appropriate status */

            if (ctx->status == NGX_HTTP_FORBIDDEN) {
                return ctx->status;
            }

            if (ctx->status == NGX_HTTP_UNAUTHORIZED) {
                sr = ctx->subrequest;

                h = sr->headers_out.www_authenticate;

                if (!h && sr->upstream) {
                    h = sr->upstream->headers_in.www_authenticate;
                }

                if (h) {
                    ho = ngx_list_push(&r->headers_out.headers);
                    if (ho == NULL) {
                        return NGX_ERROR;
                    }

                    *ho = *h;

                    r->headers_out.www_authenticate = ho;
                }

                return ctx->status;
            }

If the response code is between 200 and 300 then the auth is approved.

.. code-block:: c

            if (ctx->status >= NGX_HTTP_OK
                && ctx->status < NGX_HTTP_SPECIAL_RESPONSE)
            {
                return NGX_OK;
            }

If we have got this far then we got an unexpected error code.

.. code-block:: c

            ngx_log_error(NGX_LOG_ERR, r->connection->log, 0,
                          "auth request unexpected status: %d", ctx->status);

            return NGX_HTTP_INTERNAL_SERVER_ERROR;

The following block of code is where the auth subrequest has not been sent yet. First we need to allocate memory for the context for the subrequest and then for the subrequest itself.

.. code-block:: c

        }

        ctx = ngx_pcalloc(r->pool, sizeof(ngx_http_auth_request_ctx_t));
        if (ctx == NULL) {
            return NGX_ERROR;
        }

        ps = ngx_palloc(r->pool, sizeof(ngx_http_post_subrequest_t));
        if (ps == NULL) {
            return NGX_ERROR;
        }

The handler is the function that is called when the subrequest has completed. In this case we are setting it to the function ``ngx_http_auth_request_done``. The context data for this callback is also set.

.. code-block:: c

        ps->handler = ngx_http_auth_request_done;
        ps->data = ctx;

We now trigger the subrequest with the configured URI and the variables set above. The ``NGX_HTTP_SUBREQUEST_WAITED`` flag serializes subrequests instead of the default of running them in parallel.

.. code-block:: c

        if (ngx_http_subrequest(r, &arcf->uri, NULL, &sr, ps,
                                NGX_HTTP_SUBREQUEST_WAITED)
            != NGX_OK)
        {
            return NGX_ERROR;
        }

Some final settings are changed on the subrequest and the module context is configured with the required information for the next call to this function.

.. code-block:: c

        /*
         + allocate fake request body to avoid attempts to read it and to make
         + sure real body file (if already read) won't be closed by upstream
         */

        sr->request_body = ngx_pcalloc(r->pool, sizeof(ngx_http_request_body_t));
        if (sr->request_body == NULL) {
            return NGX_ERROR;
        }

        sr->header_only = 1;

        ctx->subrequest = sr;

        ngx_http_set_ctx(r, ctx, ngx_http_auth_request_module);

        return NGX_AGAIN;
    }

This function is the callback which is triggered by the compleition of the subrequest as configured in the function above.

It sets the ctx data which is read by ``ngx_http_auth_request_handler`` to make a suitable response.

.. code-block:: c

    static ngx_int_t
    ngx_http_auth_request_done(ngx_http_request_t *r, void *data, ngx_int_t rc)
    {
        ngx_http_auth_request_ctx_t   *ctx = data;

        ngx_log_debug1(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "auth request done s:%d", r->headers_out.status);

        ctx->done = 1;
        ctx->status = r->headers_out.status;

        return rc;
    }

This function is intended to store the variables from the subrequest in the main request.

.. code-block:: c

    static ngx_int_t
    ngx_http_auth_request_set_variables(ngx_http_request_t *r,
        ngx_http_auth_request_conf_t *arcf, ngx_http_auth_request_ctx_t *ctx)
    {
        ngx_str_t                          val;
        ngx_http_variable_t               *v;
        ngx_http_variable_value_t         *vv;
        ngx_http_auth_request_variable_t  *av, *last;
        ngx_http_core_main_conf_t         *cmcf;

        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "auth request set variables");

        if (arcf->vars == NULL) {
            return NGX_OK;
        }

        cmcf = ngx_http_get_module_main_conf(r, ngx_http_core_module);
        v = cmcf->variables.elts;

        av = arcf->vars->elts;
        last = av + arcf->vars->nelts;

        while (av < last) {
            /*
             + explicitly set new value to make sure it will be available after
             + internal redirects
             */

            vv = &r->variables[av->index];

            if (ngx_http_complex_value(ctx->subrequest, &av->value, &val)
                != NGX_OK)
            {
                return NGX_ERROR;
            }

            vv->valid = 1;
            vv->not_found = 0;
            vv->data = val.data;
            vv->len = val.len;

            if (av->set_handler) {
                /*
                 + set_handler only available in cmcf->variables_keys, so we store
                 + it explicitly
                 */

                av->set_handler(r, vv, v[av->index].data);
            }

            av++;
        }

        return NGX_OK;
    }

When new variable is specified with the ``auth_request_set`` directive the function `ngx_http_auth_request_set`` is called. This in-turn calls the function below to initialize the get handler for that variable.

.. code-block:: c

    static ngx_int_t
    ngx_http_auth_request_variable(ngx_http_request_t *r,
        ngx_http_variable_value_t *v, uintptr_t data)
    {
        ngx_log_debug0(NGX_LOG_DEBUG_HTTP, r->connection->log, 0,
                       "auth request variable");

        v->not_found = 1;

        return NGX_OK;
    }

This funciton is called at configuration initialization. It allocates the memory needed to hold the variables.

.. code-block:: c

    static void *
    ngx_http_auth_request_create_conf(ngx_conf_t *cf)
    {
        ngx_http_auth_request_conf_t  *conf;

        conf = ngx_pcalloc(cf->pool, sizeof(ngx_http_auth_request_conf_t));
        if (conf == NULL) {
            return NULL;
        }

        /*
         + set by ngx_pcalloc():
         *
         +     conf->uri = { 0, NULL };
         */

        conf->vars = NGX_CONF_UNSET_PTR;

        return conf;
    }

The configuration directives can be used in different levels of configuration blocks. This merge function makes sure that directives are merged up through to children.

.. code-block:: c

    static char *
    ngx_http_auth_request_merge_conf(ngx_conf_t *cf, void *parent, void *child)
    {
        ngx_http_auth_request_conf_t *prev = parent;
        ngx_http_auth_request_conf_t *conf = child;

        ngx_conf_merge_str_value(conf->uri, prev->uri, "");
        ngx_conf_merge_ptr_value(conf->vars, prev->vars, NULL);

        return NGX_CONF_OK;
    }

During module initialization this function is called to inject ``ngx_http_auth_request_handler``.

.. code-block:: c

    static ngx_int_t
    ngx_http_auth_request_init(ngx_conf_t *cf)
    {
        ngx_http_handler_pt        *h;
        ngx_http_core_main_conf_t  *cmcf;

We get the HTTP core module configuration as the phase handlers are stored here.

.. code-block:: c

        cmcf = ngx_http_conf_get_module_main_conf(cf, ngx_http_core_module);

A new entry is created in the access phase handlers and a pointer to this new entry is returned.

.. code-block:: c

        h = ngx_array_push(&cmcf->phases[NGX_HTTP_ACCESS_PHASE].handlers);
        if (h == NULL) {
            return NGX_ERROR;
        }

The new handler is set to point to our request handler function. It is now in the chain of functions to be called during an access phase.

.. code-block:: c

        *h = ngx_http_auth_request_handler;

        return NGX_OK;
    }


This function is called to process the ``auth_request`` directive when set and validates it accordingly.

.. code-block:: c

    static char *
    ngx_http_auth_request(ngx_conf_t *cf, ngx_command_t *cmd, void *conf)
    {
        ngx_http_auth_request_conf_t *arcf = conf;

        ngx_str_t        *value;

If there is already an ``auth_request`` directive for this block then return an error indicating this.

.. code-block:: c

        if (arcf->uri.data != NULL) {
            return "is duplicate";
        }

        value = cf->args->elts;

If the ``auth_request`` directive is set to ``off`` then disable it.

.. code-block:: c

        if (ngx_strcmp(value[1].data, "off") == 0) {
            arcf->uri.len = 0;
            arcf->uri.data = (u_char *) "";

            return NGX_CONF_OK;
        }

Otherwise store the directive's value.

.. code-block:: c

        arcf->uri = value[1];

        return NGX_CONF_OK;
    }


This function is called to process the ``auth_request_set`` directive when set and validates it accordingly.

.. code-block:: c

    static char *
    ngx_http_auth_request_set(ngx_conf_t *cf, ngx_command_t *cmd, void *conf)
    {
        ngx_http_auth_request_conf_t *arcf = conf;

        ngx_str_t                         *value;
        ngx_http_variable_t               *v;
        ngx_http_auth_request_variable_t  *av;
        ngx_http_compile_complex_value_t   ccv;

        value = cf->args->elts;

If the variable we are trying to set doesn't begin with ``$`` then throw an error. We then skip the ``$`` to use the variable name.

.. code-block:: c

        if (value[1].data[0] != '$') {
            ngx_conf_log_error(NGX_LOG_EMERG, cf, 0,
                               "invalid variable name \"%V\"", &value[1]);
            return NGX_CONF_ERROR;
        }

        value[1].len--;
        value[1].data++;

If there is no auth request variables yet then create the array.

.. code-block:: c

        if (arcf->vars == NGX_CONF_UNSET_PTR) {
            arcf->vars = ngx_array_create(cf->pool, 1,
                                          sizeof(ngx_http_auth_request_variable_t));
            if (arcf->vars == NULL) {
                return NGX_CONF_ERROR;
            }
        }

Create a new variable in the auth request variable array and get a pointer to the new entry.

.. code-block:: c

        av = ngx_array_push(arcf->vars);
        if (av == NULL) {
            return NGX_CONF_ERROR;
        }

Now we create the variable itself using the name defined and set it to a changeable variable.

.. code-block:: c

        v = ngx_http_add_variable(cf, &value[1], NGX_HTTP_VAR_CHANGEABLE);
        if (v == NULL) {
            return NGX_CONF_ERROR;
        }

The new variable is attached to the auth request variable we created.

.. code-block:: c

        av->index = ngx_http_get_variable_index(cf, &value[1]);
        if (av->index == NGX_ERROR) {
            return NGX_CONF_ERROR;
        }

The get handler for the variable is then set if there isn't one already.

.. code-block:: c

        if (v->get_handler == NULL) {
            v->get_handler = ngx_http_auth_request_variable;
            v->data = (uintptr_t) av;
        }

        av->set_handler = v->set_handler;

The value for the variable is compiled and stored.

.. code-block:: c

        ngx_memzero(&ccv, sizeof(ngx_http_compile_complex_value_t));

        ccv.cf = cf;
        ccv.value = &value[2];
        ccv.complex_value = &av->value;

        if (ngx_http_compile_complex_value(&ccv) != NGX_OK) {
            return NGX_CONF_ERROR;
        }

        return NGX_CONF_OK;
    }
