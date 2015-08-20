
.. meta::
   :description: How to install, build, test, and control NGINX on Solaris 11.

Installation
============

Please see `Solaris 10u5 <Installing_on_Solaris_10_u5>`__ for a detailed
walkthrough, this is the bare essentials for installing nginx on Solaris
11. Solaris 11 has much improved versions of PCRE and OpenSSL so it's
not required to install them manually.

Install packages (Solaris 11)
-----------------------------

.. code-block:: bash

    pkg install gcc-45
    pkg install system/header
    pkg install make
    pkg install pcre

Install packages (OpenIndiana 151a8)
------------------------------------

Activate SFE repos (see
http://wiki.openindiana.org/oi/Spec+Files+Extra+Repository)

.. code-block:: bash

    pkg set-publisher -p http://pkg.openindiana.org/sfe
    pkg install sfe/developer/gcc
    pkg install sfe/system/library/gcc-runtime
    pkg install sfe/library/gmp
    pkg install sfe/library/mpc
    pkg install sfe/library/mpfr
    pkg install developer/build/make
    pkg install system/header
    pkg install developer/library/lint
    pkg install library/pcre

Fetch and compile nginx
-----------------------

.. code-block:: bash

    wget http://nginx.org/download/nginx-1.4.3.tar.gz
    tar xvzpf nginx-1.4.3.tar.gz
    cd nginx-1.4.3
    CC="gcc" ./configure --prefix=/opt/nginx --with-cpu-opt="amd64" --with-ipv6 --with-http_ssl_module
    make
    make install

Startup script
==============

Same as
`Installing\_on\_Solaris\_10\_u5 <Installing_on_Solaris_10_u5>`__.

Create the file /lib/svc/method/svc-nginx with the following content:

.. code-block:: bash

    #!/bin/sh
    NGINX_CMD="/opt/nginx/sbin/nginx"
    NGINX_CONF="/opt/nginx/conf/nginx.conf"
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

Create the manifest: /var/svc/manifest/network/nginx.xml (almost same
but correct typo in stability to "Stable" with a capital S, and new
version number.

.. code-block:: xml

    <?xml version="1.0"?> 
    <!DOCTYPE service_bundle SYSTEM "/usr/share/lib/xml/dtd/service_bundle.dtd.1"> 
    <service_bundle type='manifest' name='nginx'> 
      <service name='network/nginx' type='service' version='1'>
        <create_default_instance enabled='false' /> 
        <single_instance />
        <exec_method type='method' name='start' exec='/lib/svc/method/svc-nginx start' timeout_seconds='60'/>
        <exec_method type='method' name='stop' exec='/lib/svc/method/svc-nginx stop' timeout_seconds='60' />
        <exec_method type='method' name='restart' exec='/lib/svc/method/svc-nginx restart' timeout_seconds='60' /> 
        <stability value='Stable' /> 
        <template> 
          <common_name>
            <loctext xml:lang='C'> Nginx 1.4.3 </loctext> 
          </common_name>
          <documentation> 
            <manpage title='nginx' section='8' manpath='/usr/share/man' /> 
          </documentation>
        </template>
      </service>
    </service_bundle>

Set the permissions and import it

.. code-block:: bash

    chown root:bin /lib/svc/method/svc-nginx && chmod 555 /lib/svc/method/svc-nginx
    chmod 444 /var/svc/manifest/network/nginx.xml
    chown root:sys /var/svc/manifest/network/nginx.xml
    svccfg -v import /var/svc/manifest/network/nginx.xml
    svcadm enable nginx

