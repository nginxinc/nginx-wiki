HTTP API
========

Constants
---------

.. _http-return-codes:

HTTP Return Codes
^^^^^^^^^^^^^^^^^

These constants are an easy way to reference the HTTP return codes in your modules

===================================== =====
Option                                Value
===================================== =====
``NGX_HTTP_CONTINUE``                 100
``NGX_HTTP_SWITCHING_PROTOCOLS``      101
``NGX_HTTP_PROCESSING``               102
``NGX_HTTP_OK``                       200
``NGX_HTTP_CREATED``                  201
``NGX_HTTP_ACCEPTED``                 202
``NGX_HTTP_NO_CONTENT``               204
``NGX_HTTP_PARTIAL_CONTENT``          206
``NGX_HTTP_SPECIAL_RESPONSE``         300
``NGX_HTTP_MOVED_PERMANENTLY``        301
``NGX_HTTP_MOVED_TEMPORARILY``        302
``NGX_HTTP_SEE_OTHER``                303
``NGX_HTTP_NOT_MODIFIED``             304
``NGX_HTTP_TEMPORARY_REDIRECT``       307
``NGX_HTTP_BAD_REQUEST``              400
``NGX_HTTP_UNAUTHORIZED``             401
``NGX_HTTP_FORBIDDEN``                403
``NGX_HTTP_NOT_FOUND``                404
``NGX_HTTP_NOT_ALLOWED``              405
``NGX_HTTP_REQUEST_TIME_OUT``         408
``NGX_HTTP_CONFLICT``                 409
``NGX_HTTP_LENGTH_REQUIRED``          411
``NGX_HTTP_PRECONDITION_FAILED``      412
``NGX_HTTP_REQUEST_ENTITY_TOO_LARGE`` 413
``NGX_HTTP_REQUEST_URI_TOO_LARGE``    414
``NGX_HTTP_UNSUPPORTED_MEDIA_TYPE``   415
``NGX_HTTP_RANGE_NOT_SATISFIABLE``    416
``NGX_HTTP_TOO_MANY_REQUESTS``        429
``NGX_HTTP_CLOSE``                    444
``NGX_HTTP_NGINX_CODES``              494
``NGX_HTTP_REQUEST_HEADER_TOO_LARGE`` 494
``NGX_HTTPS_CERT_ERROR``              495
``NGX_HTTPS_NO_CERT``                 496
``NGX_HTTP_TO_HTTPS``                 497
``NGX_HTTP_CLIENT_CLOSED_REQUEST``    499
``NGX_HTTP_INTERNAL_SERVER_ERROR``    500
``NGX_HTTP_NOT_IMPLEMENTED``          501
``NGX_HTTP_BAD_GATEWAY``              502
``NGX_HTTP_SERVICE_UNAVAILABLE``      503
``NGX_HTTP_GATEWAY_TIME_OUT``         504
``NGX_HTTP_INSUFFICIENT_STORAGE``     507
===================================== =====

Structures
----------

ngx_http_request_t
^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_request_t

   A structure containing the details of a request and response. There are many members of this structure so only the parts you would be expected to use are listed here

   .. c:member:: ngx_connection_t *connection

      The connection object for the structure. Useful for its ``log`` member.

   .. c:member:: ngx_http_upstream_t *upstream

      An object to set details for an upstream request

   .. c:member:: ngx_pool_t *pool

      The memory pool to use for allocations with the request

   .. c:member:: ngx_http_headers_in_t headers_in

      An object containing the http headers that came in with the request

   .. c:member:: ngx_http_headers_out_t headers_out

      An object containing the http headers to be returned to the client

   .. c:member:: ngx_str_t uri

      A string containing the requested path

   .. c:member:: ngx_str_t args

      A string containing the get request arguments after the question mark

   .. c:member:: ngx_http_request_t *main

      A pointer to the main request, points to its own structure if it is the main request

   .. c:member:: ngx_http_request_t *parent

      A pointer to the parent request

   .. c:member:: header_only:1

      Set to ``1`` to disable sending the body to a client

