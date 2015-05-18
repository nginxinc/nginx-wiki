.. Nginx Wiki documentation master file, created by
   sphinx-quickstart on Fri Apr 24 23:04:57 2015.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Nginx Wiki's documentation!
======================================

Nginx is a free, open-source, high-performance HTTP server and reverse proxy,
as well as an IMAP/POP3 proxy server. Nginx is known for its high performance,
stability, rich feature set, simple configuration, and low resource consumption.

Unlike traditional servers, Nginx doesn't rely on threads to handle requests.
Instead it uses a much more scalable event-driven (asynchronous) architecture.
This architecture uses small, but more importantly, predictable amounts of
memory under load. Even if you don't expect to handle thousands of simultaneous
requests, you can still benefit from Nginx's high-performance and small memory
footprint. Nginx scales in all directions: from the smallest VPS all the way up
to large clusters of servers.

Nginx powers several high-visibility sites, such as Netflix, Hulu, Pinterest,
CloudFlare, Airbnb, WordPress.com, GitHub, SoundCloud, Zynga, Eventbrite,
Zappos, Media Temple, Heroku, RightScale, Engine Yard, and many others.

.. _introtable:

+----------------+------------------+---------------+----------------+
| |startedicon|_ | |communityicon|_ | |moduleicon|_ | |contribicon|_ |
+----------------+------------------+---------------+----------------+
| |startedtext|_ | |communitytext|_ | |moduletext|_ | |contribtext|_ |
+----------------+------------------+---------------+----------------+

.. toctree::
   :hidden:

   community/index
   modules/index
   contributing/index
   start/index

.. |moduleicon| replace:: :icon:`puzzle-piece,5x`
.. _moduleicon: modules/index.html

.. |moduletext| replace:: 3\ :sup:`rd` Party Modules
.. _moduletext: modules/index.html

.. |communityicon| replace:: :icon:`users,5x`
.. _communityicon: community/index.html

.. |communitytext| replace:: Community
.. _communitytext: community/index.html

.. |startedicon| replace:: :icon:`play,5x`
.. _startedicon: start/index.html

.. |startedtext| replace:: Getting Started
.. _startedtext: start/index.html

.. |contribicon| replace:: :icon:`wrench,5x`
.. _contribicon: contributing/index.html

.. |contribtext| replace:: Contributing
.. _contribtext: contributing/index.html
