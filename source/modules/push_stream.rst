HTTP Push Stream
================

Description
-----------
**nginx-push-stream-module** - A pure stream http push technology for your Nginx setup.

Comet made easy and **really scalable**.

Available on github at :github:`nginx-push-stream-module <wandenberg/nginx-push-stream-module>`

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <push_stream.installation_>`_.



Changelog
---------
Always take a look at :github:`CHANGELOG.textile <wandenberg/nginx-push-stream-module/blob/master/CHANGELOG.textile>` to see what’s new.



Contribute
----------
After you try this module and like it, feel free to 
`give something back <https://www.paypal.com/us/cgi-bin/webscr?cmd=_flow&SESSION=j6q7Fyp4cLjVJZpbBKHSQvJNNKC0BJ-e_KIinYxZwQlqESvriMdPT6HT0_q&dispatch=5885d80a13c0db1f8e263663d3faee8de6030e9239419d79c3f52f70a3ed57ec>`_, 
and help in the maintenance of the project ;)



Status
------
This module is considered production ready.



.. _push_stream.installation:

Installation
------------
You may use ``build.sh`` script inside the project:

.. code-block:: bash

  # clone the project
  git clone http://github.com/wandenberg/nginx-push-stream-module.git
  NGINX_PUSH_STREAM_MODULE_PATH=$PWD/nginx-push-stream-module
  cd nginx-push-stream-module

  # build with 1.0.x, 0.9.x, 0.8.x series
  ./build.sh master 1.0.5
  cd build/nginx-1.0.5

  # install and finish
  sudo make install

  # check
  sudo /usr/local/nginx/sbin/nginx -v
      nginx version: nginx/1.0.5

  # test configuration
  sudo /usr/local/nginx/sbin/nginx -c $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf -t
      the configuration file $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf syntax is ok
      configuration file $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf test is successful

  # run
  sudo /usr/local/nginx/sbin/nginx -c $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf


Or you may do by yourself:

.. code-block:: bash

  # clone the project
  git clone http://github.com/wandenberg/nginx-push-stream-module.git
  NGINX_PUSH_STREAM_MODULE_PATH=$PWD/nginx-push-stream-module

  # get desired nginx version (works with 1.0.x, 0.9.x, 0.8.x series)
  wget http://nginx.org/download/nginx-1.0.5.tar.gz

  # unpack, configure and build
  tar xzvf nginx-1.0.5.tar.gz
  cd nginx-1.0.5
  ./configure --add-module=../nginx-push-stream-module
  make

  # install and finish
  sudo make install

  # check
  sudo /usr/local/nginx/sbin/nginx -v
      nginx version: nginx/1.0.5

  # test configuration
  sudo /usr/local/nginx/sbin/nginx -c $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf -t
      the configuration file $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf syntax is ok
      configuration file $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf test is successful

  # run
  sudo /usr/local/nginx/sbin/nginx -c $NGINX_PUSH_STREAM_MODULE_PATH/misc/nginx.conf



Basic Configuration
-------------------

.. code-block:: nginx

  location /channels-stats {
      # activate channels statistics mode for this location
      push_stream_channels_statistics;

      # query string based channel id
      set $push_stream_channel_id             $arg_id;
  }

  location /pub {
      # activate publisher (admin) mode for this location
      push_stream_publisher admin;

      # query string based channel id
      set $push_stream_channel_id             $arg_id;
  }

  location ~ /sub/(.*) {
      # activate subscriber (streaming) mode for this location
      push_stream_subscriber;

      # positional channel path
      set $push_stream_channels_path              $1;
  }



Basic Usage
-----------
You can feel the flavor right now at the command line. Try using more than one 
terminal and start playing http pubsub:

.. code-block:: bash

  # Pubs
  curl -s -v -X POST 'http://localhost/pub?id=my_channel_1' -d 'Hello World!'
  curl -s -v -X POST 'http://localhost/pub?id=your_channel_1' -d 'Hi everybody!'
  curl -s -v -X POST 'http://localhost/pub?id=your_channel_2' -d 'Goodbye!'

  # Subs
  curl -s -v 'http://localhost/sub/my_channel_1.b20'
  curl -s -v 'http://localhost/sub/your_channel_1.b20'
  curl -s -v 'http://localhost/sub/your_channel_2.b20'

  # Channels Stats for publisher (json format)
  curl -s -v 'http://localhost/pub?id=my_channel_1'

  # All Channels Stats summarized (json format)
  curl -s -v 'http://localhost/channels-stats'

  # All Channels Stats detailed (json format)
  curl -s -v 'http://localhost/channels-stats?id=ALL'

  # Prefixed Channels Stats detailed (json format)
  curl -s -v 'http://localhost/channels-stats?id=your_channel_*'

  # Channels Stats (json format)
  curl -s -v 'http://localhost/channels-stats?id=my_channel_1'

  # Delete Channels
  curl -s -v -X DELETE 'http://localhost/pub?id=my_channel_1'



