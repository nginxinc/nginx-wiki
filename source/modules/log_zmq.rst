
.. meta::
   :description: The Log ZeroMQ module uses ZeroMQ protocol to log NGINX requests asynchronous via inproc or TCP.

Log ZMQ
=======

Name
----

ZeroMQ logger module for nginx.

`ZeroMQ <http://zeromq.org>`_, \zero-em-queue\, is a protocol for messages exchange. It's a easy
way to communicate using any language or platform via inproc, IPC, TCP, TPIC or multicast.
It's asynchronous and only requires a small library.

.. note:: *This module is not distributed with the nginx source.* See the `installation instructions <log_zmq.installation_>`_.

Status
------

This module is already production ready.

Description
-----------

This is a nginx logger module integrated with `ZeroMQ <http://zeromq.org>`_ library.

*nginx-log-zmq* provides a very efficient way to log data for one or more PUB/SUB subscribers, over one or more different endpoints. This can be useful for data gathering and processing.

The message format can be the same as the tradicional log format which gives a interesting way to ``tail`` data via the network or exploring other text formats like JSON. As with the traditional log, it's possible to use nginx variables updated each request.

All messages are sent asynchronously and do not block the normal behaviour of the nginx server. As expected, the connections are resilient to network failures.

Synopsis
--------

.. code-block:: nginx

    http {
        # simple message to an IPC endpoint with 4 threads and 1000 queue elements

        log_zmq_server main "/tmp/main.ipc" ipc 4 1000;
        log_zmq_endpoint  main "/topic/";

        log_zmq_format main '{"remote_addr":"$remote_addr"}'

        # send messages to a subscriber listening at 127.0.0.1:5556

        log_zmq_server secondary 127.0.0.1:5556 tcp 4 1000;

        # set secondary endpoint
        log_zmq_endpoint secondary "/endpoint/";

        # set format using multiline
        log_zmq_format secondary '{"request_uri":"$request_uri",'
                                 ' "status":"$status"}';


        server {

            location /status {
                # mute all messages from log_zmq for this location

                log_zmq_off all;
            }

            location /endpoint {
                # mute main messages from log_zmq for this location

                log_zmq_off main;
            }
        }
    }


Directives
----------

log_zmq_server
^^^^^^^^^^^^^^
:Syntax: *log_zmq_server <definition_name> <address> <ipc|tcp> <threads> <queue size>*
:Default: *no*
:Context: *http*

Configures a server (PUB/SUB subscriber) to connect to.

The following options are required:

**definition_name** <name> - the name that nginx will use to identify this logger instance.

**address** <path>|<ipaddress>:<port> - the subscriber's address. If you are using the IPC
protocol, you should specify the ``<path>`` for the unix socket. If you are using the TCP
protocol, you should specify the ``<ipaddress>`` and ``<port>`` where your ZeroMQ subscriber is listening.

**protocol** <ipc|tcp> - the protocol to be used for communication.

**threads** <integer> - the number of I/O threads to be used.

**queue_size** <integer> - the maximum queue size for messages waiting to be sent.

log_zmq_endpoint
^^^^^^^^^^^^^^^^

:Syntax: *log_zmq_endpoint <definition_name> "<topic>"*

:Default: *no*

:Context: *http*

Configures the topic for the ZeroMQ messages.

**definition_name** <name> - the name that nginx will use to identify this logger instance.

**topic** <topic> - the topic for the messages. This is a string (which can be a nginx variable) prepended to every sent message. For example, if you send the message "hello" to the "/talk:" topic, the message will end up as "/talk:hello".

Example:

.. code-block:: nginx

    http {
        log_zmq_server main "/tmp/example.ipc" 4 1000;

        # send a message for for an topic based on response status

        log_zmq_endpoint main "/remote/$status";
    }

log_zmq_format
^^^^^^^^^^^^^^

:Syntax: *log_zmq_format <definition_name> "<format>"*
:Default: *no*
:Context: *http*

Configures the ZeroMQ message format.

**definition_name** <name> - the name that nginx will use to identify this logger instance.

**format** <format> - the format for the messages. This defines the actual messages sent to the PUB/SUB subscriber. It follows the sames rules as the standard `log_format` directive. It is possible to use nginx variables here, and also to break it over multiple lines.

.. code-block:: nginx

    http {
        log_zmq_format main '{"line1": value,'
                            ' "line2": value}';
    }


log_zmq_off
^^^^^^^^^^^

:Syntax: *log_zmq_off<definition_name>|all*
:Default: *no*
:Context: *location*

Turn off ZeroMQ logging in the current context.

**definition_name** <name> the name of the logger instance to be muted. If the special ``all`` name is used, all logger instances are muted.

.. _log_zmq.installation:

Installation
------------

To build a nginx binary containting this module:

* Download the latest version of this module from :github:`GitHub <sapo/nginx-log-zmq>`.
* Grab the nginx source code from `nginx.org <http://www.nginx.org>`_, for example, version 1.6.2 (see `nginx compatibility <log_zmq.compatibility_>`_), and then build it like so:

.. code-block:: bash

    ./configure --prefix=/usr/local/nginx --add-module=/path/to/nginx-log-zmq

    make
    make install

.. _log_zmq.compatibility:

NGINX Compatibility
-------------------

The following versions of nginx are known to work with this module:

* **1.8.0**
* **1.6.x** (last tested: 1.6.2)
* **1.5.x**
* **1.4.x** (last tested: 1.4.4)

.. _log_zmq.report:

Report Bugs
-----------

Bug reports, wishlists, or patches are welcome. You can submit them on our :github:`GitHub <sapo/nginx-log-zmq>`.

.. _log_zmq.licence:

Copyright & Licence
-------------------

The MIT License (MIT)

Copyright (c) 2014 SAPO - PT Comunicações S.A

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
