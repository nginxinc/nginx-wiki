Owner Match
===========

= Synopsis =
This module provides a simple file owner-based access control.

Module nginx_http_owner_match_module makes it possible to control access
for specific owners and groups of files.

Access rules are checked according to the order of their declaration.

Example configuration:
<geshi lang="nginx">
location / {
  omallow heiher;  # allow access files of heiher
  omallow jack sftp; # allow access files of jack:sftp
  omdeny all;  # deny others
}
</geshi>


= Directives =

== omallow ==
'''syntax:''' ''omallow [ username | username groupname | all ] ''

'''default:''' ''no''

'''context:''' ''http, server, location, limit_except''

Directive grants access for the username or user:group indicated. 


== omdeny ==
'''syntax:''' ''deny [ username | username groupname | all ] ''

'''default:''' ''no''

'''context:''' ''http, server, location, limit_except''

Directive forbids access for the username or user:group indicated. 

= References =
[https://heiher.info/1755.html Chinese Documentation and Source download]
