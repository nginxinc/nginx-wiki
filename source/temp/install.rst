Install
=======

After Installing
----------------

.. todo::
   ..
      The :doc:`configuration` page will give you some help getting things going after you get Nginx installed and the :doc:`../start/topics/tutorials/config_pitfalls.html` page will help keep you from making mistakes that so many users before you did. 

These two pages give you the chance to learn from others mistakes and hard work.



Binary Releases
---------------

Prebuilt Packages for Linux and BSD
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Most Linux distributions and BSD variants have Nginx in the usual package repositories and they can be installed via whatever method is normally used to install software (``apt-get`` on Debian, ``emerge`` on Gentoo, ``ports`` on FreeBSD, etc).

Be aware that these packages are often somewhat out-of-date.
If you want the latest features and bugfixes, it's recommended to build from source or use packages directly from nginx.org.



Official Red Hat/CentOS packages
--------------------------------
To add nginx yum repository, create a file named ``/etc/yum.repos.d/nginx.repo`` and paste one of the configurations below:

CentOS::

  [nginx]
  name=nginx repo
  baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
  gpgcheck=0
  enabled=1


RHEL::

  [nginx]
  name=nginx repo
  baseurl=http://nginx.org/packages/rhel/$releasever/$basearch/
  gpgcheck=0
  enabled=1


Due to differences between how CentOS, RHEL, and Scientific Linux populate the ``$releasever`` variable, it is necessary to manually replace ``$releasever`` with either ``5`` (for 5.x) or ``6`` (for 6.x), depending upon your OS version.



Official Debian/Ubuntu packages
-------------------------------
Append the appropriate stanza to ``/etc/apt/sources.list``. The Pgp page explains the signing of the nginx.org released packaging.

Ubuntu 10.04:

.. code-block:: bash

  deb http://nginx.org/packages/ubuntu/ lucid nginx
  deb-src http://nginx.org/packages/ubuntu/ lucid nginx



Debian 6:

.. code-block:: bash

  deb http://nginx.org/packages/debian/ squeeze nginx
  deb-src http://nginx.org/packages/debian/ squeeze nginx


Ubuntu PPA
^^^^^^^^^^
This PPA is maintained by volunteers and is not distributed by nginx.org.  It has some additional compiled-in modules and may be more fitting for your environment.

You can get the latest stable version of Nginx from the `Nginx PPA <https://launchpad.net/~nginx/+archive/ubuntu/development>`_ on Launchpad:
You will need to have root privileges to perform the following commands.

For Ubuntu 10.04 and newer:

.. code-block:: bash

  sudo -s
  nginx=stable # use nginx=development for latest development version
  add-apt-repository ppa:nginx/$nginx
  apt-get update
  apt-get install nginx

If you get an error about add-apt-repository not existing, you will want to install ``python-software-properties``.
For other Debian/Ubuntu based distributions, you can try the lucid variant of the PPA which is the most likely to work on older package sets:

.. code-block:: bash

  sudo -s
  nginx=stable # use nginx=development for latest development version
  echo "deb http://ppa.launchpad.net/nginx/$nginx/ubuntu lucid main" > /etc/apt/sources.list.d/nginx-$nginx-lucid.list
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C300EE8C
  apt-get update
  apt-get install nginx



.. _install_win32_binaries:

Official Win32 Binaries
-----------------------
As of nginx 0.8.50, nginx is now available as an `official Windows binary <http://nginx.org/en/download.html>`_.

Installation:

.. code-block:: bash

  cd c:\
  unzip nginx-1.2.3.zip
  ren nginx-1.2.3 nginx
  cd nginx
  start nginx

Control:

.. code-block:: bash

  nginx -s [ stop | quit | reopen | reload ]


For problems look in c:\nginx\logs\error.log or in EventLog.

In addition, Kevin Worthington maintains earlier `Windows <http://kevinworthington.com/nginx-for-windows/>`_ builds of the development branch.



Source Releases
---------------
There are currently two versions of Nginx available: ``stable (1.8.x)``, ``mainline (1.9.x)``.
The mainline branch gets new features and bugfixes sooner but might introduce new bugs as well.
Critical bugfixes are backported to the stable branch.

In general, the stable release is recommended, but the mainline release is typically quite stable as well.
See the `FAQ <faq.is_it_safe_>`.

<br style="clear: both;" />

<ul class="content-download-container">

<li class="content-download-item">
<div class="content-download-link">


Stable
^^^^^^
`nginx 1.8.0 <http://nginx.org/download/nginx-1.8.0.tar.gz>`_<br />
21 Apr 2015<br />
`changelog <http://nginx.org/en/CHANGES-1.8>`_
</div>
</li>

<li class="content-download-item">
<div class="content-download-link">


Mainline
^^^^^^^^
`nginx 1.9.2 <http://nginx.org/download/nginx-1.9.2.tar.gz>`_<br />
16 Jun 2015<br />
`changelog <http://nginx.org/en/CHANGES>`_
</div>
</li>

</ul>

<br style="clear: both;" />

Source code repository is at `hg.nginx.org/nginx <http://hg.nginx.org/nginx>`_.

Older versions can be found `here <http://nginx.org/en/download.html>`_.


Building Nginx From Source
^^^^^^^^^^^^^^^^^^^^^^^^^^
After extracting the source, run these commands from a terminal:

.. code-block:: bash

  ./configure
  make
  sudo make install

By default, Nginx will be installed in ``/usr/local/nginx``. You may change this and other options with the :doc:`installoptions`.

You might also want to peruse the :doc:`3rd party modules <../modules/index>`, since these must be built at compile-time.


Other Systems
^^^^^^^^^^^^^

.. todo::
   ..
      * :doc:`installing_on_solaris_10_u5`
      * :doc:`installing_on_solaris_11`

.. warning:: These pages are not thoroughly, if at all, reviewed for accuracy as they are on this page.



References
----------
`Original Documentation <http://sysoev.ru/nginx/docs/install.html>`_
