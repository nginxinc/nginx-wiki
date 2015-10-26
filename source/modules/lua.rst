
.. meta::
   :description: The Lua module embeds Lua into NGINX and by leveraging NGINX's subrequests, allows the integration of Lua threads into the NGINX event model.

Lua
===

This document has been move to :github:`openresty/lua-nginx-module#readme`

Name
----

See :github:`openresty/lua-nginx-module#name`

Status
------

See :github:`openresty/lua-nginx-module#status`

Version
-------

See :github:`openresty/lua-nginx-module#version`

Synopsis
--------

See :github:`openresty/lua-nginx-module#synopsis`

Description
-----------

See :github:`openresty/lua-nginx-module#description`

Typical Uses
------------

See :github:`openresty/lua-nginx-module#typical-uses`

NGINX Compatibility
-------------------

See :github:`openresty/lua-nginx-module#nginx-compatibility`

Installation
------------

See :github:`openresty/lua-nginx-module#installation`

C Macro Configurations
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#c-macro-configurations`

Installation on Ubuntu 11.10
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#installation-on-ubuntu-1110`

Community
---------

See :github:`openresty/lua-nginx-module#community`

English Mailing List
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#english-mailing-list`

Chinese Mailing List
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#chinese-mailing-list`

Source Repository
-----------------

See :github:`openresty/lua-nginx-module#source-repository`

Bugs and Patches
----------------

See :github:`openresty/lua-nginx-module#bugs-and-patches`

Lua/LuaJIT bytecode support
---------------------------

See :github:`openresty/lua-nginx-module#lualuajit-bytecode-support`

System Environment Variable Support
-----------------------------------

See :github:`openresty/lua-nginx-module#system-environment-variable-support`

HTTP 1.0 support
---------------- 

See :github:`openresty/lua-nginx-module#http-10-support`

Statically Linking Pure Lua Modules
-----------------------------------

See :github:`openresty/lua-nginx-module#statically-linking-pure-lua-modules`

Data Sharing within an NGINX Worker
-----------------------------------

See :github:`openresty/lua-nginx-module#data-sharing-within-an-nginx-worker`

Known Issues
------------

See :github:`openresty/lua-nginx-module#known-issues`

TCP socket connect operation issues
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcp-socket-connect-operation-issues`

Lua Coroutine Yielding/Resuming
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua-coroutine-yieldingresuming`

Lua Variable Scope
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua-variable-scope`

Locations Configured by Subrequest Directives of Other Modules
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#locations-configured-by-subrequest-directives-of-other-modules`

Cosockets Not Available Everywhere
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#cosockets-not-available-everywhere`

Special Escaping Sequences
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#special-escaping-sequences`

Mixing with SSI Not Supported
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#mixing-with-ssi-not-supported`

SPDY Mode Not Fully Supported
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#spdy-mode-not-fully-supported`

Missing data on short circuited requests
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#missing-data-on-short-circuited-requests`

TODO
----

See :github:`openresty/lua-nginx-module#todo`

Changes
-------

See :github:`openresty/lua-nginx-module#changes`

Test Suite
----------

See :github:`openresty/lua-nginx-module#test-suite`

Copyright and License
---------------------

See :github:`openresty/lua-nginx-module#copyright-and-license`

See Also
--------

See :github:`openresty/lua-nginx-module#see-also`

Directives
----------

See :github:`openresty/lua-nginx-module#directives`

lua_use_default_type
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_use_default_type`

lua_code_cache
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_code_cache`

lua_regex_cache_max_entries
^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_regex_cache_max_entries`

lua_regex_match_limit
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_regex_match_limit`

lua_package_path
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_package_path`

lua_package_cpath
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_package_cpath`

init_by_lua
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#init_by_lua`

init_by_lua_file
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#init_by_lua_file`

init_worker_by_lua
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#init_worker_by_lua`

init_worker_by_lua_file
^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#init_worker_by_lua_file`

set_by_lua
^^^^^^^^^^

See :github:`openresty/lua-nginx-module#set_by_lua`

set_by_lua_file
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#set_by_lua_file`

content_by_lua
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#content_by_lua`

content_by_lua_file
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#content_by_lua_file`

