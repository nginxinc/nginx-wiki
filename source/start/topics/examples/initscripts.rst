Nginx Init Scripts
==================

.. toctree::
   :hidden:

   redhatnginxinit
   redhatphpfcgiinit
   ubuntuupstart
   systemd
   freebsdphpfcgid
   freebsdpythonfcgi
   freebsdspawnfcgi
   osxlaunchd

So many way to start Nginx. You can either used the binary or set something up that will work specifically for your needs. If you install Nginx from a repository, then it is likely that you already have an init script installed. If you installed from source, then you'll want to find a script from below to help you out.

Linux Init.d
------------

* :doc:`redhatnginxinit`
* :doc:`redhatphpfcgiinit`
* `Debian PHP-FPM (Lenny / Squeeze) <http://kbeezie.com/view/debian-ubuntu-nginx-init-script/>`_
* :github:`LSB compliant <Fleshgrinder/nginx-sysvinit-script>`

Upstart
-------

* :doc:`ubuntuupstart`

Systemd
-------

* :doc:`systemd`

FreeBSD
-------

* :doc:`freebsdphpfcgid`
* :doc:`freebsdpythonfcgi`
* :doc:`freebsdspawnfcgi`

OSX
---

* :doc:`osxlaunchd`

Windows
-------

* :github:`Nginx Service for Windows <InvGate/winginx/>` which uses `NSSM <http://nssm.cc/>`_ as a wrapper for service behaviour.
