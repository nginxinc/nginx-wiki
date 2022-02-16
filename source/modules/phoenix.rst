
.. meta::
   :description: An NGINX proxy that has improved stability and effective resiliency against man-in-the-middle attacks coming from network .

NGINX Phoenix edition (v0.7)
============================


Description
-----------
**mod_NGINX_phoenix** - is making your NGINX resilient by restarting the proxy from a pristine state periodically. In the upcoming versions users will be able to define complex strategies (time based, trigger based and combined) .

This module is written by Team Phoenix at `R6 Security <https://r6security.com/>`_. You can contact them for a roadmap and other info on a full and commercial version which supports a wider variety of aforementioned strategies.

The most recent package can be downloaded here:
:github:`GitHub <R6-Security-Phoenix/mod-nginx-phoenix>`

.. note:: *This module is not distributed with the NGINX source. See the installation instructions.*



Installation
------------
Download the most recent package from github as described above.

After downloading, add the following option to your NGINX ``./configure`` command:

  .. code-block:: bash

    --add-module=path/to/mp4_streaming_lite/directory


By default, NGINX uses -O to compile the source code. You should use:

  .. code-block:: bash

    --with-cc-opt='-O3'

with ``./configure`` to retrieve maximum performance.

Enjoy and give us feedback at support@r6security.com
