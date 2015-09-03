
.. meta::
   :description: Learn the coding style used in the NGINX source files by example.

The Nginx source code is written in the C programming language by
Kernighan and Ritchie and maintains a consistent style.

-  K&R style indentation
-  4 space indentation, no tabs
-  2 line breaks between blocks at global level
-  C style comments only

Examples
--------

From the fastcgi module.

.. code-block:: c

   /*
    * Copyright (C) Igor Sysoev
    */


   #include <ngx_config.h>
   #include <ngx_core.h>
   #include <ngx_http.h>


   typedef struct {
       ngx_http_upstream_conf_t       upstream;

       ngx_str_t                      index;

       ngx_array_t                   *flushes;
       ngx_array_t                   *params_len;
       ngx_array_t                   *params;
       ngx_array_t                   *params_source;
       ngx_array_t                   *catch_stderr;

       ngx_array_t                   *fastcgi_lengths;
       ngx_array_t                   *fastcgi_values;

   #if (NGX_HTTP_CACHE)
       ngx_http_complex_value_t       cache_key;
   #endif

   #if (NGX_PCRE)
       ngx_regex_t                   *split_regex;
       ngx_str_t                      split_name;
   #endif
   } ngx_http_fastcgi_loc_conf_t;


   typedef enum {
       ngx_http_fastcgi_st_version = 0,
       ngx_http_fastcgi_st_type,
       ngx_http_fastcgi_st_request_id_hi,
       ngx_http_fastcgi_st_request_id_lo,
       ngx_http_fastcgi_st_content_length_hi,
       ngx_http_fastcgi_st_content_length_lo,
       ngx_http_fastcgi_st_padding_length,
       ngx_http_fastcgi_st_reserved,
       ngx_http_fastcgi_st_data,
       ngx_http_fastcgi_st_padding
   } ngx_http_fastcgi_state_e;


   typedef struct {
       u_char                        *start;
       u_char                        *end;
   } ngx_http_fastcgi_split_part_t;

