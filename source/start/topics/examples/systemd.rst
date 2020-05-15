
.. meta::
   :description: An example of a simple NGINX systemd service file.

NGINX systemd service file
==========================

Should work on Fedora, OpenSUSE, Arch Linux, Ubuntu. Tested on Fedora 16 and 17, Ubuntu 18.04 .

The location of the PIDFile and the NGINX binary may be different depending on how NGINX was compiled.

Save this file as ``/lib/systemd/system/nginx.service``

.. code-block:: ini

    [Unit]
    Description=The NGINX HTTP and reverse proxy server
    After=syslog.target network-online.target remote-fs.target nss-lookup.target
    Wants=network-online.target

    [Service]
    Type=forking
    PIDFile=/run/nginx.pid
    ExecStartPre=/usr/sbin/nginx -t
    ExecStart=/usr/sbin/nginx
    ExecReload=/usr/sbin/nginx -s reload
    ExecStop=/bin/kill -s QUIT $MAINPID
    PrivateTmp=true

    [Install]
    WantedBy=multi-user.target

