HTTP Push Stream
================


= Nginx Push Stream Module =

A pure stream http push technology for your Nginx setup.

Comet made easy and '''really scalable'''.

''This module is not distributed with the Nginx source. See [[#instalation|the installation instructions]].''

Available on github at [https://github.com/wandenberg/nginx-push-stream-module nginx_push_stream_module]

= Changelog =

Always take a look at [https://github.com/wandenberg/nginx-push-stream-module/blob/master/CHANGELOG.textile CHANGELOG.textile] to see what’s new.

= Contribute =

After you try this module and like it, feel free to [https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4LP6P9A7BC37S give something back], and help in the maintenance of the project ;)

= Status =

This module is considered production ready.

= Installation =

You may use <code>build.sh</code> script inside the project:
<pre>
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
</pre>

Or you may do by yourself:
<pre>
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
</pre>

= Basic Configuration =
<pre>
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
</pre>

= Basic Usage =

You can feel the flavor right now at the command line. Try using more than
one terminal and start playing http pubsub:
<pre>
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
</pre>

= Variables =

== push_stream_channel_id ==

'''values:''' ''channel id''

'''location:''' ''push_stream_publisher, push_stream_channels_statistics''

A string to uniquely identify a communication channel. Must be present on location of the push_stream_publisher and push_stream_channels_statistics.
<pre>
set $push_channel_id $arg_id;
#channel id is now the url query string parameter "id"
#(/pub?id=channel_id_string or /channels-stats?id=channel_id_string)
</pre>

== push_stream_channels_path ==

'''values:''' ''set of channels id and backtrack desired messages''

'''location:''' ''push_stream_subscriber''

A string representing a set of channels id and backtrack desired messages separated by slash, example ''/channel1.b3/channel2.b5/channel3.b2''.
The backtrack means the amount of old messages from each of the channels that will be delivered to the subscriber. On the example will be 3 messages from channel1, 5 from channel2 and 2 from channel3.
Backtrack isn’t needed, you can only sign channels without get old messages, or you can mix things.
More accepted examples: ''/channel1'' , ''/channel1/channel2'' , ''/channel1.b5/channel2'' , ''/channel1/channel2.b6'' , …
Must be present on location of the push_stream_subscriber.
<pre>
location /sub/(.*) {
  set $push_stream_channels_path $1;
}
#channels path is now part of url
#(/sub/channel_id_string or /sub/channel_id_string.b2/other_channel)
</pre>

= Directives =

== push_stream_channels_statistics ==

'''syntax:''' ''push_stream_channels_statistics''

'''context:''' ''location''

'''release version:''' ''0.2.0''

Defines a location as a source of statistics. You can use this location to get statistics about a specific, group or all channels, in a resumed ou summarized way.
To get statistics about all channels in a summarized way you have to make a GET in this location without specify a name in the push_stream_channel_id variable.
To get statistics about all channels in a detailed way you have to specify “ALL” in the push_stream_channel_id.
To get statistics about prefixed channels in a detailed way you have to specify “_prefix_*” in the push_stream_channel_id.
To get statistics about a channel you have to specify the name in the push_stream_channel_id.

You can get statistics in the formats plain, xml, yaml and json. The default is json, to change this behavior you can use '''Accept''' header parameter passing values like “text/plain”, “application/xml”, “application/yaml” and “application/json” respectivelly.
<pre>
  location /channels-stats {
      push_stream_channels_statistics;
      set $push_stream_channel_id             $arg_id;
  }

  # /channels-stats -> get statistics about all channels in a summarized way
  # /channels-stats?id=ALL -> get statistics about all channels in a detailed way
  # /channels-stats?id=channel_* -> get statistics about all channels which starts with 'channel_'
  # /channels-stats?id=channel_id -> get statistics about a channel
</pre>

== push_stream_publisher ==

'''syntax:''' ''push_stream_publisher [normal | admin]''

'''default:''' ''normal''

'''context:''' ''location''

Defines a location as a message publisher. Requests to a publisher location are treated as messages to be sent to subscribers.
This location supports three http methods:GET, make possible to get statistics about the channelPOST, publish a message to the channelDELETE, remove any existent stored messages, disconnect any subscriber, and delete the channel. Available only if ''admin'' value is used in this directive.
<pre>
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
</pre>

== push_stream_subscriber ==

'''syntax:''' ''push_stream_subscriber [streaming | polling | long-polling]''

'''default:''' ''streaming''

'''context:''' ''location''

Defines a location as a subscriber. This location represents a subscriber’s interface to a channel’s message queue.
This location only supports GET http method to receive published messages.
And has three possible values to set push mode: streaming, polling, long-polling. The default values is streaming.
The polling and long-polling modes could be set by the request header '''X-Nginx-PushStream-Mode''' overriding push_stream_subscriber directive value.
<pre>
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
</pre>

== push_stream_shared_memory_size ==

'''syntax:''' ''push_stream_shared_memory_size size''

'''default:''' ''32M''

'''context:''' ''http''

The size of the memory chunk this module will use to store published messages, channels and other shared structures.
When this memory is full any new request for publish a message or subscribe a channel will receive an 500 Internal Server Error response.

== push_stream_shared_memory_cleanup_objects_ttl ==

'''syntax:''' ''push_stream_shared_memory_cleanup_objects_ttl time''

'''default:''' ''30 seconds''

'''context:''' ''http''

The length of time a message or a channel will stay on garbage collection area before it is completly discarded, freeing the shared memory. The minimum length is 30 seconds to ensure that no one is using these elements.
This operation is very important to help Nginx recycle memory consumed to create messages and channels, so do not use a large time.

== push_stream_channel_deleted_message_text ==

'''syntax:''' ''push_stream_channel_deleted_message_text string''

'''default:''' ''Channel deleted''

'''context:''' ''http''

'''release version:''' ''0.2.5''

The string used on channel deleted message sent to subscribers when the channel is deleted by a publisher.

== push_stream_ping_message_text ==

'''syntax:''' ''push_stream_ping_message_text string''

'''default:''' ''none''

'''context:''' ''http''

'''release version:''' ''0.2.5''

The string used on ping message sent to subscribers.

== push_stream_message_ttl ==

'''syntax:''' ''push_stream_message_ttl time''

'''default:''' ''none''

'''context:''' ''http''

The length of time a message may be queued before it is considered expired. If you do not want messages to expire, just not set this directive.

== push_stream_max_subscribers_per_channel ==

'''syntax:''' ''push_stream_max_subscribers_per_channel number''

'''default:''' ''none''

'''context:''' ''http''

The maximum number of subscribers accepted per channel. If you do not want to limit number of subscribers access to channels, just not set this directive.

== push_stream_max_messages_stored_per_channel ==

'''syntax:''' ''push_stream_max_messages_stored_per_channel number''

'''default:''' ''none''

'''context:''' ''http''

The maximum number of messages to store per channel. A channel’s message buffer will retain at most this many most recent messages. If you do not want messages to be discarded by length, just not set this directive.

== push_stream_max_channel_id_length ==

'''syntax:''' ''push_stream_max_channel_id_length number''

'''default:''' ''none''

'''context:''' ''http''

Maximum permissible channel id length (number of characters). Longer ids will receive an 400 Bad Request response. If you do not want to limit channel id length, just not set this directive.

== push_stream_ping_message_interval ==

'''syntax:''' ''push_stream_ping_message_interval time''

'''default:''' ''none''

'''context:''' ''http''

The time interval in which a keepalive message is sent to subscribers. If you do not want to send ping messages, just not set this directive.

== push_stream_subscriber_connection_ttl ==

'''syntax:''' ''push_stream_subscriber_connection_ttl time''

'''default:''' ''none''

'''context:''' ''http''

The length of time a subscriber will stay connected before it is considered expired and disconnected. If you do not want subscribers to be automatically disconnected, just not set this directive.
But, this operation is very important to help Nginx recycle memory consumed to send messages to susbscriber, allocated at pool request.

== push_stream_max_number_of_channels ==

'''syntax:''' ''push_stream_max_number_of_channels number''

'''default:''' ''none''

'''context:''' ''http''

The maximum number of concurrent channels on the server. If you do not want to limit the number of channels, just not set this directive.

== push_stream_max_number_of_broadcast_channels ==

'''syntax:''' ''push_stream_max_number_of_broadcast_channels number''

'''default:''' ''none''

'''context:''' ''http''

The maximum number of concurrent broadcats channels on the server. If you do not want to limit the number of broadcast channels, just not set this directive.

== push_stream_broadcast_channel_prefix ==

'''syntax:''' ''push_stream_broadcast_channel_prefix string''

'''default:''' ''none''

'''context:''' ''http''

The string prefix used to identify when a channel is a normal or broadcast channel, example: when you set this directive as “bd_”, “bd_ch1” will be a broadcast channel

== push_stream_store_messages ==

'''syntax:''' ''push_stream_store_messages on | off''

'''default:''' ''off''

'''context:''' ''location (push_stream_publisher)''

Whether or not message queuing is enabled.
If store messages is “on” is needed to set at least one of these two directives push_stream_message_ttl or push_stream_max_messages_stored_per_channel.

== push_stream_authorized_channels_only ==

'''syntax:''' ''push_stream_authorized_channels_only on | off''

'''default:''' ''off''

'''context:''' ''location (push_stream_subscriber)''

Whether or not a subscriber may create a channel by making a request to a push_stream_subscriber location. If set to on, a publisher must send a POST request before a subscriber can request messages on the channel. Otherwise, all subscriber requests to nonexistent channels will get a 403 Forbidden response.
This restriction is not applied to broadcast channels, but to subscribe to a broadcast channel is necessary to subscribe at least to one normal channel, and if this directive is set to on this channel has to be created before.

== push_stream_header_template ==

'''syntax:''' ''push_stream_header_template string''

'''default:''' ''none''

'''context:''' ''location (push_stream_subscriber)''

The text that will be sended to subscribers when they arrive.

== push_stream_message_template ==

'''syntax:''' ''push_stream_message_template string''

'''default:''' ''~text~''

'''context:''' ''location (push_stream_subscriber)''

The text template that will be used to format the message before be sended to subscribers. The template can contain any number of the reserved words: ~id~, ~text~, ~channel~ and ~event-id~, example: "<script>p(~id~,'~channel~','~text~');</script>"

== push_stream_footer_template ==

'''syntax:''' ''push_stream_footer_template string''

'''default:''' ''none''

'''context:''' ''location (push_stream_subscriber)''

'''release version:''' ''0.2.6''

The text that will be sended to subscribers before connection is closed (channel deleted ou subscriber timeout).

== push_stream_content_type ==

'''syntax:''' ''push_stream_content_type string''

'''default:''' ''text/plain''

'''context:''' ''location (push_stream_subscriber)''

The content type used on responses to subscribers. Must be complient with push_stream_header_template, push_stream_message_template and push_stream_footer_template.

== push_stream_broadcast_channel_max_qtd ==

'''syntax:''' ''push_stream_broadcast_channel_max_qtd number''

'''default:''' ''none''

'''context:''' ''location (push_stream_subscriber)''

The maximum number of broadcast channels that a subscriber may sign on the request.
This directive works in conjunction with push_stream_authorized_channels_only to preserve the server from a kind of attack where a subscriber sign one normal channel and many nonexistent broadcast channels.

== push_stream_keepalive ==

'''syntax:''' ''push_stream_keepalive on | off''

'''default:''' ''off''

'''context:''' ''location (push_stream_publisher, push_stream_channels_statistics)''

'''release version:''' ''0.2.4''

Enable keepalive connections, on publisher or channels statistics locations.

== push_stream_eventsource_support ==

'''syntax:''' ''push_stream_eventsource_support on | off''

'''default:''' ''off''

'''context:''' ''location (push_stream_subscriber)''

'''release version:''' ''0.3.0''

Enable [http://dev.w3.org/html5/eventsource/ Event Source] support for subscribers.

= Attention =

This module controls everything needed to send the messages to subscribers.
So it disable Nginx’s chuncked filter to reduce memory consumption in streaming connections.

= Tests =

The tests for this module are written in Ruby, and are acceptance tests.
To run them is needed to have an environment with:
<ul><li>Basic requirements
	<ul><li>ruby >= 1.8.7</li>
		<li>rubygems >= 1.6.2</li>
		<li>rake >= 0.8.7</li>
	</ul></li>
	<li>Required gems
	<ul><li>POpen4 >= 0.1.4</li>
		<li>em-http-request >= 0.2.14</li>
		<li>json >= 1.4.3</li>
		<li>ruby-debug >= 0.10.4</li>
		<li>jasmine >= 1.0.2.1</li>
		<li>nokogiri >= 1.5.0</li>
	</ul></li>
</ul>
You can install these gems with bundler (bundler is required to be installed before, ''gem install bundler'')
<pre>
cd test/
bundle install --without docs
</pre>

or individually
<pre>
gem install POpen4 -v 0.1.4
gem install em-http-request -v 0.2.14
gem install json -v 1.4.3
gem install ruby-debug -v 0.10.4
gem install jasmine -v 1.0.2.1
gem install nokogiri -v 1.5.0
</pre>

Then issue <code>rake tests</code>.
This command run the tests using nginx '''executable''' located at ''/usr/local/nginx/sbin/nginx'' with ''1'' '''worker''' responding at '''host''' ''localhost'' and '''port''' ''9990''.
To change this behavior use the commands bellow
<pre>
rake tests executable="../build/nginx-1.0.5/objs/nginx"   # to change default path for nginx executable
rake tests host=my_machine                                # to change default hostname
rake tests port=9889                                      # to change default port
rake tests workers=2                                      # to change dafault number of workers used

and can combine any of these parameters, like:

rake tests port=9889 executable="../build/nginx-1.0.5/objs/nginx"
</pre>

= Discussion =

Nginx Push Stream Module [https://groups.google.com/group/nginxpushstream Discussion Group]

= Contributors =

[https://github.com/wandenberg/nginx-push-stream-module/contributors People]
