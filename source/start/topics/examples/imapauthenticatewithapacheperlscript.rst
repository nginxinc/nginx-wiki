Using a Perl Script as the IMAP Auth Backend
============================================

Using nginx-embedded-perl module on the same server as the imap/pop proxy as the auth backend

.. note::
   This solution will block entire nginx worker when reading user information from DB and therefore not recommended for real use.

   This solution is being used at at ISP with 35000+ mailboxes for almost 2 years now fine. If you want  shameful plug, the ISP is Worldsoft (http://www.worldsoft.info)

Start with the configuration from :doc:`imapproxyexample`. For detail information about different configuration parameters, see the `ngx_mail_core_module <http://nginx.org/en/docs/mail/ngx_mail_core_module.html>`_ documentation.

Configure nginx with embedded perl and mail

.. code-block:: bash

   ./configure --with-http_perl_module --with-mail

``nginx/conf/nginx.conf``:

.. code-block:: nginx

    user  nobody;
    worker_processes  1;
    error_log  logs/error.log  info;
    pid        logs/nginx.pid;

    events {
      worker_connections  1024;
      multi_accept on;
    }

    http {
      perl_modules  perl/lib;
      perl_require  mailauth.pm;

      server {
        location /auth {
          perl  mailauth::handler;
        }
      }
    }

    mail {
      auth_http  127.0.0.1:80/auth;

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

The ultrafast nginx based authentifier, ``nginx/perl/lib/mailauth.pm``:

.. code-block:: perl

    package mailauth;
    use nginx;
    use DBI;
    my $dsn="DBI:mysql:database=DBNAME;host=HOSTNAME";
    our $dbh=DBI->connect_cached($dsn, 'dbusername', 'dbpass', {AutoCommit => 1});
    our $sth=$dbh->prepare("select password,mail_server from mailaccounts where username=? limit 1");

    our $auth_ok;
    our $mail_server_ip={};
    our $protocol_ports={};
    $mail_server_ip->{'mailhost01'}="192.168.1.22";
    $mail_server_ip->{'mailhost02'}="192.168.1.33";
    $protocol_ports->{'pop3'}=110;
    $protocol_ports->{'imap'}=143;

    sub handler {
      my $r = shift;
      $auth_ok=0;

      $sth->execute($r->header_in("Auth-User"));
      my $hash=$sth->fetchrow_hashref();
      # assuming that the query results password and mail_server
      # assuming that the password is in crypt format

      if (crypt($r->header_in("Auth-Pass"), $hash->{'password'}) eq $r->header_in("Auth-Pass")){
        $auth_ok=1;
      }
      if ($auth_ok==1){
        $r->header_out("Auth-Status", "OK") ;
        $r->header_out("Auth-Server", $mail_server_ip->{$hash->{'mail_server'}});
        $r->header_out("Auth-Port", $protocol_ports->{$r->header_in("Auth-Protocol")});
      } else {
        $r->header_out("Auth-Status", "Invalid login or password") ;
      }

      $r->send_http_header("text/html");

      return OK;
    }

    1;
    __END__

