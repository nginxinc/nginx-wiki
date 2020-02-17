
.. meta::
   :description: This page describes various ways to download and install NGINX.

Install
=======

Binary Releases
---------------

Prebuilt Packages for Linux and BSD
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Most Linux distributions and BSD variants have NGINX in the usual package repositories and they can be installed via whatever method is normally used to install software (``apt-get`` on Debian, ``emerge`` on Gentoo, ``ports`` on FreeBSD, etc).

Be aware that these packages are often somewhat out-of-date.
If you want the latest features and bugfixes, it's recommended to build from source or use packages directly from nginx.org.



Official Red Hat/CentOS packages
--------------------------------
To add NGINX yum repository, create a file named ``/etc/yum.repos.d/nginx.repo`` and paste one of the configurations below:

CentOS::

  [nginx]
  name=nginx repo
  baseurl=https://nginx.org/packages/centos/$releasever/$basearch/
  gpgcheck=0
  enabled=1


RHEL::

  [nginx]
  name=nginx repo
  baseurl=https://nginx.org/packages/rhel/$releasever/$basearch/
  gpgcheck=0
  enabled=1


Due to differences between how CentOS, RHEL, and Scientific Linux populate the ``$releasever`` variable, it is necessary to manually replace ``$releasever`` with either ``5`` (for 5.x) or ``6`` (for 6.x), depending upon your OS version.



Official Debian/Ubuntu packages
-------------------------------

Ubuntu:

The available NGINX Ubuntu release support is listed at `this distribution page <https://nginx.org/packages/ubuntu/dists/>`_. For a mapping of Ubuntu versions to release names, please visit the `Official Ubuntu Releases page <https://wiki.ubuntu.com/Releases>`_.

Append the appropriate stanza to ``/etc/apt/sources.list``. If there is concern about persistence of repository additions (i.e. DigitalOcean Droplets), the appropriate stanza may instead be added to a different list file under ``/etc/apt/sources.list.d/``, such as ``/etc/apt/sources.list.d/nginx.list``.

.. code-block:: bash

  ## Replace $release with your corresponding Ubuntu release.
  deb https://nginx.org/packages/ubuntu/ $release nginx
  deb-src https://nginx.org/packages/ubuntu/ $release nginx

e.g. Ubuntu 16.04 (Xenial):

.. code-block:: bash

  deb https://nginx.org/packages/ubuntu/ xenial nginx
  deb-src https://nginx.org/packages/ubuntu/ xenial nginx

To install the packages, execute in your shell:

.. code-block:: bash

  sudo apt-get update
  sudo apt-get install nginx

If a ``W: GPG error: https://nginx.org/packages/ubuntu xenial Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY $key`` is encountered during the NGINX repository update, execute the following:

.. code-block:: bash

  ## Replace $key with the corresponding $key from your GPG error.
  sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys $key
  sudo apt-get update
  sudo apt-get install nginx

Debian 6:

Append the appropriate stanza to ``/etc/apt/sources.list``.

.. code-block:: bash

  deb https://nginx.org/packages/debian/ squeeze nginx
  deb-src https://nginx.org/packages/debian/ squeeze nginx


Ubuntu PPA
^^^^^^^^^^
This PPA is maintained by volunteers and is not distributed by nginx.org.  It has some additional compiled-in modules and may be more fitting for your environment.

You can get the latest stable version of NGINX from the `NGINX PPA <https://launchpad.net/~nginx/+archive/ubuntu/development>`_ on Launchpad:
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
As of NGINX 0.8.50, NGINX is now available as an `official Windows binary <https://nginx.org/en/download.html>`_.

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

In addition, Kevin Worthington maintains earlier `Windows <https://kevinworthington.com/nginx-for-windows/>`_ builds of the development branch.



Source Releases
---------------
There are currently two versions of NGINX available: ``stable (1.10.x)``, ``mainline (1.11.x)``.
The mainline branch gets new features and bugfixes sooner but might introduce new bugs as well.
Critical bugfixes are backported to the stable branch.

In general, the stable release is recommended, but the mainline release is typically quite stable as well.
See the :ref:`FAQ <faq.is_it_safe>`.


Stable
^^^^^^
| `NGINX 1.10.1 <https://nginx.org/download/nginx-1.10.1.tar.gz>`_  
| 31 May 2016  
| `changelog <https://nginx.org/en/CHANGES-1.10>`__  

Mainline
^^^^^^^^
| `NGINX 1.11.3 <https://nginx.org/download/nginx-1.11.3.tar.gz>`_  
| 26 Jul 2016  
| `changelog <https://nginx.org/en/CHANGES>`__  

Source code repository is at `hg.nginx.org/nginx <http://hg.nginx.org/nginx>`_.

Older versions can be found `here <https://nginx.org/en/download.html>`_.


Building NGINX From Source
^^^^^^^^^^^^^^^^^^^^^^^^^^
After extracting the source, run these commands from a terminal:

.. code-block:: bash

  ./configure
  make
  sudo make install

By default, NGINX will be installed in ``/usr/local/nginx``. You may change this and other options with the :doc:`installoptions`.

You might also want to peruse the :doc:`3rd party modules <../../../modules/index>`, since these must be built at compile-time.


Other Systems
^^^^^^^^^^^^^

* :doc:`solaris_10_u5`
* :doc:`solaris_11`
* :doc:`openbsd`

.. warning:: These pages are not thoroughly, if at all, reviewed for accuracy as they are on this page.

After Installing
----------------

There are many different example configurations that can be found in :doc:`../../index` section. Also the :doc:`config_pitfalls` page will help keep you from making mistakes that so many users before you did.

References
----------
`Original Documentation <https://nginx.org/en/docs/install.html>`_
