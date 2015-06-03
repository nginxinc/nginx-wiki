.. _modules:

.. todo::

   * How to compile modules (a separate doc)
   * Information about writing modules (a separate doc)
   * Move more modules over (LinuxJedi got up to the end of 'B')


Nginx 3\ :sup:`rd` Party Modules
================================

+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Module                 | Description                                                             | Repository                                                                           |
+========================+=========================================================================+======================================================================================+
| :doc:`accept_language` | Accept-Language header parser                                           | :github:`giom/nginx_accept_language_module`                                          |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| AFCGI                  | Asynchronous/multiplexing FastCGI for nginx                             | :github:`rsms/afcgi`                                                                 |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Akamai G2O             | Restricts access to content to Akamai edge servers using G2O headers    | :github:`refractalize/nginx_mod_akamai_g2o`                                          |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Array Var              | Add support for array variables to nginx config files                   | :github:`openresty/array-var-nginx-module`                                           |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| :doc:`audio_track`     | Generate audio track for HTTP Live Streaming (HLS) streams on the fly   | :github:`flavioribeiro/nginx-audio-track-for-hls-module`                             |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| :doc:`auth_digest`     | HTTP Digest Authentication                                              | :github:`samizdatco/nginx-http-auth-digest`                                          |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| PAM Authentication     | HTTP Basic Authentication using PAM                                     | :github:`stogh/ngx_http_auth_pam_module`                                             |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Request Authentication | Allows authorization based on subrequest result                         | `ngx_http_auth_request_module <http://mdounin.ru/hg/ngx_http_auth_request_module/>`_ |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Auto Lib               | Reuse pre-compiled/installed versions of OpenSSL, PCRE and Zlib         | :github:`simpl/ngx_auto_lib`                                                         |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| AWS Auth               | Generate security headers for GET requests to Amazon S3                 | :github:`anomalizer/ngx_aws_auth`                                                    |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+
| Backtrace              | A nginx module to dump backtrace case a worker process exits abnormally | :github:`alibaba/nginx-backtrace`                                                    |
+------------------------+-------------------------------------------------------------------------+--------------------------------------------------------------------------------------+

..
   This is a list of modules that didn't have a wiki page on the old wiki:
   * AFCGI
   * Akamai G2O
   * Array Var
   * Auth PAM
   * Auth Request
   * Auth Lib
   * AWS Auth
   * Backtrace

..
   This is a list of modules we haven't added and why:
   * Access Key - no revision tree, was locally hosted


.. toctree::
   :hidden:

   accept_language
   audio_track
   auth_digest
