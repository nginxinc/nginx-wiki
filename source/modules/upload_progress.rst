Upload Progress
===============

= Nginx Upload Progress Module =

''Note: this module is not distributed with the Nginx source.''

nginx_uploadprogress_module is an implementation of an upload progress system, that monitors
RFC1867 POST upload as they are transmitted to upstream servers.

It works by tracking the uploads proxied by Nginx to upstream servers without 
analysing the uploaded content and offers a web API to report upload progress in Javascript, JSON or configurable format.
It works because Nginx acts as an accelerator of an upstream server, storing uploaded POST content
on disk, before transmitting it to the upstream server. Each individual POST upload request
should contain a progress unique identifier.

The JSON and mechanism idea are based on [http://blog.lighttpd.net/articles/2006/08/01/mod_uploadprogress-is-back Lighttpd's mod_uploadprogress]

= Downloads =

'''Download version''': [https://github.com/masterzen/nginx-upload-progress-module/tarball/v0.8.4 v0.8.4] <br>
'''Source code''': http://github.com/masterzen/nginx-upload-progress-module/tree/master


'''Download version''': [https://github.com/masterzen/nginx-upload-progress-module/tarball/v0.9.0 v0.9.0] <br>
'''Source code''': http://github.com/masterzen/nginx-upload-progress-module/tree/master

'''WARNING''' - in version 0.9.0 there is '''INCOMPATIBLE CHANGE''':
JSONP is now the default output of the progress probes. If you rely on this module serving the deprecated java output use:<pre>upload_progress_java_output</pre>in the progress probe location.

= Installation = 

After extracting, add the following option to your Nginx ./configure command:

<pre>
  --add-module=path/to/nginx_uploadprogress_module
</pre>

'''WARNING''':
When compiled with --with-debug, this module will produce high number of log messages.

= Directives =
* [[#upload_progress|upload_progress]]
* [[#track_uploads|track_uploads]]
* [[#report_uploads|report_uploads]]
* [[#upload_progress_content_type|upload_progress_content_type]]
* [[#upload_progress_header|upload_progress_header]]
* [[#upload_progress_jsonp_parameter|upload_progress_jsonp_parameter]]
* [[#upload_progress_json_output|upload_progress_json_output]]
* [[#upload_progress_jsonp_output|upload_progress_jsonp_output]]
* [[#upload_progress_template|upload_progress_template]]

== upload_progress ==
'''syntax:''' ''upload_progress <zone_name> <zone_size>''

'''default:''' ''n/a''

'''context:''' ''http''

This directive enables the upload progress module and reserve ''zone_size'' bytes to the ''zone_name'' which will be used to store the per-connection tracking information.

== track_uploads ==
'''syntax:''' ''track_uploads <zone_name> <timeout>''

'''default:''' ''n/a''

'''context:''' ''location''

This directive enables tracking uploads for the current location. Each POST landing in this location will register the request in the ''zone_name'' upload progress tracker.
Since Nginx doesn't support yet RFC 1867 upload, the location must be a proxy_pass or fastcgi location.
The POST ''must'' have a query parameter called ''X-Progress-ID'' (or an HTTP header of the same name) whose value is the unique identifier used to get progress information. If the POST has no such information, the upload will not be tracked.
The tracked connections are kept at most ''timeout'' seconds after they have been finished to be able to serve unseful information to upload progress probes.
'''WARNING''': this directive must be the last directive of the location. It must be in a proxy_pass or fastcgi_pass location. Repeating the directive in a location will results in segfaults.

== report_uploads ==
'''syntax:''' ''report_uploads <zone_name>''

'''default:''' ''n/a''

'''context:''' ''location''

This directive allows a location to report the upload progress that is tracked by track_uploads for ''zone_name''.
The returned document is a Javascript text with the possible 4 results by default:
* the upload request hasn't been registered yet or is unknown:
<pre>
new Object({ 'state' : 'starting' })
</pre>
* the upload request has ended:
<pre>
new Object({ 'state' : 'done' })
</pre>
* the upload request generated an HTTP error
<pre>
new Object({ 'state' : 'error', 'status' : <error code> })
</pre>
One error code that can be of use to track for the client is 413 (request entity too large).
* the upload request is in progress:
<pre>
new Object({ 'state' : 'uploading', 'received' : <size_received>, 'size' : <total_size>})
</pre>
It is possible to return pure json instead of this javascript (see upload_progress_json_output).
It is also possible to configure completely the response format with the directive: ''upload_progress_template''

The HTTP request to this location must have a ''X-Progress-ID'' parameter or HTTP header containing a valid unique identifier of an inprogress upload.

== upload_progress_content_type ==
'''syntax:''' ''upload_progress_content_type <content_type>''

'''default:''' ''test/javascript''

'''context:''' ''location''

This directive allows to change the upload progress probe response content-type.

== upload_progress_header ==
'''syntax:''' ''upload_progress_header <progress-id>''

'''default:''' ''X-Progress-ID''

'''context:''' ''location''

This directive allows to change the header name of the progress ID.

== upload_progress_jsonp_parameter ==
'''syntax:''' ''upload_progress_jsonp_parameter <callback_parameter>''

'''default:''' ''callback''

'''context:''' ''location''

This directive allows to change the name of the GET parameter with the jsonp callback name.

== upload_progress_json_output ==
'''syntax:''' ''upload_progress_json_output''

'''default:''' ''n/a''

'''context:''' ''main,sever,location''

This directive sets everything to output as pure json.

== upload_progress_jsonp_output ==
'''syntax:''' ''upload_progress_jsonp_output''

'''default:''' ''none''

'''context:''' ''location''

This directive sets everything to output as jsonp (like json output, but with callback).

== upload_progress_template ==
'''syntax:''' ''upload_progress_template <state> <template>''

'''default:''' ''n/a''

'''context:''' ''location''

This directive can be used to install a progress response template. The available list of state is:
* ''starting''
* ''uploading''
* ''error''
* ''done''

Nginx will replace the value of the following variables with their respective value for the upload:
* ''$uploadprogress_length:'' total size of the upload
* ''$uploadprogress_received:'' what the server has received so far
* ''$uploadprogress_status:'' error code in case of HTTP error
* ''$uploadprogress_callback:'' jsonp callback name if provided as a GET query parameter with name '''callback'''

For instance to return XML (instead of the default Javascript or json):

<pre>
upload_progress_content_type 'text/xml';
upload_progress_template starting '<upload><state>starting</state></upload>';
upload_progress_template uploading '<upload><state>uploading</state>
<size>$uploadprogress_length</size><uploaded>$uploadprogress_received</uploaded></upload>';
upload_progress_template done '<upload><state>done</state></upload>';
upload_progress_template error '<upload><state>error</state>
<code>$uploadprogress_status</code></upload>';
</pre>

Example of jsonp response:
<pre>
upload_progress_template starting "$uploadprogress_callback({ 'state' : 'starting'});";
upload_progress_template error "$uploadprogress_callback({ 'state' : 'error',
'status' : $uploadprogress_status });";
upload_progress_template done "$uploadprogress_callback({ 'state' : 'done'});";
upload_progress_template uploading "$uploadprogress_callback({ 'state' : 'uploading',
'received' : $uploadprogress_received, 'size' : $uploadprogress_length });";
</pre>

= Configuration Example =

<pre>
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
</pre>

= Usage on pure JavaScript =

(based on Lighttd mod_uploadprogress module example):

First we need a upload form:

<pre>
<form id="upload" enctype="multipart/form-data"
action="/upload.php" method="post" onsubmit="openProgressBar(); return true;">
  <input type="hidden" name="MAX_FILE_SIZE" value="30000000"  />
  <input name="userfile" type="file" label="fileupload" />
  <input type="submit" value="Send File" />
</form>
</pre>

And a progress bar to visualize the progress:

<pre>
<div>
 <div id="progress" style="width: 400px; border: 1px solid black">
  <div id="progressbar" style="width: 1px; background-color: black; border: 1px solid white">&nbsp;</div>
 </div>
 <div id="tp">(progress)</div>
</div>
</pre>
Then we need to generate the Unique Identifier and launch the upload on submit
action. This also will start the ajax progress report mechanism.

<pre>
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
</pre>

= Usage with jQuery Upload Progress =

You can use jQuery plugin to work with Nginx upload-progress-module - https://github.com/drogus/jquery-upload-progress
(based on it's documentation).

Some html:
<pre>
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
</pre>

Then some css:
<pre>
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
</pre>

And a bit of javascript:

<pre>
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
</pre>

If you need to update the progress bar from a different domain or subdomain (cross domain), like if your upload server is different from your normal web server, you can try the JSONP protocol, like this:

<pre>
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
</pre>

Defaults:

* ''interval:'' 2000
* ''progressBar:'' "#progressbar"
* ''progressUrl:'' "/progress"
* ''start:'' function() {}
* ''uploading:'' function() {}
* ''complete:'' function() {}
* ''success:'' function() {}
* ''error:'' function() {}
* ''uploadProgressPath:'' '/javascripts/jquery.js'
* ''jqueryPath:'' '/javascripts/jquery.uploadProgress.js'
* ''dataType:'' 'json'

= Companion Software =

This software can also work with Valery Kholodkov' Nginx Upload Module:
http://www.grid.net.ru/nginx/upload.en.html

You can also use the following javascript libraries client side:
http://drogomir.com/blog/2008/6/30/upload-progress-script-with-safari-support