rewrite_by_lua
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#rewrite_by_lua`

rewrite_by_lua_file
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#rewrite_by_lua_file`

access_by_lua
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#access_by_lua`

access_by_lua_file
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#access_by_lua_file`

header_filter_by_lua
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#header_filter_by_lua`

header_filter_by_lua_file
^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#header_filter_by_lua_file`

body_filter_by_lua
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#body_filter_by_lua`

body_filter_by_lua_file
^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#body_filter_by_lua_file`

log_by_lua
^^^^^^^^^^

See :github:`openresty/lua-nginx-module#log_by_lua`

log_by_lua_file
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#log_by_lua_file`

lua_need_request_body
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_need_request_body`

lua_shared_dict
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_shared_dict`

lua_socket_connect_timeout
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_connect_timeout`

lua_socket_send_timeout
^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_send_timeout`

lua_socket_send_lowat
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_send_lowat`

lua_socket_read_timeout
^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_read_timeout`

lua_socket_buffer_size
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_buffer_size`

lua_socket_pool_size
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_pool_size`

lua_socket_keepalive_timeout
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_keepalive_timeout`

lua_socket_log_errors
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_socket_log_errors`

lua_ssl_ciphers
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_ssl_ciphers`

lua_ssl_crl
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_ssl_crl`

lua_ssl_protocols
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_ssl_protocols`

lua_ssl_trusted_certificate
^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_ssl_trusted_certificate`

lua_ssl_verify_depth
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_ssl_verify_depth`

lua_http10_buffering
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_http10_buffering`

rewrite_by_lua_no_postpone
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#rewrite_by_lua_no_postpone`

lua_transform_underscores_in_response_headers
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_transform_underscores_in_response_headers`

lua_check_client_abort
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_check_client_abort`

lua_max_pending_timers
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_max_pending_timers`

lua_max_running_timers
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#lua_max_running_timers`

NGINX API for Lua
-----------------

See :github:`openresty/lua-nginx-module#nginx-api-for-lua`

Introduction
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#introduction`

ngx.arg
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxarg`

ngx.var.VARIABLE
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxvarvariable`

Core constants
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#core-constants`

HTTP method constants
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#http-method-constants`

HTTP status constants
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#http-status-constants`

NGINX log level constants
^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#nginx-log-level-constants`

print
^^^^^

See :github:`openresty/lua-nginx-module#print`

ngx.ctx
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxctx`

ngx.location.capture
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxlocationcapture`

ngx.location.capture_multi
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxlocationcapture_multi`

ngx.status
^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxstatus`

ngx.header.HEADER
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxheaderheader`

ngx.resp.get_headers
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxrespget_headers`

ngx.req.start_time
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqstart_time`

ngx.req.http_version
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqhttp_version`

ngx.req.raw_header
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqraw_header`

ngx.req.get_method
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_method`

ngx.req.set_method
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_method`

ngx.req.set_uri
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_uri`

ngx.req.set_uri_args
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_uri_args`

ngx.req.get_uri_args
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_uri_args`

ngx.req.get_post_args
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_post_args`

ngx.req.get_headers
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_headers`

ngx.req.set_header
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_header`

ngx.req.clear_header
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqclear_header`

ngx.req.read_body
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqread_body`

ngx.req.discard_body
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqdiscard_body`

ngx.req.get_body_data
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_body_data`

ngx.req.get_body_file
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqget_body_file`

ngx.req.set_body_data
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_body_data`

ngx.req.set_body_file
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqset_body_file`

ngx.req.init_body
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqinit_body`

ngx.req.append_body
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqappend_body`

ngx.req.finish_body
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqfinish_body`

ngx.req.socket
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxreqsocket`

ngx.exec
^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxexec`

ngx.redirect
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxredirect`

ngx.send_headers
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsend_headers`

ngx.headers_sent
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxheaders_sent`

ngx.print
^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxprint`

ngx.say
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsay`

ngx.log
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxlog`

ngx.flush
^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxflush`

ngx.exit
^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxexit`

ngx.eof
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxeof`

ngx.sleep
^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsleep`

ngx.escape_uri
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxescape_uri`

ngx.unescape_uri
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxunescape_uri`

ngx.encode_args
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxencode_args`

