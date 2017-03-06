
.. meta::
   :description: A flexible, scalable pubsub server for Websockets, EventSource, Long-Poll and more

Nchan
=====

Description
-----------

**Nchan** is a scalable, flexible pub/sub server for the modern web, built as a module for the Nginx web server. It can be configured as a standalone server, or as a shim between your application and tens, thousands, or millions of live subscribers. It can buffer messages in memory, on-disk, or via Redis. All connections are handled asynchronously and distributed among any number of worker processes. It can also scale to many nginx server instances with Redis.

Messages are published to channels with HTTP POST requests or websockets, and subscribed also through websockets, long-polling, EventSource (SSE), old-fashioned interval polling, and more. Any location can be a subscriber endpoint for up to 4 channels. Each subscriber can be optionally authenticated via a custom application url, and an events meta channel is available for debugging.


Nchan was originally the `Nginx HTTP Push Module <https://pushmodule.slact.net>`_. It was renamed after a complete refactoring and overhaul. 

Available on github at :github:`nchan <slact/nchan>`

Documentation
-------------

Nchan is thoroughly documented at `nchan.slact.net <https://nchan.io>`_