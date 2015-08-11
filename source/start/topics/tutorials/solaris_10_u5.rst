Installation
============

Before we can proceed with the installation process, we will install
some dependencies that will be required by nginx. with my setup, I'll
compile Nginx with openssl and pcre support, So firstly we will compile
these prerequisites, after that will continue Nginx compilation process.

These prerequisites are:

-  **Pcre Library**
-  **Openssl Library**

I'll assume a fresh solaris machine, so some Solaris build tools reside
in /usr/ccs/bin, which needs to be added to your path if it not there.
we could do that as follows:

.. code-block:: bash

   vi ~/.profile

add the following inside the file :

.. code-block:: bash

   export PATH=$PATH:/opt/SUNWSpro/bin:/usr/ccs/bin:/usr/sfw/bin

Now refresh your shell so it sees the modified PATH variable:

.. code-block:: bash

   source ~/.profile

The last thing for preparing our environment is installing Sun Studio 12
Compiler which you can get from the following link:

   http://www.oracle.com/technetwork/java/index.html

Although it's freely available to download, you must be registered
at sun to access the download link.

..
   Dead links
   There are two options to download the package:

   #. `Download Package
      Installer <https://cds.sun.com/is-bin/INTERSHOP.enfinity/WFS/CDS-CDS_Developer-Site/en_US/-/USD/ViewProductDetail-Start?ProductRef=SSSP9-120-T99M@CDS-CDS_Developer>`__
   #. `Download Product
      Tarfile <https://cds.sun.com/is-bin/INTERSHOP.enfinity/WFS/CDS-CDS_Developer-Site/en_US/-/USD/ViewProductDetail-Start?ProductRef=SSST9-120-T99M@CDS-CDS_Developer>`__

   We will use the second option, as it has the necessary file, plus some
   additional packages, which we won't need in our procedure.

After you have downloaded the SunStudio12ml­-solaris­-x86­-200709­-ii.tar.bz2,
we will extract it as follows :

.. code-block:: bash

   cd /path/to/SunStudio/file/; gtar ­-jxf SunStudio12ml­-solaris­-x86­-200709­-ii.tar.bz2 ­-C /opt/

The previous command will extract the file and put it in /opt/ path,
There you will find some folders, the most important one is
/opt/SUNWspro which was set in our PATH variable above.

Building/Installing PCRE
------------------------

As previously said, to build Nginx for Solaris, we must first satisfy a
couple of dependencies, namely PCRE (Perl Regular Expression Library)
and OpenSSL. (Although OpenSSL is not strictly needed, I like to include
it for completeness.) All builds will be full 64-bit.

.. note:: Before starting, some solaris packages must be installed on your system like::

   * SUNWbtool
   * SUNWtoo
   * SUNWlibmr
   * SUNWlibm

Let's begin with PCRE:

.. code-block:: bash

   cd /usr/src/; wget -c ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.00.tar.gz
   gtar -zxf  pcre-8.00.tar.gz
   cd pcre-8.00
   ./configure --disable-cpp CFLAGS="-g -O3" CC="/opt/SUNWspro/bin/cc -m64" --prefix=/opt/local --enable-utf8 --enable-unicode-properties
   make
   make install

Building/Installing OpenSSL
---------------------------

.. code-block:: bash

   cd /usr/src/; wget -c http://www.openssl.org/source/openssl-0.9.8e.tar.gz
   gtar -zxf openssl-0.9.8e.tar.gz
   cd openssl-0.9.8e

Before we can continue, we will make a small modification to the
Configure script to correct 64 bit mode flag for our cc compiler as
follows:

.. code-block:: bash

   vi Configure

search for **-xarch=amd64** and change it to **-m64** then save and
exit. After that we can proceed and continue our compilation process:

.. code-block:: bash

   ./Configure solaris64-x86_64-cc threads shared --prefix=/opt/local --openssldir=/opt/local/openssl
   make
   make install

Building/Installing Nginx
-------------------------

Our final stage is building and installing nginx from source tar ball,
we will follow the same steps as done above with pcre and openssl:

.. code-block:: bash

   cd /usr/src; wget -c http://sysoev.ru/nginx/nginx-0.7.64.tar.gz
   gtar -zxf nginx-0.7.64.tar.gz
   cd nginx-0.7.64

