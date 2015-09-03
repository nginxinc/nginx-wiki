
.. meta::
   :description: An example NGINX configuration that uses fcgiwrap to run CGI applications over FastCGI.

FCGI Wrap
=========

So, you want to use CGI. 
OK! Let's make this as simple as possible for you.

..
   [SSL: CERTIFICATE_VERIFY_FAILED]
   Your reference: http://nginx.localdomain.pl/wiki/FcgiWrap

   Some guy made this, and it's amazing. 
   His guide has a few quirks though. 
   I aim to steer you clear from this.



Install on Debian or Ubuntu
---------------------------

There are packages for `Debian <http://packages.debian.org/squeeze/fcgiwrap>`_ and `Ubuntu <http://packages.ubuntu.com/maverick/fcgiwrap>`_ now. Simply type

.. code-block:: bash

  aptitude install fcgiwrap

Then, have a look at /usr/share/doc/fcgiwrap/README.Debian. 
There's an example configuration at /usr/share/doc/fcgiwrap/examples/nginx.conf.

What I did was creating a local copy of the example configuration (so it does not get overwritten upon updates)

.. code-block:: bash

  cp /usr/share/doc/fcgiwrap/examples/nginx.conf /etc/nginx/fcgiwrap.conf

and add it to the the site's configuration in the "server" section with 

.. code-block:: nginx

  # fast cgi support
  include /etc/nginx/fcgiwrap.conf;

.. todo::
   ..
      The deb package contains an improved init script, which is mirrored :doc:`here <fcgiwrapdebianinitscript>` for completeness.
   
After installing the package, also have a look at the |HttpFastCGIModule| documentation or the :doc:`fastcgiexample`.



Manual Install
--------------
The first step here is to install this stuff.

If you're on an apt based system:

.. code-block:: bash

  aptitude install git-core build-essential libfcgi-dev autoconf libtool automake


Get the source:

.. code-block:: bash

  cd /usr/local/src/
  git clone git://github.com/gnosek/fcgiwrap.git


Compile this:

.. code-block:: bash

  cd /usr/local/src/fcgiwrap
  autoreconf -i
  ./configure
  make
  mv fcgiwrap /usr/local/bin/



Setup Scripts
-------------

* /etc/init.d/fcgiwrap
    .. todo::
       ..
          Also see the Debian init script :doc:`here <fcgiwrapdebianinitscript>`.

    .. code-block:: perl

      #!/usr/bin/perl

      use strict;
      use warnings FATAL => qw( all );

      use IO::Socket::UNIX;

      my $bin_path = '/usr/local/bin/fcgiwrap';
      my $socket_path = $ARGV[0] || '/tmp/cgi.sock';
      my $num_children = $ARGV[1] || 1;

      close STDIN;

      unlink $socket_path;
      my $socket = IO::Socket::UNIX->new(
          Local => $socket_path,
          Listen => 100,
      );

      die "Cannot create socket at $socket_path: $!\n" unless $socket;

      for (1 .. $num_children) {
          my $pid = fork;
          die "Cannot fork: $!" unless defined $pid;
          next if $pid;

          exec $bin_path;
          die "Failed to exec $bin_path: $!\n";
      }

    Don't forget ``chmod +x /etc/init.d/fcgiwrap``.

* /etc/rc.local
    I decided not to try to make an overly complicated init script and sit with the simple one. 
    I just added ``sudo -u www-data /etc/init.d/fcgiwrap`` to ``/etc/rc.local`` before the exit 0 line.



What Happens
------------
The sudo command will launch the fcgiwrapper init script as the www-data user. 
The script bings a listener thread to ``/tmp/cgi.sock``. 
This is what you need to use in `fastcgi_pass <|HttpFastCGIModule|#fastcgi_pass>`_: ``fastcgi_pass unix:/tmp/cgi.sock;``
