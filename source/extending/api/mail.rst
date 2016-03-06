Mail Module API
===============

Structures
----------

ngx_mail_protocol_t
^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_mail_protocol_t

   Declares a new mail protocol for NGINX to proxy

   .. c:member:: ngx_str_t name

      The name for the protocol, used as an indentity for the ``protocol`` directive. In the IMAP module this is declared using:

      .. code-block:: c

         ngx_string("imap")

   .. c:member:: in_port_t port[4]

      An array of up to 4 ports to listen on. Set the array entries to '0' if they are not needed. For example with IMAP this would be:

      ``{ 143, 993, 0, 0 }``

   .. c:member:: ngx_uint_t type

      The type of protocol. The options are:

      ====================== ================
      Option                 Description
      ====================== ================
      NGX_MAIL_POP3_PROTOCOL A POP3 protocol
      NGX_MAIL_IMAP_PROTOCOL An IMAP protocol
      NGX_MAIL_SMTP_PROTOCOL An SMTP protocol
      ====================== ================

   .. c:member:: void (*ngx_mail_init_session_pt)(ngx_mail_session_t *s, ngx_connection_t *c) init_session

      A callback which is called after connection for every new mail session

   .. c:member:: void (*ngx_mail_init_protocol_pt)(ngx_event_t *rev) init_protocol

      A callback which is called prior to authentication on every new mail session

   .. c:member:: ngx_int_t (*ngx_mail_parse_command_pt)(ngx_mail_session_t *s) parse_command

      A callback which is called for ever command sent to NGINX by the client.

      The callback should return ``NGX_OK`` if successful, ``NGX_AGAIN`` if we have not received the whole command yet, ``NGX_MAIL_PARSE_INVALID_COMMAND`` if the command is invalid or ``NGX_ERROR`` for an internal error.

   .. c:member:: void (*ngx_mail_auth_state_pt)(ngx_event_t *rev) auth_state

      A callback which is called in the event loop to go through the various stages of authentication.

   .. c:member:: ngx_str_t internal_server_error

      A string to return when there is an internal server error. For IMAP this is:

      .. code-block:: c

         ngx_string("* BAD internal server error" CRLF)

   .. c:member:: ngx_str_t cert_error

      A string to return when there is an SSL certificate error. For IMAP this is:

      .. code-block:: c

         ngx_string("* BYE SSL certificate error" CRLF)

   .. c:member:: ngx_str_t no_cert

      A string to return when the required SSL certificate is missing. For IMAP this is:

      .. code-block:: c

         ngx_string("* BYE No required SSL certificate" CRLF)

ngx_mail_session_t
^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_mail_session_t

   .. c:member:: ngx_connection_t *connection

      A pointer to the connection object

   .. c:member:: ngx_buf_t *buffer

      A pointer to the buffer storing the incoming client data

   .. c:member:: ngx_uint_t state

      An integer to store the current state of the command parser