In order to complete nginx compilation process properly in full 64 bit
mode, we have to edit src/os/unix/ngx\_sunpro\_amd64.il file firstly as
follows:

.. code-block:: bash

   vi src/os/unix/ngx_sunpro_amd64.il

At the end of file::

   pause

change it to::

   rep; nop

save and exit now complete the process:

.. code-block:: bash

   CC="cc" ./configure --prefix=/opt/local/nginx --with-cpu-opt="amd64" --with-ipv6 --with-http_ssl_module --with-cc-opt="-I /opt/local/include"
   --with-ld-opt="-L /opt/local/lib -R /lib -R /usr/lib -R /opt/local/lib"

.. code-block:: bash

   make
   make install

Testing Nginx
=============

After finishing Nginx's installation process, we can now test that
everything is fine as follows:

.. code-block:: bash

   cd /opt/local/nginx/sbin/
   ./nginx

Nginx now should be running on your machine. If you open
\http://127.0.0.1/ in your browser, you should see a page with “Welcome
to nginx!”.

Running Nginx as SMF service
============================

In this section we will configure our Nginx Web server to run at Solaris
10 bootup , and to achieve this we will use Solaris 10 SMF feature, and
to simplify the process I've created the necessary files for that
purpose.

.. code-block:: bash

   vi /lib/svc/method/svc-nginx

And put the following inside the file:

.. code-block:: bash

   #!/bin/sh
   NGINX_CMD="/opt/local/nginx/sbin/nginx"
   NGINX_CONF="/opt/local/nginx/conf/nginx.conf"
   RETVAL=0
   start() {
      echo "Starting Nginx Web Server: \c"
      $NGINX_CMD -c $NGINX_CONF &
      RETVAL=$?
      [ $RETVAL -eq 0 ] && echo "ok" || echo "failed"
      return $RETVAL
   }
   stop() {
      echo "Stopping Nginx Web Server: \c"
      NGINX_PID=`ps -ef |grep $NGINX_CMD |grep -v grep |awk '{print $2}'`
      kill $NGINX_PID
      RETVAL=$?
      [ $RETVAL -eq 0 ] && echo "ok" || echo "failed"
      return $RETVAL
   }
   case "$1" in
      start)
         start
         ;;
      stop)
         stop
         ;;
      restart)
         stop
         start
         ;;
      *)
         echo "Usage: $0 {start|stop|restart}"
         exit 1
   esac
   exit $RETVAL

After that modify the following permissions as follows:

.. code-block:: bash

   chown root:bin /lib/svc/method/svc-nginx && chmod 555 /lib/svc/method/svc-nginx

Now create a manifest file:

.. code-block:: bash

   vi /var/svc/manifest/network/nginx.xml

Inside the file, put the following:

.. code-block:: xml

   <?xml version="1.0"?>

   <!DOCTYPE service_bundle SYSTEM "/usr/share/lib/xml/dtd/service_bundle.dtd.1">

   <!--author: alex harvey based on the Sun ssh.xml manifest -->

   <service_bundle type='manifest' name='nginx'>
   <service name='network/nginx' type='service' version='1'>
   <create_default_instance enabled='false' />
   <single_instance />

   <exec_method type='method' name='start' exec='/lib/svc/method/svc-nginx start' timeout_seconds='60'/>

   <exec_method type='method' name='stop' exec='/lib/svc/method/svc-nginx stop' timeout_seconds='60' />

   <exec_method type='method' name='restart' exec='/lib/svc/method/svc-nginx restart' timeout_seconds='60' />

   <stability value='stable' />

   <template>

   <common_name>

   <loctext xml:lang='C'> Nginx 0.7.64 </loctext>

   </common_name> <documentation>

   <manpage title='nginx' section='8' manpath='/usr/share/man' />

   </documentation> </template> </service> </service_bundle>

Fix the permissions as previously done with svc-nginx:

.. code-block:: bash

   chmod 444 /var/svc/manifest/network/nginx.xml
   chown root:sys /var/svc/manifest/network/nginx.xml

Then import the manifest file into our SMF database:

.. code-block:: bash

   svccfg -v import /var/svc/manifest/network/nginx.xml

Finally enable the service to start automatically at Solaris Bootup:

.. code-block:: bash

   svcadm enable nginx
