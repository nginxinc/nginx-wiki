HTTP Digest Authentication
==========================

Name
----

**ngx_http_auth_digest** - HTTP Digest Authentication support for Nginx.

.. note:: *This module is not distributed with the Nginx source.* See the :github:`installation instructions <samizdatco/nginx-http-auth-digest/blob/master/readme.rst>`

Status
------

The module is feature-complete with respect to the RFC but is in need of broader testing before it can be considered secure enough for use in production. See the :github:`bugs.txt <samizdatco/nginx-http-auth-digest/blob/master/bugs.txt>` file and the github :github:`issue tracker <samizdatco/nginx-http-auth-digest/issues>` for the current set of caveats.

Synopsis
--------

You can limit access to a directory tree by adding the following lines into
a *server* section in your Nginx configuration file:

.. code-block:: nginx

  auth_digest_user_file /opt/httpd/conf/passwd.digest; # a file created with htdigest
  location /private {
      auth_digest 'this is not for you'; # set the realm for this location block
  }

The other directives control the lifespan defaults for the authentication session. The 
following is equivalent to the previous example but demonstrates all the directives:

.. code-block:: nginx

  auth_digest_user_file /opt/httpd/conf/passwd.digest;
  auth_digest_shm_size 4m;   # the storage space allocated for tracking active sessions

  location /private {
      auth_digest 'this is not for you';
      auth_digest_timeout 60s; # allow users to wait 1 minute between receiving the
                               # challenge and hitting send in the browser dialog box
      auth_digest_expires 10s; # after a successful challenge/response, let the client
                               # continue to use the same nonce for additional requests
                               # for 10 seconds before generating a new challenge
      auth_digest_replays 20;  # also generate a new challenge if the client uses the
                               # same nonce more than 20 times before the expire time limit
  }

Adding digest authentication to a location will affect any uris that match that block. To
disable authentication for specific sub-branches off a uri, set ``auth_digest`` to ``off``:

.. code-block:: nginx

  location / {
      auth_digest 'this is not for you';
      location /pub {
          auth_digest off; # this sub-tree will be accessible without authentication
      }
  }

Directives
----------

auth_digest
^^^^^^^^^^^

:Syntax:  ``auth_digest [`` *realm-name* ``| off ]``
:Default: ``off``
:Context: *server, location*

Enable or disable digest authentication for a server or location block. The realm name
should correspond to a realm used in the user file. Any user within that realm will be
able to access files after authenticating.

To selectively disable authentication within a protected uri hierarchy, set ``auth_digest`` 
to “``off``” within a more-specific location block (see example).

auth_digest_user_file
^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``auth_digest_user_file`` */path/to/passwd/file*
:Default: *none*
:Context: *server, location*

The password file should be of the form created by the apache ``htdigest`` command (or the 
included :github:`htdigest.py <samizdatco/nginx-http-auth-digest/blob/master/htdigest.py>` script). Each line of the file is a colon-separated list composed 
of a username, realm, and md5 hash combining name, realm, and password. For example:

::

   joi:enfield:ef25e85b34208c246cfd09ab76b01db7

auth_digest_timeout
^^^^^^^^^^^^^^^^^^^

:Syntax: ``auth_digest_timeout`` *delay-time*
:Default: ``60s``
:Context: *server, location*

When a client first requests a protected page, the server returns a 401 status code along with
a challenge in the ``WWW-Authenticate`` header.

At this point most browsers will present a dialog box to the user prompting them to log in. This
directive defines how long challenges will remain valid. If the user waits longer than this time
before submitting their name and password, the challenge will be considered ‘stale’ and they will
be prompted to log in again.

auth_digest_expires
^^^^^^^^^^^^^^^^^^^

:Syntax: ``auth_digest_expires`` *lifetime-in-seconds*
:Default: ``10s``
:Context: *server, location*

Once a digest challenge has been successfully answered by the client, subsequent requests 
will attempt to re-use the ‘nonce’ value from the original challenge. To complicate MitM
attacks, it's best to limit the number of times a cached nonce will be accepted. This
directive sets the duration for this re-use period after the first successful authentication.

auth_digest_replays
^^^^^^^^^^^^^^^^^^^

:Syntax: ``auth_digest_replays`` *number-of-uses*
:Default: ``20``
:Context: *server, location*

Nonce re-use should also be limited to a fixed number of requests. Note that increasing this
value will cause a proportional increase in memory usage and the shm_size may have to be
adjusted to keep up with heavy traffic within the digest-protected location blocks.

auth_digest_shm_size
^^^^^^^^^^^^^^^^^^^^

:Syntax: ``auth_digest_shm_size`` *size-in-bytes*
:Default: ``4096k``
:Context: *server*

The module maintains a fixed-size cache of active digest sessions to save state between 
authenticated requests. Once this cache is full, no further authentication will be possible
until active sessions expire. 

As a result, choosing the proper size is a little tricky since it depends upon the values set in
the expiration-related directives. Each stored challenge takes up ``48 + ceil(auth_digest_replays/8)`` bytes
and will live for up to ``auth_digest_timeout + auth_digest_expires`` seconds. When using the
default module settings this translates into allowing around 82k non-replay requests every 70
seconds.

Source Repository
-----------------

Available on github at :github:`samizdatco/nginx-http-auth-digest`.

Author
------

Christian Swinehart / `Samizdat Drafting Co. <http://samizdat.cc>`_

Copyright & License
-------------------

The basic request-handling and password-file-parsing is based on the ``ngx_http_auth_basic`` module in the Nginx 1.0.8 sources. The original code is copyright Igor Sysoev.

Copyright (c) 2011, Christian Swinehart

This module is licensed under the terms of the :github:`BSD license <samizdatco/nginx-http-auth-digest/blob/master/LICENSE>`

See Also
--------

* The `RFC 2617 <http://www.ietf.org/rfc/rfc2617.txt>`_ definition of basic and digest authentication.
* Shane Holloway's werkzeug `module <https://github.com/shanewholloway/werkzeug/blob/master/werkzeug/contrib/authdigest.py>`_ which was used as a reference implementation.