Variables
---------

push_stream_channel_id
^^^^^^^^^^^^^^^^^^^^^^
:Values: *channel id*
:Location: push_stream_publisher_, push_stream_channels_statistics_

A string to uniquely identify a communication channel. Must be present on 
location of the push_stream_publisher_ and push_stream_channels_statistics_.

.. code-block:: nginx

  set $push_channel_id $arg_id;
  
  #channel id is now the url query string parameter "id"
  #(/pub?id=channel_id_string or /channels-stats?id=channel_id_string)



push_stream_channels_path
^^^^^^^^^^^^^^^^^^^^^^^^^
:Values: *set of channels id and backtrack desired messages*
:Location: push_stream_subscriber_

A string representing a set of channels id and backtrack desired messages 
separated by slash, example */channel1.b3/channel2.b5/channel3.b2*.
The backtrack means the amount of old messages from each of the channels that 
will be delivered to the subscriber. On the example will be 3 messages from 
channel1, 5 from channel2 and 2 from channel3.
Backtrack isn’t needed, you can only sign channels without get old messages, 
or you can mix things.
More accepted examples: */channel1* , */channel1/channel2* , 
*/channel1.b5/channel2* , */channel1/channel2.b6* , …
Must be present on location of the push_stream_subscriber_.

.. code-block:: nginx

  location /sub/(.*) {
    set $push_stream_channels_path $1;
  }
  #channels path is now part of url
  #(/sub/channel_id_string or /sub/channel_id_string.b2/other_channel)



Directives
----------

push_stream_channels_statistics
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_channels_statistics*
:Default: *location*

**release version:** *0.2.0*

Defines a location as a source of statistics. You can use this location to get 
statistics about a specific, group or all channels, in a resumed ou summarized 
way.
To get statistics about all channels in a summarized way you have to make a GET 
in this location without specify a name in the push_stream_channel_id variable.
To get statistics about all channels in a detailed way you have to specify 
“ALL” in the push_stream_channel_id.
To get statistics about prefixed channels in a detailed way you have to specify 
“_prefix_*” in the push_stream_channel_id_.
To get statistics about a channel you have to specify the name in the 
push_stream_channel_id_.

You can get statistics in the formats plain, xml, yaml and json. The default is 
json, to change this behavior you can use **Accept** header parameter passing 
values like “text/plain”, “application/xml”, “application/yaml” and 
“application/json” respectivelly.

.. code-block:: nginx

  location /channels-stats {
      push_stream_channels_statistics;
      set $push_stream_channel_id             $arg_id;
  }

  # /channels-stats -> get statistics about all channels in a summarized way
  # /channels-stats?id=ALL -> get statistics about all channels in a detailed way
  # /channels-stats?id=channel_* -> get statistics about all channels which starts with 'channel_'
  # /channels-stats?id=channel_id -> get statistics about a channel



push_stream_publisher
^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_publisher [ normal | admin ]*
:Default: *normal*
:Context: *location*

Defines a location as a message publisher. Requests to a publisher location are 
treated as messages to be sent to subscribers.
This location supports three http methods:GET, make possible to get statistics 
about the channelPOST, publish a message to the channelDELETE, remove any 
existent stored messages, disconnect any subscriber, and delete the channel. 
Available only if *admin* value is used in this directive.

.. code-block:: nginx

  # normal publisher location
  location /pub {
      push_stream_publisher;
      set $push_stream_channel_id             $arg_id;
  }

  # GET    /pub?id=channel_id -> get statistics about a channel
  # POST   /pub?id=channel_id -> publish a message to the channel

  # admin publisher location
  location /pub_admin {
      push_stream_publisher                   admin;
      set $push_stream_channel_id             $arg_id;
  }

  # GET    /pub_admin?id=channel_id -> get statistics about a channel
  # POST   /pub_admin?id=channel_id -> publish a message to the channel
  # DELETE /pub_admin?id=channel_id -> delete the channel



push_stream_subscriber
^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_subscriber [ streaming | polling |* 
  *long-polling* ``]``
:Default: *streaming*
:Context: *location*

Defines a location as a subscriber. This location represents a subscriber’s 
interface to a channel’s message queue.
This location only supports GET http method to receive published messages.
And has three possible values to set push mode: streaming, polling, 
long-polling. The default values is streaming.
The polling and long-polling modes could be set by the request header 
**X-Nginx-PushStream-Mode** overriding push_stream_subscriber_ directive value.

