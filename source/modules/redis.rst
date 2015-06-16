HTTP Redis
==========

= Download =

Latest version available at http://people.FreeBSD.org/~osa/ngx_http_redis-0.3.7.tar.gz.

= Synopsis =
You can use this module to perform simple caching.  There are plans to extend this module in the near future.

Example configuration
<geshi lang="nginx">
server {
  location / {
    set $redis_key $uri;

    redis_pass     name:6379;
    default_type   text/html;
    error_page     404 = /fallback;
  }

  location = /fallback {
    proxy_pass backend;
  }
}
</geshi>

= Directives =
== redis_pass ==
'''syntax:''' ''redis_pass [ name:port ] ''

'''default:''' ''none''

'''context:''' ''http, server, location''

The backend should set the data in redis.  The redis key is "/uri?args".

== redis_bind ==

'''syntax:''' ''redis_bind [ addr ] ''

'''default:''' ''none''

'''context:''' ''http, server, localtion''

Use the following IP address as the source address for redis connections.

== redis_connect_timeout ==
'''syntax:''' ''redis_connect_timeout [ time ] ''

'''default:''' ''60000''

'''context:''' ''http, server, location''

The timeout for connecting to redis, in milliseconds.

== redis_read_timeout ==
'''syntax:''' ''redis_read_timeout [ time ] ''

'''default:''' ''60000''

'''context:''' ''http, server, location''

The timeout for reading from redis, in milliseconds.

== redis_send_timeout ==
'''syntax:''' ''redis_send_timeout [ time ] ''

'''default:''' ''60000''

'''context:''' ''http, server, location''

The timeout for sending to redis, in milliseconds.

== redis_buffer_size ==
'''syntax:''' ''redis_buffer_size [ size ] ''

'''default:''' see ''getpagesize(2)''

'''context:''' ''http, server, location''

The recv/send buffer size, in bytes.

== redis_next_upstream ==
'''syntax:''' ''redis_next_upstream [ error | timeout | invalid_response | not_found | off ] ''

'''default:''' ''error timeout''

'''context:''' ''http, server, location''

Which failure conditions should cause the request to be forwarded to another upstream server? Applies only when the value in redis_pass is an upstream with two or more servers.

== redis_gzip_flag ==
'''syntax:''' ''redis_gzip_flag [number] ''

'''default:''' ''unset''

'''context:''' ''location''

Reimplementation of memcached_gzip_flag, see http://forum.nginx.org/read.php?29,34332,34463 for details.

= Variables =
== $redis_key ==
The value of the redis key.

== $redis_db ==
The number of redis database (required for < 0.3.4).

For ngx_http_redis >= 0.3.4 is not obligatory, default value is "0" if not defined.

= Keep-alive connections to redis servers =
In 0.3.5 support of keep-alive connection backported from original ngx_http_memcached module of nginx 1.1.4.
For previous versions of nginx you should use following instruction.

You need Maxim Dounin's third party ngx_upstream_keepalive module together with this module for keep-alive TCP connections to your backend redis servers.

Here's a sample configuration:

<geshi lang="nginx">
  http {
    upstream redisbackend {
      server 127.0.0.1:6379;

      # a pool with at most 1024 connections
      # and do not distinguish the servers:
      keepalive 1024 single;
    }

    server {
        ...
        location /redis {
            ...
            redis_pass redisbackend;
        }
    }
  }
</geshi>

= Support =
Please use author's e-mail address for submit bug reports, patches and fixes.

= Author =
Sergey A. Osokin <osa@FreeBSD.ORG.ru>

= See Also =
* [[HttpRedis2Module]] that implements almost the whole Redis 2.0 protocol.
* [[HttpSRCacheModule]] that can be used with this module to do transparent response caching for arbitrary Nginx locations.
* The [http://github.com/agentzh/lua-resty-redis lua-resty-redis] library for [[HttpLuaModule]].
