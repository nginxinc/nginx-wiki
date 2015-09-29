
.. meta::
   :description: An example NGINX configuration that uses a PHP script on an Apache server as the IMAP auth backend.

Using a PHP Script on an Apache Server as the IMAP Auth Backend
===============================================================

Start with the configuration from :doc:`imapproxyexample`. 
For detailed information about different configuration parameters, see the ngx_mail_core_module page.

#. Your Proxy server for pop/imap is running on 192.168.1.1
#. You have 2 backend pop/imap servers: 192.168.1.22 and 192.168.1.33
#. You have a webserver that you will use for the authentication and redirection logic 192.168.1.44.
#. The authentication script is ``/mail/auth.php``



nginx.conf
----------

.. code-block:: nginx

  user  nobody;
  worker_processes  1;
  error_log  logs/error.log  info;
  pid  logs/nginx.pid;

  events {
    worker_connections  1024;
    multi_accept on;
  }

  mail {
    auth_http  192.168.1.44:80/mail/auth.php;
    pop3_capabilities  "TOP"  "USER";
    imap_capabilities  "IMAP4rev1"  "UIDPLUS";

    server {
      listen     110;
      protocol   pop3;
      proxy      on;
    }

    server {
      listen     143;
      protocol   imap;
      proxy      on;
    }
  }



/mail/auth.php
--------------

.. code-block:: php

  <?php
  /*
  NGINX sends headers as
  Auth-User: somuser
  Auth-Pass: somepass
  On my php app server these are seen as
  HTTP_AUTH_USER and HTTP_AUTH_PASS
  */
  if (!isset($_SERVER["HTTP_AUTH_USER"] ) || !isset($_SERVER["HTTP_AUTH_PASS"] )){
    fail();
  }
  
  $username=$_SERVER["HTTP_AUTH_USER"] ;
  $userpass=$_SERVER["HTTP_AUTH_PASS"] ;
  $protocol=$_SERVER["HTTP_AUTH_PROTOCOL"] ;
  
  // default backend port
  $backend_port=110;
  
  if ($protocol=="imap") {
    $backend_port=143;
  }
  
  if ($protocol=="smtp") {
    $backend_port=25;
  }
  
  // NGINX likes ip address so if your
  // application gives back hostname, convert it to ip address here
  $backend_ip["mailhost01"] ="192.168.1.22";
  $backend_ip["mailhost02"] ="192.168.1.33";
  
  // Authenticate the user or fail
  if (!authuser($username,$userpass)){
    fail();
    exit;
  }
  
  // Get the server for this user if we have reached so far
  $userserver=getmailserver($username);
  
  // Get the ip address of the server
  // We are assuming that you backend returns hostname
  // We try to get the ip else return what we got back
  $server_ip=(isset($backend_ip[$userserver]))?$backend_ip[$userserver] :$userserver;
  
  // Pass!
  pass($server_ip, $backend_port);

  //END
  
  function authuser($user,$pass){
    // put your logic here to authen the user to any backend
    // you want (datbase, ldap, etc)
    // for example, we will just return true;
    return true;
  }

  function getmailserver($user){
    // put the logic here to get the mailserver
    // backend for the user. You can get this from
    // some database or ldap etc
    // dummy logic, all users that start with a,c,f and g get mailhost01
    // the others get mailhost02
    if in_array(substr($user,0,1), array("a", "c", "f", "g")){
      return "mailhost01";
    } else {
      return "mailhost02";
    }
  }

  function fail(){
    header("Auth-Status: Invalid login or password");
    exit;
  }

  function pass($server,$port){
    header("Auth-Status: OK");
    header("Auth-Server: $server");
    header("Auth-Port: $port");
    exit;
  }