.. code-block:: nginx

  # streaming subscriber location
  location /sub/(.*) {
      push_stream_subscriber;
      # positional channel path
      set $push_stream_channels_path              $1;
  }

  curl localhost/sub/ch1 -H 'X-Nginx-PushStream-Mode:polling'      #polling request on a streaming location
  curl localhost/sub/ch1 -H 'X-Nginx-PushStream-Mode:long-polling' #long-polling request on a streaming location

  # polling subscriber location
  location /sub/(.*) {
      push_stream_subscriber                      polling;
      # positional channel path
      set $push_stream_channels_path              $1;
  }

  curl localhost/sub/ch1                                           #polling request
  curl localhost/sub/ch1 -H 'X-Nginx-PushStream-Mode:long-polling' #long-polling request on a polling location

  # long polling subscriber location
  location /sub/(.*) {
      push_stream_subscriber                      long-polling;
      # positional channel path
      set $push_stream_channels_path              $1;
  }

  curl localhost/sub/ch1                                           #long-polling request
  curl localhost/sub/ch1 -H 'X-Nginx-PushStream-Mode:polling'      #polling request on a logn-polling location



push_stream_shared_memory_size
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_shared_memory_size size*
:Default: *32M*
:Context: *http*

The size of the memory chunk this module will use to store published messages, 
channels and other shared structures.
When this memory is full any new request for publish a message or subscribe a 
channel will receive an 500 Internal Server Error response.



push_stream_shared_memory_cleanup_objects_ttl
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_shared_memory_cleanup_objects_ttl time*
:Default: *30 seconds*
:Context: *http*

The length of time a message or a channel will stay on garbage collection area 
before it is completly discarded, freeing the shared memory. The minimum length 
is 30 seconds to ensure that no one is using these elements.
This operation is very important to help Nginx recycle memory consumed to 
create messages and channels, so do not use a large time.



push_stream_channel_deleted_message_text
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_channel_deleted_message_text string*
:Default: *"Channel deleted"*
:Context: *http*

**release version:** *0.2.5*

The string used on channel deleted message sent to subscribers when the channel 
is deleted by a publisher.



push_stream_ping_message_text
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_ping_message_text string*
:Default: *none*
:Context: *http*

**release version:** *0.2.5*

The string used on ping message sent to subscribers.



push_stream_message_ttl
^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_message_ttl time*
:Default: *none*
:Context: *http*

The length of time a message may be queued before it is considered expired. If 
you do not want messages to expire, just not set this directive.



push_stream_max_subscribers_per_channel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_max_subscribers_per_channel number*
:Default: *none*
:Context: *http*

The maximum number of subscribers accepted per channel. If you do not want to 
limit number of subscribers access to channels, just not set this directive.



push_stream_max_messages_stored_per_channel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_max_messages_stored_per_channel number*
:Default: *none*
:Context: *http*

The maximum number of messages to store per channel. A channel’s message buffer 
will retain at most this many most recent messages. If you do not want messages 
to be discarded by length, just not set this directive.



push_stream_max_channel_id_length
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_max_channel_id_length number*
:Default: *none*
:Context: *http*

Maximum permissible channel id length (number of characters). Longer ids will 
receive an 400 Bad Request response. If you do not want to limit channel id 
length, just not set this directive.



push_stream_ping_message_interval
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_ping_message_interval time*
:Default: *none*
:Context: *http*

The time interval in which a keepalive message is sent to subscribers. If you 
do not want to send ping messages, just not set this directive.



push_stream_subscriber_connection_ttl
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_subscriber_connection_ttl time*
:Default: *none*
:Context: *http*

The length of time a subscriber will stay connected before it is considered 
expired and disconnected. If you do not want subscribers to be automatically 
disconnected, just not set this directive.
But, this operation is very important to help Nginx recycle memory consumed 
to send messages to susbscriber, allocated at pool request.



push_stream_max_number_of_channels
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_max_number_of_channels number*
:Default: *none*
:Context: *http*

The maximum number of concurrent channels on the server. If you do not want to 
limit the number of channels, just not set this directive.



push_stream_max_number_of_broadcast_channels
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_max_number_of_broadcast_channels number*
:Default: *none*
:Context: *http*

The maximum number of concurrent broadcats channels on the server. If you do 
not want to limit the number of broadcast channels, just not set this 
directive.



push_stream_broadcast_channel_prefix
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_broadcast_channel_prefix string*
:Default: *none*
:Context: *http*

The string prefix used to identify when a channel is a normal or broadcast 
channel, example: when you set this directive as ``bd_``, ``bd_ch1`` will be a 
broadcast channel



push_stream_store_messages
^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_store_messages [ on | off ]*
:Default: *off*
:Context: *location (push_stream_publisher)*

