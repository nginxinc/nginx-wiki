
.. meta::
   :description: The NGINX Upload Progress module is an implementation of an upload progress system, that monitors RFC1867 POST uploads as they are transmitted to upstream servers.

NGINX Upload Progress Module
============================

**nginx_uploadprogress_module** - an implementation of an upload progress
system, that monitors RFC1867 POST upload as they are transmitted to
upstream servers.

It works by tracking the uploads proxied by NGINX to upstream servers
without analysing the uploaded content and offers a web API to report
upload progress in Javascript, JSON or configurable format. It works
because NGINX acts as an accelerator of an upstream server, storing
uploaded POST content on disk, before transmitting it to the upstream
server. Each individual POST upload request should contain a progress
unique identifier.

The JSON and mechanism idea are based on `Lighttpd's
mod_uploadprogress <http://blog.lighttpd.net/articles/2006/08/01/mod_uploadprogress-is-back>`__

.. note:: This module is not distributed with the NGINX source.


Downloads
^^^^^^^^^

| **Download version**:

`v0.8.4 <https://codeload.github.com/masterzen/nginx-upload-progress-module/legacy.tar.gz/v0.8.4>`_

| **Download version**:

`v0.9.0 <https://codeload.github.com/masterzen/nginx-upload-progress-module/legacy.tar.gz/v0.9.0>`_

| **Source code**:

:github:`masterzen/nginx-upload-progress-module`

.. warning::

   in version 0.9.0 there is **INCOMPATIBLE CHANGE**: JSONP is now the
   default output of the progress probes. If you rely on this module
   serving the deprecated java output use:

   .. code-block:: bash

      upload_progress_java_output

   in the progress probe location.


Installation
^^^^^^^^^^^^

After extracting, add the following option to your NGINX ``./configure``
command:

.. code-block:: bash

     --add-module=path/to/nginx_uploadprogress_module

.. warning::

   When compiled with ``--with-debug``, this module will produce
   high number of log messages.


Directives
^^^^^^^^^^

-  `upload\_progress <#upload_progress>`__
-  `track\_uploads <#track_uploads>`__
-  `report\_uploads <#report_uploads>`__
-  `upload\_progress\_content\_type <#upload_progress_content_type>`__
-  `upload\_progress\_header <#upload_progress_header>`__
-  `upload\_progress\_jsonp\_parameter <#upload_progress_jsonp_parameter>`__
-  `upload\_progress\_json\_output <#upload_progress_json_output>`__
-  `upload\_progress\_jsonp\_output <#upload_progress_jsonp_output>`__
-  `upload\_progress\_template <#upload_progress_template>`__

upload\_progress
----------------
:Syntax: *upload\_progress*
:Default: *n/a*
:Context: *http*

This directive enables the upload progress module and reserve
*zone\_size* bytes to the *zone\_name* which will be used to store the
per-connection tracking information.

track\_uploads
--------------
:Syntax: *track\_uploads*
:Default: *n/a*
:Context: *location*

This directive enables tracking uploads for the current location. Each
POST landing in this location will register the request in the
*zone\_name* upload progress tracker. Since NGINX doesn't support yet
RFC 1867 upload, the location must be a proxy\_pass or fastcgi location.
The POST *must* have a query parameter called *X-Progress-ID* (or an
HTTP header of the same name) whose value is the unique identifier used
to get progress information. If the POST has no such information, the
upload will not be tracked. The tracked connections are kept at most
*timeout* seconds after they have been finished to be able to serve
unseful information to upload progress probes.

.. warning::

   This directive must be the last directive of the location. It must be in a
   proxy\_pass or fastcgi\_pass location. Repeating the directive in a location
   will results in segfaults.

report\_uploads
---------------
:Syntax: *report\_uploads*
:Default: *n/a*
:Context: *location*

This directive allows a location to report the upload progress that is
tracked by `track\_uploads <#track_uploads>`__ for *zone\_name*. The returned document is a
Javascript text with the possible 4 results by default:

-  the upload request hasn't been registered yet or is unknown:

   .. code-block:: javascript

      new Object({ 'state' : 'starting' })

-  the upload request has ended:

   .. code-block:: javascript

      new Object({ 'state' : 'done' })

-  the upload request generated an HTTP error

   .. code-block:: javascript

      new Object({ 'state' : 'error', 'status' : <error code> })

   One error code that can be of use to track for the client is 413
   (request entity too large).

