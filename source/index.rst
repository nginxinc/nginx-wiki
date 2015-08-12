Welcome to Nginx Wiki's documentation!
======================================

Nginx is a free, open-source, high-performance HTTP server and reverse proxy,
as well as an IMAP/POP3 proxy server. Nginx is known for its high performance,
stability, rich feature set, simple configuration, and low resource consumption.

Nginx is one of a handful of servers written to address the `C10K problem <http://www.kegel.com/c10k.html>`_. Unlike traditional servers, Nginx doesn't rely on threads to handle requests.
Instead it uses a much more scalable event-driven (asynchronous) architecture.
This architecture uses small, but more importantly, predictable amounts of
memory under load. Even if you don't expect to handle thousands of simultaneous
requests, you can still benefit from Nginx's high-performance and small memory
footprint. Nginx scales in all directions: from the smallest VPS all the way up
to large clusters of servers.

Nginx powers several high-visibility sites, such as `Netflix <http://www.netflix.com/>`_, `Hulu <http://www.hulu.com/>`_, `Pinterest <http://www.pinterest.com/>`_, `CloudFlare <http://www.cloudflare.com/>`_, `Airbnb <http://www.airbnb.com/>`_, `WordPress.com <http://www.wordpress.com/>`_, `GitHub <http://github.com/>`_, `SoundCloud <http://www.soundcloud.com/>`_, `Zynga <http://www.soundcloud.com/>`_, `Eventbrite <http://www.eventbrite.com/>`_, `Zappos <http://www.zappos.com/>`_, `Media Temple <http://www.mediatemple.net/>`_, `Heroku <http://www.heroku.com/>`_, `RightScale <http://www.rightscale.com/>`_, `Engine Yard <http://www.engineyard.com/>`_, `MaxCDN <http://maxcdn.com/>`_ and many others.

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

.. |moduleicon| replace:: :icon:`puzzle-piece`
.. _moduleicon: modules/index.html

.. |moduletext| replace:: 3\ :sup:`rd` Party Modules
.. _moduletext: modules/index.html

.. |communityicon| replace:: :icon:`users`
.. _communityicon: community/index.html

.. |communitytext| replace:: Community
.. _communitytext: community/index.html

.. |startedicon| replace:: :icon:`play`
.. _startedicon: start/index.html

.. |startedtext| replace:: Getting Started
.. _startedtext: start/index.html

.. |contribicon| replace:: :icon:`wrench`
.. _contribicon: contributing/index.html

.. |contribtext| replace:: Contributing
.. _contribtext: contributing/index.html