ngx_http_headers_in_t
^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_headers_in_t

   A structure to store the incoming header data

   .. c:member:: ngx_list_t headers

      A list containing the incoming headers

   .. c:member:: ngx_table_elt_t *host

      The host header

   .. c:member:: ngx_table_elt_t *connection

      Desired connection options (such as ``close`` and ``keep-alive``)

   .. c:member:: ngx_table_elt_t *if_modified_since

      The ``If-Modified-Since`` incoming header

   .. c:member:: ngx_table_elt_t *if_unmodified_since

      The ``If-Unmodified-Since`` incoming header

   .. c:member:: ngx_table_elt_t *if_match

      The ``If-Match`` incoming header

   .. c:member:: ngx_table_elt_t *if_none_match

      The ``If-None-Match`` incoming header

   .. c:member:: ngx_table_elt_t *user_agent

      The client's user agent

   .. c:member:: ngx_table_elt_t *referer

      The referer supplied by the client

   .. c:member:: ngx_table_elt_t *content_length

      The content length of client POST data

   .. c:member:: ngx_table_elt_t *content_type

      The content type of client POST data

   .. c:member:: ngx_table_elt_t *range

      The requested byte range for the content

   .. c:member:: ngx_table_elt_t *if_range

      The ``If-Range`` incoming header

   .. c:member:: ngx_table_elt_t *transfer_encoding

      The encoding for the data transfer

   .. c:member:: ngx_table_elt_t *expect

      The ``Expect`` incoming header

   .. c:member:: ngx_table_elt_t *upgrade

      The connection upgrade request from the client

   .. c:member:: ngx_table_elt_t *accept_encoding

      The encodings the client will accept

   .. c:member:: ngx_table_elt_t *via

      Details of the proxy used by the client

   .. c:member:: ngx_table_elt_t *authorization

      The autorization request header

   .. c:member:: ngx_table_elt_t *keep_alive

      The client keep-alive request header

   .. c:member:: ngx_array_t x_forwarded_for

      The ``X-Forwarded-For`` header for a load balancer

   .. c:member:: ngx_table_elt_t *x_real_ip

      The ``X-Real-IP`` header for a load balanacer

   .. c:member:: ngx_table_elt_t *accept

      The content types which are acceptable for a response

   .. c:member:: ngx_table_elt_t *accept_language

      The acceptable human languages to be used for a response

   .. c:member:: ngx_table_elt_t *depth

      The ``Depth`` incoming header

   .. c:member:: ngx_table_elt_t *destination

      The ``Destination`` incoming header

   .. c:member:: ngx_table_elt_t *overwrite

      The ``Overwrite`` incoming header

   .. c:member:: ngx_table_elt_t *date

      The client date/time of the request

   .. c:member:: ngx_str_t user

      The decoded user from the authorization header

   .. c:member:: ngx_str_t passwd

      The decoded password from the authorization header

   .. c:member:: ngx_array_t cookies

      An array containting the incoming cookies

   .. c:member:: ngx_str_t server

      The server string from the upstream

   .. c:member:: off_t content_length_n

      The length of the incoming content

   .. c:member:: time_t keep_alive_n

      The keep alive timeout time

   .. c:member:: unsigned connection_type:2

      A flag stating whether the connection is ``NGX_HTTP_CONNECTION_KEEP_ALIVE`` or ``NGX_HTTP_CONNECTION_CLOSE``

   .. c:member:: unsigned chunked:1

      A boolean specifying chunked encoding

   .. c:member:: unsigned msie:1

      A boolean specifying Internet Explorer as the client

   .. c:member:: unsigned msie6:1

      A boolean specifying Internet Explorer 6 as the client

   .. c:member:: unsigned opera:1

      A boolean specifying Opera as the client

   .. c:member:: unsigned gecko:1

      A boolean specifying the Gecko rendering engine as the client (ie. Firefox)

   .. c:member:: unsigned chrome:1

      A boolean specifying Chrome as the client

   .. c:member:: unsigned safari:1

      A boolean specifying Safari as the client

   .. c:member:: unsigned konqueror:1

      A boolean specifying Konqueror as the client


ngx_http_headers_out_t
^^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_headers_out_t

   A structure to store the outgoing header data

   .. c:member:: ngx_list_t headers

      A list containing additional headers to be added

   .. c:member:: ngx_uint_t status

      The status to return, possible options are the :ref:`http-return-codes`

   .. c:member:: ngx_table_elt_t *content_encoding

      Stores the "Content-Encoding" header, both key and value.

   .. c:member:: size_t content_type_len

      The length of the content type, normally this should be set to the same as ``content_type.len``

   .. c:member:: ngx_str_t content_type

      A string containing the mime type for the content

   .. c:member:: off_t content_length_n

      The length of the content body

   .. c:member:: time_t last_modified_time

      The last modified time for the returned content

ngx_http_post_subrequest_t
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_post_subrequest_t

   A structure to store a callback function for a subrequest

   .. c:member:: ngx_int_t (*ngx_http_post_subrequest_pt)(ngx_http_request_t *r, void *data, ngx_int_t rc)

      The callback function to be triggered

   .. c:member:: void *data

      A pointer to arbitrary data to send to the callback function

