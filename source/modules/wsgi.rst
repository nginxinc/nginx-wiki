WSGI
====

=Nginx WSGI module=

== Updates ==
This is a copy of the page at http://hg.mperillo.ath.cx/nginx/mod_wsgi/file/tip/README
:Always check that page for updated information.

== ''Important Notes'' ==

: From LoONeYChIKuN:  I was able to successfully get this to compile on '''0.8.30''' and '''0.7.64''' using this [http://www.thechikun.com/depo/patch-mod_wsgi.txt patch].

: From JacobSingh: I tested this against 0.6.23 and it didn't compile.
:: Error was: 
:: rc/ngx_http_wsgi_handler.c: In function 'ngx_http_wsgi_handler':
:: /root/mod_wsgi-8994b058d2db/src/ngx_http_wsgi_handler.c:74: warning: implicit declaration of function 'ngx_http_discard_body'
:: make[1] : *** [objs/addon/src/ngx_http_wsgi_handler.o]  Error 1
:: make[1] : Leaving directory <code>/tmp/src-0.6.32-orig</code>
: Possible Solution 
:: You should change that line to read <code>ngx_http_discard_request_body(</code>

== Introduction ==

mod_wsgi is an implementation of the
[http://www.python.org/dev/peps/pep-0333/ Python Web Server Gateway Interface v1.0]
for the [http://nginx.net Nginx] web server.

Nginx is a fast asynchronous HTTP server.

The design of this software was in part influenced by the mod_wsgi
module for Apache by Graham Dumpleton and obtainable from
http://www.modwsgi.org. This software also contains code from the
Apache mod_wsgi module and is being used here with the permission of
Graham Dumpleton.

==Installation==

mod_wsgi has been tested with Nginx 0.5.34.  Other versions may require patches (see <code>patches/README</code>).

# Download the Nginx sources from http://nginx.net/ and unpack it.
#* The sources of mod_wsgi can be downloaded from:
#** [http://www.selenic.com/mercurial/wiki/ Mercurial repository]: http://hg.mperillo.ath.cx/nginx/mod_wsgi/
#* At the moment there is no stable release, so you need to download the latest revision (*tip*) or the latest *tag*.
#* The *tip* can be downloaded via the Mercurial web interface: 
#** http://hg.mperillo.ath.cx/nginx/mod_wsgi/archive/tip.tar.gz
#* or cloning the repository: 
#** <code>hg clone http://hg.mperillo.ath.cx/nginx/mod_wsgi/</code>
#* The latest *tag* can be found from: http://hg.mperillo.ath.cx/nginx/mod_wsgi/tags
#  Building Nginx
#* change to the directory which contains the Nginx sources
#* run the configuration script making sure to add the path to the mod_wsgi sources using the --add-module option.
#* It is recommended to enable debugging. ::
#** $ ./configure --add-module=/path/to/mod_wsgi/ --with-debug
#* Nginx will use as default prefix path the directory <code>/usr/local/nginx</code>.
#* Now you can build and install the software:
#** $ make
#** $ make install ''(make sure to be root when calling make install)''

mod_wsgi tested with Nginx '''0.8.31''' and python-'''2.6.2'''
# Download the Nginx sources from http://nginx.net/ and unpack it.
#* The sources of mod_wsgi can be downloaded from:
#** [http://www.selenic.com/mercurial/wiki/ Mercurial repository]: http://bitbucket.org/lifeeth/mod_wsgi/
#* You can clone the repository at: <code> hg clone http://bitbucket.org/lifeeth/mod_wsgi/ </code>
# Building instructions same as above.

= Special Cases =

== OSX ==

:If the <code>config</code> script tells you something like this:
<geshi lang="nginx">
:: checking for wsgi ... not found
:: ./configure: error: the WSGI addon requires Python library.
</geshi>

:* Try this patch: http://paste.lisp.org/display/53831/raw:
<geshi lang="nginx">
diff -r a338320b9197 config
--- a/config    Sun Jan 06 15:15:25 2008 +0100
+++ b/config    Tue Jan 08 10:49:11 2008 -0600
@@ -18,7 +18,7 @@ ngx_feature_run=no
ngx_feature_run=no
ngx_feature_incs="#include <Python.h>"
ngx_feature_path=${PYTHON_PATH}
-ngx_feature_libs="-L ${PYTHON_LIBDIR} ${PYTHON_LDFLAGS} -lpython${PYTHON_VERSION}"
+ngx_feature_libs="-L${PYTHON_LIBDIR} ${PYTHON_LDFLAGS} -lpython"
ngx_feature_test="Py_Initialize()"
. auto/feature
</geshi>
::Removing the version number from the lib directive got it to configure on OS X 10.4.

===Examples===

In the mod_wsgi distribution, there are some examples in the
<code>examples</code> directory.

==Design goals of mod_wsgi==
:# make everything as simple as possible, but not simpler.
:# Nginx is not Apache, it is not designed to support generic embedded modules.
:# If a module blocks, the entire application will blocks.
:# This is somewhat mitigated by the fact that Nginx uses an arbitrary number of worker process.
:# Unlike Apache, the number of worker processes in nginx is fixed.

==So why implement a wsgi module for nginx?==
:# The reason is: because writing a module for an existing web server is easier that write a web server from scratch.
:# Nginx is a very efficient web server and its code and memory usage is very compact. 
:# Mod_wsgi can be used for a fast deployment with *batteries included*, as a replacement for the Python standard HTTP server.
:# mod_wsgi can also be used for a robust deployment with mod_proxy, as a replacement for a Python FastCGI implementation like [http://trac.saddi.com/flup flup]
:# In a shared hosting this is valuable, since mod_wsgi usually requires less resources than a pure Python server.

===Future===

:Since Nginx is a *pure* asynchronous server, without threads support, it is important to implement [http://mail.python.org/pipermail/web-sig/2004-October/001005.html WSGI extensions for asynchronous programming]

= Directives =

.. main configuration commands

wsgi_python_optimize
++++++++++++++++++++
:Syntax:   wsgi_python_optimize *n*
:Default:  wsgi_python_optimize 0
:Context:  http, server, location
:Description:
: Directive sets the optimization level of the Python compiler.

: This is equivalent to the <code>-O</code> option of the Python Interpreter.

wsgi_python_executable
++++++++++++++++++++++
:Syntax:   wsgi_python_executable *path*
:Default:
:Context:  http, server, location
:Description:
: Directive sets the path to the python interpreter executable.

: This value is used to find the Python run-time libraries relative
: to the interpreter executable.

wsgi_python_home
++++++++++++++++
:Syntax:   wsgi_python_home *path*
:Default:
:Context:  http, server, location
:Description:
: XXX

wsgi_enable_subinterpreters
+++++++++++++++++++++++++++
:Syntax:   wsgi_enable_subinterpreters *on | off*
:Default:  wsgi_enable_subinterpreters off
:Context:  http, server, location
:Description:
: Directive enables the use of sub interpreters.

: When enabled, each WSGI application will be executed in a separate
: sub interpreter, unless <code>wsgi_use_main_interpreter</code>_ directive is
: used.

**NOTE**: some applications may have problems when executed inside
: a subinterpreter.

.. location configuration commands

wsgi_pass_authorization
+++++++++++++++++++++++
:Syntax:   wsgi_pass_authorization *on | off*
:Default:  wsgi_pass_authorization off
:Context:  http, server, location
:Description:
: By default, as suggested by the CGI spec, mod_wsgi does not pass
: the Authorization header to the WSGI application.

: Enable this directive if the WSGI application handles HTTP
: authentication.

wsgi_allow_ranges
+++++++++++++++++
:Syntax:   wsgi_allow_ranges *on | off*
:Default:  wsgi_allow_ranges off
:Context:  http, server, location
:Description:
: Directive enables integrated support to partial HTTP requests,
: using the nginx range filter module.

**NOTE**: in the current version nginx supports ranges for single
: buffer responses only.

wsgi_script_reloading
+++++++++++++++++++++
:Syntax:   wsgi_script_reloading *on | off*
:Default:  wsgi_script_reloading off
:Context:  http, server, location
:Description:
: If enabled, mod_wsgi will check, at every request, if the WSGI
: script has been modified.

: If the script has been modified, it will reload the application
: using the reload mechanism specified in the
: <code>wsgi_reload_mechanism</code> directive.

wsgi_reload_mechanism
+++++++++++++++++++++
:Syntax:   wsgi_reload_mechanism *module | process*
:Default:  wsgi_script_reloading module
:Context:  http, server, location
:Description:
: This directive specifies how to reload a WSGI application whose
: file has been modified.

: When <code>module</code> mechanism is in use, mod_wsgi will remove the script
: module from the system modules dictionary and will reload it.

: When <code>process</code> mechanism is in use, mod_wsgi will raise a <code>QUIT</code>
: signal.
: This signal will request Nginx to do a graceful shutdown of the
: process (see the Nginx documentation for detailed info).
: The current request is served using the *old* WSGI application, but
: mod_wsgi will add a <code>Refresh: 0</code> header, so that clients that
: recognize this header can execute a new request to obtain the
: updated resource.

**NOTE**:
: it is possible to reload a WSGI application by sending a
: <code>HUP</code> signal to the master process.

: See http://wiki.codemongers.com/NginxCommandLine for more info.

**WARNING**: if the master process is not active, the Nginx process
: will be terminated.

wsgi_optimize_send_headers
++++++++++++++++++++++++++
:Syntax:   wsgi_optimize_send_headers *on | off*
:Default:  wsgi_optimize_send_headers off
:Context:  http, server, location
:Description:
: Directive enables to optimize away content generation, when HTTP
: request does not requires a response body (as an example for HEAD
: request, or for a GET request when the client has a fresh cache of
: the resource entity).

: For an effective use of this optimization, the WSGI application
: must return a generator and yield an empty string after having
: called start_response.

**NOTE**: WSGI spec explicitly requires that the headers must be
: sent when the first not empty string is yielded.

wsgi_output_buffering
+++++++++++++++++++++
:Syntax:   wsgi_output_buffering *on | off*
:Default:  wsgi_output_buffering off
:Context: http, server, location
:Description:
: When output buffering is enabled, Nginx can buffer the data yielded
: by the WSGI application iterable.

: This increments the performance, especially if the application yield
: small strings.

: Note however that the WSGI spec recommend that the buffering should
: be done by the application and not by the gateway.

**BUG**: there seems to be problems when this directive is enabled.

wsgi_write_buffering
+++++++++++++++++++++
:Syntax:   wsgi_write_buffering *on | off*
:Default:  wsgi_write_buffering off
:Context: http, server, location
:Description:
: This directive activates buffering of the <code>write</code> callable.

: If buffering is activated, then mod_wsgi will store all the data
: written by the WSGI application in a buffer, assigned by directive
: wsgi_write_buffer_size.

: The headers will be sent only when the WSGI application returns.

: If the data can not all be placed in memory, then parts of it will
: be written to disk.

: If buffering is switched off, then the data is *synchronously*
: transferred to client immediately.

**NOTE**: WSGI explicitly requires that the WSGI gateway **must**
: not buffer the data.

**NOTE**: sending data synchronously can have a severe impact on
: nginx performances.

wsgi_write_buffer_size
++++++++++++++++++++++
:Syntax:   wsgi_write_buffer_size *buffer_size*
:Default:  wsgi_write_buffer_size 4k/8k
:Context: http, server, location
:Description:
: This directive controls the size of the buffer to use.

: By default, the size of the buffer is equal to the size of
: page. Depending on platform this is either 4K or 8K.

wsgi_temp_path
++++++++++++++
:Syntax:   wsgi_temp_path *dir-path [ level1 [ level2 [ level3 ]     *
:Default:  $NGX_PREFIX/wsgi_temp controlled by NGX_HTTP_WSGI_TEMP_PATH in configure script
:Context: http, server, location
:Description:
: This directive works like <code>client_body_temp_path</code> to specify a
: location to buffer large data generated by the <code>write callable</code>, if
: <code>wsgi_write_buffering</code> is enabled.

wsgi_var
++++++++
:Syntax:   wsgi_var *variable value*
:Default:
:Context: http, server, location
:Description:
: Directive assigns the variable, which will be added to the
: environment dictionary passed to the WSGI application.

: It is possible to use strings, nginx variables and their
: combination as values. Directives not set are inherited from the
: outer level.

**NOTE**:
: variables defined using this directive are added to the
: environment dictionary after HTTP headers, so user can override
: these values.

: It can be useful, as an example, to override HTTP_COOKIE with: ::

: wsgi_var HTTP_COOKIE  $http_cookie;

: since the <code>$http_cookie</code> variable combines multiple Cookie headers.

wsgi_use_main_interpreter
+++++++++++++++++++++++++
:Syntax:   wsgi_use_main_interpreter *on | off*
:Default:  wsgi_use_main_interpreter off
:Context: http, server, location
:Description:
: Directive enables the execution of the WSGI application using the
: main Python interpreter.

: This directive is only used when <code>wsgi_enable_subinterpreters</code>_
: directive is enabled.

wsgi_middleware
+++++++++++++++
:Syntax:   wsgi_middleware *module_name [callable_name] *
:Default:  wsgi_pass module_name "middleware"
:Context:  http, server, location
:Description:
: Directive push the specified middleware in the middleware stack.

wsgi_pass
+++++++++
:Syntax:   wsgi_pass *module_path [callable_name] *
:Default:  wsgi_pass module_path "application"
:Context:  location, if in location, limit_except
:Description:
: Directive assigns the module path and the callable name of the WSGI
: application to execute.
