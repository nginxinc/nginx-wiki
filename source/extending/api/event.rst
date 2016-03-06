Event Handling
==============

Structures
----------

ngx_event_t
^^^^^^^^^^^

.. c:type:: ngx_event_t

   An event structure which is to be added to the event loop

   .. c:member:: void *data

      A pointer to data to pass to the event handler. Normally this is a pointer to :c:type:`ngx_connection_t`

   .. c:member:: void (*ngx_event_handler_pt)(ngx_event_t *ev) handler

      A handler function to be called when the event is triggered

   .. c:member:: ngx_log_t *log

      A pointer to a log object to be used by the event


Functions
---------

ngx_add_timer
^^^^^^^^^^^^^

.. c:function:: void ngx_add_timer(ngx_event_t *ev, ngx_msec_t timer)

   Adds a timer to the NGINX event loop. Normally used for timeouts on a socket but can also be used as a generic timer.

   :param ev: The event object to generate a timeout on
   :param timer: the timeout in milliseconds

   Example:

   This example will trigger a timer event after 5 seconds with a dummy connection

   .. code-block:: c

      static ngx_event_t my_timer;
      static ngx_connection_t dumb_con;

      ngx_int_t ngx_my_init_process(ngx_cycle_t *cycle)
      {
          my_timer.handler = ngx_timer_fired;
          my_timer.log = cycle->log;
          my_timer.data = &dumb_con;
          dumb.fd = (ngx_socket_t) -1;
      }

      void ngx_timer_fired(ngx_event_t *ev)
      {
          ngx_log_error(NGX_LOG_DEBUG, ev->log, 0, "Event fired!");
      }

ngx_del_timer
^^^^^^^^^^^^^

.. c:function:: void ngx_event_del_timer(ngx_event_t *ev)

   Removes the timer from the NGINX event loop

   :param ev: The event object the timer is one