ngx_http_upstream_t
^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_upstream_t

   .. c:member:: ngx_peer_connection_t peer

      Connection details for the upstream peer.

   .. c:member:: ngx_http_upstream_conf_t *conf

      A pointer to the configuration object for the upstream.

   .. c:member:: ngx_int_t (*create_request)(ngx_http_request_t *r)

      A callback function which should allocate the required buffers for a request. It should return ``NGX_OK`` on success or ``NGX_ERROR`` on failure.

   .. c:member:: ngx_int_t (*reinit_request)(ngx_http_request_t *r)

      A callback to reinitialize a state pointers if an attempt to communicate with an upstream fails. It should return ``NGX_OK`` on success.

   .. c:member:: ngx_int_t (*process_header)(ngx_http_request_t *r)

      A callback to set the header for the client response after the upstream header has been retrieved. It should return ``NGX_OK`` on success.

   .. c:member:: void (*abort_request)(ngx_http_request_t *r)

      A callback triggered when the client aborts a request.

   .. c:member:: void (*finalize_request)(ngx_http_request_t *r, ngx_int_t rc)

      A callback triggered to finish the request.

ngx_table_elt_t
^^^^^^^^^^^^^^^

.. c:type:: ngx_table_elt_t

   An element from an NGINX hash table.

   .. c:member:: hash

      Set to ``1`` to use this element or ``0`` to ignore it

   .. c:member:: key

      A string containing the key for the hash element

   .. c:member:: value

      A string containing the value for the hash element

ngx_http_upstream_conf_t
^^^^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_http_upstream_conf_t

   An upstream configuration object used for upstream/proxy handlers

   .. c:member:: ngx_msec_t connect_timeout

      The connect timeout for the upstream

   .. c:member:: ngx_msec_t send_timeout

      The send timeout for the upstream

   .. c:member:: ngx_msec_t read_timeout

      The read timeout for the upstream

   .. c:member:: ngx_msec_t next_upstream_timeout

      Timeout before switching to the next upstream

   .. c:member:: ngx_uint_t store_access

      Permissions for storing files such as temporary files to disk

   .. c:member:: ngx_bufs_t bufs

      Buffers for the upstream body data

   .. c:member:: ngx_flag_t buffering

      Whether or not to buffer the data

   .. c:member:: size_t buffer_size

      The size of each buffer, it should normally be set to ``ngx_pagesize``

   .. c:member:: size_t max_temp_file_size

      The maximum size of temporary files

   .. c:member:: size_t temp_file_write_size

      The amount of data before the body should be stored to disk

   .. c:member:: ngx_array_t *hide_headers

      A list of header fields to not pass downstream

   .. c:member:: ngx_array_t *pass_headers

      A list of header fields to pass downstream that are normally disabled. These are: "Date", "Server", "X-Pad", and "X-Accel-..."


Functions
---------

ngx_http_subrequest
^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_http_subrequest(ngx_http_request_t *r, ngx_str_t *uri, ngx_str_t *args, ngx_http_request_t **sr, ngx_http_post_subrequest_t *psr, ngx_uint_t flags)

   Executes a subrequest to a given URL

   :param r: The main request object
   :param uri: The URI to call
   :param args: The GET arguments for the subrequest
   :param sr: A pointer to a pointer which is set by the function with the new request object
   :param psr: A callback to be triggered when the request is finihsed
   :param flags: Use ``NGX_HTTP_SUBREQUEST_IN_MEMORY`` to keep the subrequest result in memory after the subrequest is finished
   :returns: ``NGX_OK`` upon success or ``NGX_ERROR`` upon error setting up the request

ngx_http_get_module_ctx
^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_http_get_module_ctx(ngx_http_request_t *r, ngx_module_t module)

   A macro to get the context data for a given module and request

   :param r: The request to get the context for
   :param module: The module to get the context for
   :returns: A pointer to the context

ngx_http_set_ctx
^^^^^^^^^^^^^^^^

.. c:function:: void ngx_http_set_ctx(ngx_http_request_t *r, void *c, ngx_module_t module)

   A macro to set the context data for a given module and request

   :param r: The request to set the context for
   :param c: The context data pointer
   :param module: The module to set the context for

ngx_http_parse_time
^^^^^^^^^^^^^^^^^^^

.. c:function:: time_t ngx_http_parse_time(unsigned char *value, size_t len)

   Converts a string containing `RFC822 <https://tools.ietf.org/html/rfc822>`_, `RFC850 <https://tools.ietf.org/html/rfc850>`_ or ISO C time formats into a ``time_t`` format.

   :param value: The time string to convert
   :param len: The length of the string
   :returns: The converted ``time_t`` object

Callbacks
---------

ngx_http_output_header_filter_pt
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_int_t (*ngx_http_output_header_filter+pt)(ngx_http_request_t *r)

   A callback to a header filter. In modules this is normally used as follows:

   .. code-block:: c

      static ngx_http_output_header_filter_pt ngx_http_next_header_filter;


ngx_http_output_body_filter_pt
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_int_t (*ngx_http_output_body_filter_pt)(ngx_http_request_t *r, ngx_chain_t *chain)

   A callback to a body filter. In modules this is normally used as follows:

   .. code-block:: c

      static ngx_http_output_body_filter_pt ngx_http_next_body_filter;

