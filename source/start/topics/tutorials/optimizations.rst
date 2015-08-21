
.. meta::
   :description: This page describes ways to optimize your NGINX configurations to improve your request processing speed.

Optimizations
=============

Hash Tables
-----------

To assist with the rapid processing of requests, Nginx uses hash tables.

During startup and with each reconfiguration, Nginx selects the smallest
possible size for the hash tables, taking into account the size of
basket, where keys with the coinciding hashed values fall, would not
exceed the assigned parameter (hash bucket size).

Selection is conducted until the size of table exceeds parameter hash
max size. For the majority of hashes there are directives, which make it
possible to change these parameters. For example, the hash with the
names of servers are controlled by the directives
`server_names_hash_max_size <|HttpCoreModule|#server_names_hash_max_size>`_ and
`server_names_hash_bucket_size <|HttpCoreModule|#server_names_hash_bucket_size>`_.
Parameter hash bucket size is always equalized to the size, multiple
to the size of the line of processor cache. This makes it possible to
accelerate the search for key in hash on processors, after decreasing
the number of turnings to memory. If hash bucket size is equal to the
size of one line of processor cache, then during the search for key the
number of turnings to memory in the worst case will be equal to two -
for the first time for determining the address of basket, and the second
- with the search for key inside the basket. Accordingly, if Nginx gave
out communication about the need for increasing hash max size or hash
bucket size, then it is first necessary to increase the first parameter.

Event Models
------------

Nginx supports the following methods of treating the connections, which
can be assigned by the ``use`` directive:

-  **select** - standard method. Compiled by default, if the current
   platform does not have a more effective method. You can enable or
   disable this module by using configuration parameters
   ``--with-select_module`` and ``--without-select_module``.
-  **poll** - standard method. Compiled by default, if the current
   platform does not have a more effective method. You can enable or
   disable this module by using configuration parameters
   ``--with-poll_module`` and ``--without-poll_module``.
-  **kqueue** - the effective method, used on FreeBSD 4.1+, OpenBSD
   2.9+, NetBSD 2.0 and MacOS X. With dual-processor machines running
   MacOS X using kqueue can lead to kernel panic.
-  **epoll** - the effective method, used on Linux 2.6+. In some
   distrubutions, like SuSE 8.2, there are patches for supporting epoll
   by kernel version 2.4.
-  **rtsig** - real time signals, the executable used on Linux 2.2.19+.
   By default no more than 1024 POSIX realtime (queued) signals can be
   outstanding in the entire system. This is insufficient for highly
   loaded servers; it's therefore necessary to increase the queue size
   by using the kernel parameter ``/proc/sys/kernel/rtsig-max``.
   However, starting with Linux 2.6.6-mm2, this parameter is no longer
   available, and for each process there is a separate queue of signals,
   the size of which is assigned by RLIMIT\_SIGPENDING. When the queue
   becomes overcrowded, nginx discards it and begins processing
   connections using the ``poll`` method until the situation normalizes.
-  **/dev/poll** - the effective method, used on Solaris 7 11/99+, HP/UX
   11.22+ (eventport), IRIX 6.5.15+ and Tru64 UNIX 5.1A+.

..
   Dead link now
   -  **eventport** - the effective method, utilized in Solaris 10. To
      avoid kernel panic, it is necessary to install
      `this <http://sunsolve.sun.com/search/document.do?assetkey=1-26-102485-1>`__
      security patch.

References
----------

`Original Hash Tables
Documentation <http://nginx.org/en/docs/hash.html>`__

`Original Events Documentation
(russian) <http://nginx.org/ru/docs/events.html>`__
