
.. meta::
   :description: Example NGINX configurations for basic and STARTTLS IMAP proxies.

IMAP Proxy Example
==================

For a basic IMAP proxy, nginx.conf should look like this:

.. code-block:: nginx

  mail {
    #auth_http  unix:/path/socket:/cgi-bin/auth;
    auth_http  localhost:9000/cgi-bin/auth;

    proxy  on;

    imap_capabilities  "IMAP4rev1"  "UIDPLUS"; ## default
    server {
      listen     143;
      protocol   imap;
    }

  ## uncomment to enable POP3 proxy
  #  pop3_capabilities  "TOP"  "USER";
  #  server {
  #    listen     110;
  #    protocol   pop3;
  #  }

  }

To configure IMAP proxy with STARTTLS support, use nginx.conf like this:

.. code-block:: nginx

  mail {
    #auth_http  unix:/path/socket:/cgi-bin/auth;
    auth_http  localhost:9000/cgi-bin/auth;

    proxy     on;
    starttls  on; ## enable STARTTLS for all mail servers

    # The SSL part can be put in a separate configuration file,
    # e.g., in the case of an SSL offloader / caching proxy.
    # In that case, only the ssl_certificate* needs to be set here (or in server block.)
    # The config assumes certificates in /etc/nginx/ssl/ and 
    # private keys in /etc/nginx/ssl/private/
    ssl                        on;
    ssl_prefer_server_ciphers  on;
    ssl_protocols              TLSv1 SSLv3;
    ssl_ciphers                HIGH:!ADH:!MD5:@STRENGTH;
    ssl_session_cache          shared:TLSSL:16m;
    ssl_session_timeout        10m;
    ## default SSL cert. Each host should have its own.
    ssl_certificate            ssl/wildcard.crt;
    ssl_certificate_key        ssl/private/wildcard.key;

    ## default, STARTTLS is appended because of starttls directive above
    imap_capabilities  "IMAP4rev1"  "UIDPLUS"; 
    server {
      listen       143;
      protocol     imap;
      server_name  mx.example.org;
    }

  ## uncomment to enable POP3 proxy
  #  pop3_capabilities  "TOP"  "USER";
  #  server {
  #    listen     110;
  #    protocol   pop3;
  #  }

  }

.. note:: if you're using NGINX on linux, you need to run ``./configure`` with the mail options:

  .. code-block:: bash
  
    ./configure --with-mail --with-mail_ssl_module
  
  (also consider using ``--without-http`` if you don't need http proxying)