Whether or not message queuing is enabled.
If store messages is “on” is needed to set at least one of these two directives 
push_stream_message_ttl_ or push_stream_max_messages_stored_per_channel_.



push_stream_authorized_channels_only
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_authorized_channels_only [ on | off ]*
:Default: *off*
:Context: *location (push_stream_subscriber)*

Whether or not a subscriber may create a channel by making a request to a 
push_stream_subscriber_ location. If set to on, a publisher must send a POST 
request before a subscriber can request messages on the channel. Otherwise, 
all subscriber requests to nonexistent channels will get a 403 Forbidden 
response.
This restriction is not applied to broadcast channels, but to subscribe to a 
broadcast channel is necessary to subscribe at least to one normal channel, 
and if this directive is set to on this channel has to be created before.



push_stream_header_template
^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_header_template string*
:Default: *none*
:Context: *location (push_stream_subscriber)*

The text that will be sended to subscribers when they arrive.



push_stream_message_template
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_message_template string*
:Default: *~text~*
:Context: *location (push_stream_subscriber)*

The text template that will be used to format the message before be sended to 
subscribers. The template can contain any number of the reserved words: ~id~, 
~text~, ~channel~ and ~event-id~, 
example: "<script>p(~id~,'~channel~','~text~');</script>"



push_stream_footer_template
^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_footer_template string*
:Default: *none*
:Context: *location (push_stream_subscriber)*

**release version:** *0.2.6*

The text that will be sended to subscribers before connection is closed 
(channel deleted ou subscriber timeout).



push_stream_content_type
^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_content_type string*
:Default: *text/plain*
:Context: *location (push_stream_subscriber)*

The content type used on responses to subscribers. Must be complient with 
push_stream_header_template_, push_stream_message_template_ and 
push_stream_footer_template_.



push_stream_broadcast_channel_max_qtd
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_broadcast_channel_max_qtd number*
:Default: *none*
:Context: *location (push_stream_subscriber)*

The maximum number of broadcast channels that a subscriber may sign on the 
request.
This directive works in conjunction with push_stream_authorized_channels_only_ 
to preserve the server from a kind of attack where a subscriber sign one normal 
channel and many nonexistent broadcast channels.



push_stream_keepalive
^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_keepalive [ on | off ]*
:Default: *off*
:Context: *location (push_stream_publisher, push_stream_channels_statistics)*

**release version:** *0.2.4*

Enable keepalive connections, on publisher or channels statistics locations.



push_stream_eventsource_support
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *push_stream_eventsource_support [ on | off ]*
:Default: *off*
:Context: *location (push_stream_subscriber)*

**release version:** *0.3.0*

Enable `Event Source <https://w3c.github.io/eventsource/>`_ support for 
subscribers.



Attention
---------
This module controls everything needed to send the messages to subscribers.
So it disable Nginx’s chuncked filter to reduce memory consumption in streaming 
connections.



Tests
-----
The tests for this module are written in Ruby, and are acceptance tests.
To run them is needed to have an environment with::

  * Basic requirements
    - ruby >= 1.8.7
    - rubygems >= 1.6.2
    - rake >= 0.8.7
  * Required gems
    - POpen4 >= 0.1.4
    - em-http-request >= 0.2.14
    - json >= 1.4.3
    - ruby-debug >= 0.10.4
    - jasmine >= 1.0.2.1
    - nokogiri >= 1.5.0

You can install these gems with bundler (bundler is required to be installed 
before, *gem install bundler*)

.. code-block:: bash

  cd test/
  bundle install --without docs


or individually

.. code-block:: bash

  gem install POpen4 -v 0.1.4
  gem install em-http-request -v 0.2.14
  gem install json -v 1.4.3
  gem install ruby-debug -v 0.10.4
  gem install jasmine -v 1.0.2.1
  gem install nokogiri -v 1.5.0


Then issue ``rake tests``.
This command run the tests using nginx **executable** located at 
*/usr/local/nginx/sbin/nginx* with *1* **worker** responding at 
**host** *localhost* and **port** *9990*.
To change this behavior use the commands bellow

.. code-block:: bash

  rake tests executable="../build/nginx-1.0.5/objs/nginx"   # to change default path for nginx executable
  rake tests host=my_machine                                # to change default hostname
  rake tests port=9889                                      # to change default port
  rake tests workers=2                                      # to change dafault number of workers used


and can combine any of these parameters, like:

.. code-block:: bash

  rake tests port=9889 executable="../build/nginx-1.0.5/objs/nginx"



Discussion
----------
Nginx Push Stream Module 
`Discussion Group <https://groups.google.com/forum/#!forum/nginxpushstream>`_



Contributors
------------
:github:`People <wandenberg/nginx-push-stream-module/contributors>`