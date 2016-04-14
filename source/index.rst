
.. meta::
   :description: This is the NGINX Wiki. NGINX is a free, open-source, high-performance HTTP server, reverse proxy, and IMAP/POP3 proxy server.

Welcome to NGINX Wiki's documentation!
======================================

NGINX is a free, open-source, high-performance HTTP server and reverse proxy,
as well as an IMAP/POP3 proxy server. NGINX is known for its high performance,
stability, rich feature set, simple configuration, and low resource consumption.

NGINX is one of a handful of servers written to address the `C10K problem <http://www.kegel.com/c10k.html>`_. Unlike traditional servers, NGINX doesn't rely on threads to handle requests.
Instead it uses a much more scalable event-driven (asynchronous) architecture.
This architecture uses small, but more importantly, predictable amounts of
memory under load. Even if you don't expect to handle thousands of simultaneous
requests, you can still benefit from NGINX's high-performance and small memory
footprint. NGINX scales in all directions: from the smallest VPS all the way up
to large clusters of servers.

NGINX powers several high-visibility sites, such as `Netflix <https://www.netflix.com/>`_, `Hulu <http://www.hulu.com/>`_, `Pinterest <https://www.pinterest.com/>`_, `CloudFlare <https://www.cloudflare.com/>`_, `Airbnb <https://www.airbnb.com/>`_, `WordPress.com <https://wordpress.com/>`_, `GitHub <https://github.com/>`_, `SoundCloud <https://soundcloud.com/>`_, `Zynga <https://www.zynga.com/>`_, `Eventbrite <https://eventbrite.com/>`_, `Zappos <http://www.zappos.com/>`_, `Media Temple <https://mediatemple.net/>`_, `Heroku <https://www.heroku.com/>`_, `RightScale <http://www.rightscale.com/>`_, `Engine Yard <https://www.engineyard.com/>`_, `MaxCDN <https://maxcdn.com/>`_ and many others.

.. _introtable:

+----------------+------------------+---------------+----------------+
| |startedicon|_ | |communityicon|_ | |moduleicon|_ | |contribicon|_ |
+----------------+------------------+---------------+----------------+
| |startedtext|_ | |communitytext|_ | |moduletext|_ | |contribtext|_ |
+----------------+------------------+---------------+----------------+

.. toctree::
   :hidden:

   start/index
   community/index
   modules/index
   contributing/index
   nginScript
   extending/index

.. |moduleicon| replace:: :icon:`puzzle-piece`
.. _moduleicon: modules/index.rst

.. |moduletext| replace:: 3\ :sup:`rd` Party Modules
.. _moduletext: modules/index.rst

.. |communityicon| replace:: :icon:`users`
.. _communityicon: community/index.rst

.. |communitytext| replace:: Community
.. _communitytext: community/index.rst

.. |startedicon| replace:: :icon:`play`
.. _startedicon: start/index.rst

.. |startedtext| replace:: Getting Started
.. _startedtext: start/index.rst

.. |contribicon| replace:: :icon:`wrench`
.. _contribicon: contributing/index.rst

.. |contribtext| replace:: Contributing
.. _contribtext: contributing/index.rst