-  the upload request is in progress:

   .. code-block:: javascript

      new Object({ 'state' : 'uploading', 'received' : <size_received>, 'size' : <total_size>})

It is possible to return pure json instead of this javascript (see
`upload\_progress\_json\_output <#upload_progress_json_output>`__). It is also possible to configure
completely the response format with the `upload\_progress\_template <#upload_progress_template>`__ directive.

The HTTP request to this location must have a *X-Progress-ID* parameter
or HTTP header containing a valid unique identifier of an inprogress
upload.

upload\_progress\_content\_type
-------------------------------
:Syntax: *upload\_progress\_content\_type*
:Default: *test/javascript*
:Context: *location*

This directive allows to change the upload progress probe response
content-type.

upload\_progress\_header
------------------------
:Syntax: *upload\_progress\_header*
:Default: *X-Progress-ID*
:Context: *location*

This directive allows to change the header name of the progress ID.

upload\_progress\_jsonp\_parameter
----------------------------------
:Syntax: *upload\_progress\_jsonp\_parameter*
:Default: *callback*
:Context: *location*

This directive allows to change the name of the GET parameter with the
jsonp callback name.

upload\_progress\_json\_output
------------------------------
:Syntax: *upload\_progress\_json\_output*
:Default: *n/a*
:Context: *main,sever,location*

This directive sets everything to output as pure json.

upload\_progress\_jsonp\_output
-------------------------------
:Syntax: *upload\_progress\_jsonp\_output*
:Default: *none*
:Context: *location*

This directive sets everything to output as jsonp (like json output, but
with callback).

upload\_progress\_template
--------------------------
:Syntax: *upload\_progress\_template*
:Default: *n/a*
:Context: *location*

This directive can be used to install a progress response template. The
available list of state is:

-  *starting*
-  *uploading*
-  *error*
-  *done*

NGINX will replace the value of the following variables with their
respective value for the upload:

-  *$uploadprogress\_length:* total size of the upload
-  *$uploadprogress\_received:* what the server has received so far
-  *$uploadprogress\_status:* error code in case of HTTP error
-  *$uploadprogress\_callback:* jsonp callback name if provided as a GET
   query parameter with name **callback**

For instance to return XML (instead of the default Javascript or json):

.. code-block:: nginx

   upload_progress_content_type 'text/xml';
   upload_progress_template starting '<upload><state>starting</state></upload>';
   upload_progress_template uploading '<upload><state>uploading</state>
   <size>$uploadprogress_length</size><uploaded>$uploadprogress_received</uploaded></upload>';
   upload_progress_template done '<upload><state>done</state></upload>';
   upload_progress_template error '<upload><state>error</state>
   <syntaxhighlight>$uploadprogress_status</syntaxhighlight></upload>';

Example of jsonp response:

.. code-block:: json

   upload_progress_template starting "$uploadprogress_callback({ 'state' : 'starting'});";
   upload_progress_template error "$uploadprogress_callback({ 'state' : 'error',
   'status' : $uploadprogress_status });";
   upload_progress_template done "$uploadprogress_callback({ 'state' : 'done'});";
   upload_progress_template uploading "$uploadprogress_callback({ 'state' : 'uploading',
   'received' : $uploadprogress_received, 'size' : $uploadprogress_length });";


Configuration Example
^^^^^^^^^^^^^^^^^^^^^

.. code-block:: nginx

   http {
       # reserve 1MB under the name 'proxied' to track uploads
       upload_progress proxied 1m;

       server {
           listen       127.0.0.1 default;
           server_name  localhost;

           root /path/to/root;

           location / {
               # proxy to upstream server
               proxy_pass http://127.0.0.1;
               proxy_redirect default;

               # track uploads in the 'proxied' zone
               # remember connections for 30s after they finished
               track_uploads proxied 30s;
           }

           location ^~ /progress {
               # report uploads tracked in the 'proxied' zone
               report_uploads proxied;
           }
       }
   }


Usage on pure JavaScript
^^^^^^^^^^^^^^^^^^^^^^^^

(based on Lighttd mod\_uploadprogress module example):

First we need a upload form:

.. code-block:: html

   <form id="upload" enctype="multipart/form-data"
   action="/upload.php" method="post" onsubmit="openProgressBar(); return true;">
     <input type="hidden" name="MAX_FILE_SIZE" value="30000000"  />
     <input name="userfile" type="file" label="fileupload" />
     <input type="submit" value="Send File" />
   </form>

And a progress bar to visualize the progress:

