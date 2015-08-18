
.. meta::
   :description: The Owner Match module provides a simple file owner-based access control. Access rules are checked according to the order of their declaration.

Owner Match
===========

Description
-----------
**nginx_http_owner_match_module** - control access for specific owners and groups of files.

Access rules are checked according to the order of their declaration.

Example configuration:

.. code-block:: nginx

  location / {
      omallow heiher;  # allow access files of heiher
      omallow jack sftp; # allow access files of jack:sftp
      omdeny all;  # deny others
  }



Directives
----------

omallow
^^^^^^^
:Syntax: *omallow [username | username:groupname | all]*
:Default: *none*
:Context: *http, server, location, limit_except*

Directive grants access for the username or user:group indicated. 


omdeny
^^^^^^
:Syntax: *omdeny [username | username:groupname | all]*
:Default: *none*
:Context: *http, server, location, limit_except*

Directive forbids access for the username or user:group indicated. 



References
----------
`Chinese documentation and source download <https://heiher.info/1755.html>`_
