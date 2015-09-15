
.. meta::
   :description: The Secure Download module enables you to create links which are only valid until a certain datetime is reached.

Secure Download
===============

Description
-----------
**ngx_http_secure_download_module** - a module that enables you to create links which are only valid until a certain datetime is reached. The way it works is similar to lightttpd's mod_secdownload, but not exactly same. 



Directives
----------

secure_download
^^^^^^^^^^^^^^^
:Syntax: *secure_download [ on | off ]*
:Default: *off*
:Context: *location*

This can turn the module on/off.


secure_download_secret
^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *secure_download_secret <secret string>*
:Default: *none*
:Context: *location*

Defines the string which is included in the md5 hash. It can also contain variables.


secure_download_path_mode
^^^^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *secure_download_path_mode [ file | folder ]*
:Default: *folder*
:Context: *location*

This defines if the md5 hash has to be done for the full path, including filename, or just the folders which contain the file, without the filename. Depending on this your link will be valid either for a whole directory, or only for one file.

.. note:: The way this works is simply that if you specify ``folder``, it will drop the last part of the accessed path and to the hash on the rest. This means that if you use a path which doesn't specify a filename, because you maybe want to access the index.html or you rely on some rewriting, you better specify ``file`` to make it match the full path.

Variables
---------

$secure_download
^^^^^^^^^^^^^^^^
This variable contains the result of the request URL validation process. It always contains a number and can have the following possible values:

- ">0": link is valid and the value is the amount of seconds until it expires
- "-1": the timestamp is expired
- "-2": the md5 hash is wrong
- "-3": other problem like f.e. parsing problem or module config problem



Explanation
-----------

The theory
^^^^^^^^^^
A generated URI must have the following format::

  <real_path>/<md5_hash>/<expiration_timestamp>

the md5 hash gets generated out of the following string::

  <real_path>/<secret (user supplied)>/<expiration_timestamp>

* ``real_path`` can be either the path of the file which you want to access or the folder which contains the file, which of those two has to be defined in the NGINX config
* ``secret`` is some random string which must be known by the NGINX config and by the link generating script
* ``expiration_timestamp`` is a unix_timestamp (seconds since beginning of 1970) in hexadecimal forma


By example
^^^^^^^^^^
Lets say you have a file in your document root under the path ``/somefolder/protected.html``. Now you want to generate a link which expires in 20 minutes, so you do following:

* Get the current timestamp, for example from http://www.unixtimestamp.com/index.php. In this example our timestamp would be ``1240928342``
* Convert the timestamp into hex, like for example https://www.easycalculation.com/decimal-converter.php does. Our timestamp in hex is ``49F71056``
* Now you need to decide for a secret string. It needs to be set in the NGINX config with the parameter secure_download_secret_. For example "privatestring"
* Then you put the following string together ``/somefolder/protected.html/privatestring/49F71056`` which consists of ``<real path/secret string/timestamp in hex``
* Now you need to create an md5 hash of that string which we put together. The resulting md5 should be ``f901b5272c17b456fabf49c3e9bcc120``
* ok, you got everything you need, now you just have to put it together in the format ``<real_path>/<md5>/<timestamp>`` in our example this would look like ``/somefolder/protected.html/f901b5272c17b456fabf49c3e9bcc120/49F71056``
* thats it, now you got your link which is only valid until the included timestamp gets reached

Now your config could look like following:

.. code-block:: nginx

  location /somefolder {
      secure_download on;
      secure_download_secret IAmSalt$remote_addr;
      secure_download_path_mode file;
      
      if ($secure_download = "-1") {
          rewrite /expired.html break;
      }
      if ($secure_download = "-2") {
          rewrite /bad_hash.html break;
      }
      if ($secure_download = "-3") {
          return 500;
      }

      rewrite ^(.*)/[0-9a-zA-Z]*/[0-9a-zA-Z]*$ $1 break; // crop all the /hash/time stuff off the url
  }

OR:

.. code-block:: nginx

  location /secured {
      secure_download on; 
      secure_download_path_mode file;
      secure_download_secret DontCopyMyPics$remote_addr;

      if ($secure_download !~ "^-.") {
          rewrite ^/secured(.*)/[0-9a-zA-Z]*/[0-9a-zA-Z]*$ $1 last;
      }   
      if ($secure_download = "-1") {
          rewrite . /static/expired.html last;
      }   
      if ($secure_download = "-2") {
          rewrite . /static/bad_hash.html last;
      }   
      return 500;
  }   
  
  location / { 
      internal;
      root html;
  } 
  
  location /static { 
     root static;
  }   



Requirements
------------
To compile the NGINX with this module you will need to have following:

- The mod_rewrite in the NGINX has to be enabled
- You need the mhash library, it is used by the secure-download module to create the md5 hashes
- I tested the module only with NGINX 0.7.61 and 0.8.33, no guarantee for other versions



Bugs/Feedback
^^^^^^^^^^^^^
In case you find any bugs, please write me a mail and I will try to help.

If you are using that module, I would appreciate every kind of feedback or problem reports.

I tried to give some meaningful output in the error log if you set its log level to debug.

Mail: mauro.stettler(A.T)gmail.com 



Download
^^^^^^^^
:github:`from GitHub <replay/ngx_http_secure_download>`