.. code-block:: html

   <div>
    <div id="progress" style="width: 400px; border: 1px solid black">
     <div id="progressbar" style="width: 1px; background-color: black; border: 1px solid white">&nbsp;</div>
    </div>
    <div id="tp">(progress)</div>
   </div>

Then we need to generate the Unique Identifier and launch the upload on
submit action. This also will start the ajax progress report mechanism.

.. code-block:: javascript

    interval = null;

   function openProgressBar() {
    /* generate random progress-id */
    uuid = "";
    for (i = 0; i < 32; i++) {
     uuid += Math.floor(Math.random() * 16).toString(16);
    }
    /* patch the form-action tag to include the progress-id */
    document.getElementById("upload").action="/upload.php?X-Progress-ID=" + uuid;

    /* call the progress-updater every 1000ms */
    interval = window.setInterval(
      function () {
        fetch(uuid);
      },
      1000
    );
   }

   function fetch(uuid) {
    req = new XMLHttpRequest();
    req.open("GET", "/progress", 1);
    req.setRequestHeader("X-Progress-ID", uuid);
    req.onreadystatechange = function () {
     if (req.readyState == 4) {
      if (req.status == 200) {
       /* poor-man JSON parser */
       var upload = eval(req.responseText);

       document.getElementById('tp').innerHTML = upload.state;

       /* change the width if the inner progress-bar */
       if (upload.state == 'done' || upload.state == 'uploading') {
        bar = document.getElementById('progressbar');
        w = 400 * upload.received / upload.size;
        bar.style.width = w + 'px';
       }
       /* we are done, stop the interval */
       if (upload.state == 'done') {
        window.clearTimeout(interval);
       }
      }
     }
    }
    req.send(null);
   }


Usage with jQuery Upload Progress
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You can use jQuery plugin to work with NGINX upload-progress-module -
https://github.com/drogus/jquery-upload-progress (based on it's
documentation).

Some html:

.. code-block:: html

   <form id="upload" enctype="multipart/form-data" action="index.html" method="post">
     <input name="file" type="file"/>
     <input type="submit" value="Upload"/>
   </form>

   <div id="uploading">
     <div id="progress" class="bar">
       <div id="progressbar">&nbsp;</div>
       <div id="percents"></div>
     </div>
   </div>

Then some css:

.. code-block:: css

   .bar {
     width: 300px;
   }

   #progress {
     background: #eee;
     border: 1px solid #222;
     margin-top: 20px;
   }

   #progressbar {
     width: 0px;
     height: 24px;
     background: #333;
   }

And a bit of javascript:

.. code-block:: javascript

   $(function() {
     $('form').uploadProgress({
       /* scripts locations for safari */
       jqueryPath: "../lib/jquery.js",
       uploadProgressPath: "../jquery.uploadProgress.js",

       /* function called each time bar is updated */
       uploading: function(upload) {$('#percents').html(upload.percents+'%');},

       /* selector or element that will be updated */
       progressBar: "#progressbar",

       /* progress reports url */
       progressUrl: "/progress",

       /* how often will bar be updated */
       interval: 2000
     });
   });

If you need to update the progress bar from a different domain or
subdomain (cross domain), like if your upload server is different from
your normal web server, you can try the JSONP protocol, like this:

.. code-block:: json

   $(function() {
     $('form').uploadProgress({
       /* scripts locations for safari */
       jqueryPath: "../lib/jquery.js",
       uploadProgressPath: "../jquery.uploadProgress.js",

       /* function called each time bar is updated */
       uploading: function(upload) {$('#percents').html(upload.percents+'%');},

       /* selector or element that will be updated */
       progressBar: "#progressbar",

       /* progress reports url in a different domain or subdomain from caller */
       progressUrl: "uploads.somewhere.com/progress",

       /* how often will bar be updated */
       interval: 2000,

       /* use json-p for cross-domain call */
       dataType: 'jsonp'
     });
   });

Defaults:

-  *interval:* 2000
-  *progressBar:* "#progressbar"
-  *progressUrl:* "/progress"
-  *start:* function() {}
-  *uploading:* function() {}
-  *complete:* function() {}
-  *success:* function() {}
-  *error:* function() {}
-  *uploadProgressPath:* '/javascripts/jquery.js'
-  *jqueryPath:* '/javascripts/jquery.uploadProgress.js'
-  *dataType:* 'json'


Companion Software
^^^^^^^^^^^^^^^^^^

This software can also work with Valery Kholodkov' NGINX Upload Module:
http://www.grid.net.ru/nginx/upload.en.html