ngx.decode_args
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxdecode_args`

ngx.encode_base64
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxencode_base64`

ngx.decode_base64
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxdecode_base64`

ngx.crc32_short
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxcrc32_short`

ngx.crc32_long
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxcrc32_long`

ngx.hmac_sha1
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxhmac_sha1`

ngx.md5
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxmd5`

ngx.md5_bin
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxmd5_bin`

ngx.sha1_bin
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsha1_bin`

ngx.quote_sql_str
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxquote_sql_str`

ngx.today
^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxtoday`

ngx.time
^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxtime`

ngx.now
^^^^^^^

See :github:`openresty/lua-nginx-module#ngxnow`

ngx.update_time
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxupdate_time`

ngx.localtime
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxlocaltime`

ngx.utctime
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxutctime`

ngx.cookie_time
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxcookie_time`

ngx.http_time
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxhttp_time`

ngx.parse_http_time
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxparse_http_time`

ngx.is_subrequest
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxis_subrequest`

ngx.re.match
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxrematch`

ngx.re.find
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxrefind`

ngx.re.gmatch
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxregmatch`

ngx.re.sub
^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxresub`

ngx.re.gsub
^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxregsub`

ngx.shared.DICT
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddict`

ngx.shared.DICT.get
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictget`

ngx.shared.DICT.get_stale
^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictget_stale`

ngx.shared.DICT.set
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictset`

ngx.shared.DICT.safe_set
^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictsafe_set`

ngx.shared.DICT.add
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictadd`

ngx.shared.DICT.safe_add
^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictsafe_add`

ngx.shared.DICT.replace
^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictreplace`

ngx.shared.DICT.delete
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictdelete`

ngx.shared.DICT.incr
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictincr`

ngx.shared.DICT.flush_all
^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictflush_all`

ngx.shared.DICT.flush_expired
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictflush_expired`

ngx.shared.DICT.get_keys
^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxshareddictget_keys`

ngx.socket.udp
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsocketudp`

udpsock:setpeername
^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#udpsocksetpeername`

udpsock:send
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#udpsocksend`

udpsock:receive
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#udpsockreceive`

udpsock:close
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#udpsockclose`

udpsock:settimeout
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#udpsocksettimeout`

ngx.socket.tcp
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsockettcp`

tcpsock:connect
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsockconnect`

tcpsock:sslhandshake
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsocksslhandshake`

tcpsock:send
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsocksend`

tcpsock:receive
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsockreceive`

tcpsock:receiveuntil
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsockreceiveuntil`

tcpsock:close
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsockclose`

tcpsock:settimeout
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsocksettimeout`

tcpsock:setoption
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsocksetoption`

tcpsock:setkeepalive
^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsocksetkeepalive`

tcpsock:getreusedtimes
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#tcpsockgetreusedtimes`

ngx.socket.connect
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxsocketconnect`

ngx.get_phase
^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxget_phase`

ngx.thread.spawn
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxthreadspawn`

ngx.thread.wait
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxthreadwait`

ngx.thread.kill
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxthreadkill`

ngx.on_abort
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxon_abort`

ngx.timer.at
^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxtimerat`

ngx.config.debug
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxconfigdebug`

ngx.config.prefix
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxconfigprefix`

ngx.config.nginx_version
^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxconfignginx_version`

ngx.config.nginx_configure
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxconfignginx_configure`

ngx.config.ngx_lua_version
^^^^^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxconfigngx_lua_version`

ngx.worker.exiting
^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxworkerexiting`

ngx.worker.pid
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ngxworkerpid`

ndk.set_var.DIRECTIVE
^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#ndkset_vardirective`

coroutine.create
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutinecreate`

coroutine.resume
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutineresume`

coroutine.yield
^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutineyield`

coroutine.wrap
^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutinewrap`

coroutine.running
^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutinerunning`

coroutine.status
^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#coroutinestatus`

Obsolete Sections
-----------------

See :github:`openresty/lua-nginx-module#obsolete-sections`

Special PCRE Sequences
^^^^^^^^^^^^^^^^^^^^^^

See :github:`openresty/lua-nginx-module#special-pcre-sequences`

