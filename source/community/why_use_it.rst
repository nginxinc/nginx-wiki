Why Use Nginx?
==============

There have been a couple benchmarks done that show Nginx to edge out
other lightweight webservers and proxies, and to stomp out the not-so
lightweight ones.

Some people say those benchmarks weren't valid because the competition
wasn't tuned this way or that, etc. I tend to agree that benchmarks only
tell part of the story and that there's little you can do to truly
remove bias from them anyway (has anyone ever seen a benchmark that
everyone agreed was fair? Me either).

Anyway, rather than post links to benchmarks for people to argue over
(you can use Google to find them yourself if you like), instead, what
follows is quotes from people using Nginx in the real world, under real
load, serving real applications and websites.

Please feel free to add your own testimonial, but see the
`Notes <why_use_it.notes_>`_ at the bottom of this page before you do.



Quotes
------
Several of the companies we invested in were able to solve significant scaling
issues by switching their web platforms to NGINX. NGINX transparently and
effectively enables the growth of the largest sites on the Internet today.

-- Thomas Gieselmann, BV Capital.


My advice to anyone running a web site today who is hitting performance
constraints is to investigate whether they can use NGINX. CloudFlare has
been able to scale over the last year to handle more than 15 billion monthly
page views with a relatively modest infrastructure, in large part because
of the scalability of NGINX. Our experience shows that switching to NGINX
enables full utilization of the modern operating system and existing hardware
resources.

-- Matthew Prince, co-founder and CEO of CloudFlare


Both [Apache and Nginx] are capable of serving a huge number of requests per
second, but Apache's performance start decreasing as you add more concurrent
connections whereas Nginx's performance almost doesn't drop!
But here comes the best bit: because Nginx is event-based it doesn't need to
spawn new processes or threads for each request, so its memory usage is very low.
Throughout my benchmark it just sat at 2.5MB of memory while Apache was using a
lot more.

-- `WebFaction <http://blog.webfaction.com/2008/12/a-little-holiday-present-10000-reqssec-with-nginx-2/>`__


I ran a simple test against Nginx v0.5.22 and Apache v2.2.8 using ab (Apache's
benchmarking tool). During the tests, I monitored the system with vmstat and top.
The results indicate that Nginx outperforms Apache when serving static content.
Both servers performed best with a concurrency of 100. Apache used four worker
processes (threaded mode), 30% CPU and 17MB of memory to serve 6,500 requests per
second. Nginx used one worker, 15% CPU and 1MB of memory to serve 11,500 requests
per second.

-- `Linux Journal <http://www.linuxjournal.com/article/10108>`__


Apache is like Microsoft Word, it has a million options but you only need
six. Nginx does those six things, and it does five of them 50 times faster
than Apache.

-- `Chris Lea <http://maisonbisson.com/post/12249/chris-lea-on-nginx-and-wordpress>`_


I currently have Nginx doing reverse proxy of over tens of millions of
HTTP requests per day (thats a few hundred per second) on a single server.
At peak load it uses about 15MB RAM and 10% CPU on my particular configuration
(FreeBSD 6).
Under the same kind of load, Apache falls over (after using 1000 or so
processes and god knows how much RAM), Pound falls over (too many threads,
and using 400MB+ of RAM for all the thread stacks), and Lighty leaks more
than 20MB per hour (and uses more CPU, but not significantly more).

-- `Bob Ippolito <http://www.linkedin.com/in/bobippolito>`__ in the
`TurboGears mailing list <https://groups.google.com/forum/#!topic/turbogears/pWlg6jjj6m0#eac050092252b78d>`_, 2006-08-24


We are currently using Nginx 0.6.29 with the upstream hash module which
gives us the static hashing we need to proxy to Varnish. We are regularly
serving about 8-9k requests/second and about 1.2Gbit/sec through a few Nginx
instances and have plenty of room to grow!

-- `Wordpress.com <https://barry.wordpress.com/2008/04/28/load-balancer-update/>`_


We were using Pound for load balancing at Justin.tv until today. It was
consistently using about 20% CPU, and during spikes would use up to 80% CPU.
Under extremely high load, it would occasionally freak out and break.
We just switched to Nginx, and load immediately dropped to around 3% CPU.
Our pages feel a little snappier, although that might be my imagination.
Not only is the config format easier to understand and better documented,
but it offers a full webserver's complement of functionality. We haven't
hit any spikes yet, but given the current performance I suspect it will
cream Pound.

-- `Emmett Shear <http://blog.emmettshear.com/post/2008/03/03/Dont-use-Pound-for-load-balancing>`__


We are using nginx as a primary software for free hosting platforms. I have
developed specific modules for banner inserting and stats calculation in nginx
and now our central server can handle about 150-200Mbit/s of highly fragmented
http-traffic (all files are small).
I think, this is really good result because with any possible tunings of Apache
on the same servers we were not able to handle even 60-80Mbit/s.

-- `Alexey Kovyrin <http://kovyrin.net/2006/04/04/nginx-small-powerful-web-server/>`__


A while back, we changed our frontend IMAP/POP proxy from perdition to nginx...
[and] we’ve now switched over to using nginx for our frontend web proxy as well...
The net result of all this is that each frontend proxy server currently maintains
over 10,000 simultaneous IMAP, POP, Web & SMTP connections (including many SSL
ones) using only about 10% of the available CPU.

-- `FastMail.fm blog <http://blog.fastmail.com/2007/01/04/webimappop-frontend-proxies-changed-to-nginx/>`__


We recently switched over our static content webserver over to Nginx,
easily the most impressive webserver I’ve seen in years. We’re running
it on a machine with 8Gb of memory (along with some other stuff), but
the nginx process is only using a ridiculously small 1.4Mb. In other words,
it barely registers in any measurable way.

-- `Philip Jacob <http://seventhfloor.whirlycott.com/2007/10/05/singing-the-praises-of-nginx/>`__


We've replaced our Squid (reverse proxy) + Apache setup with nginx, and
load average as well as CPU usage have been reduced by half. In addition
to that our benchmarks show that the new setup can handle about two to
three times as many requests per second (RPS) as the old setup.

-- `HowtoForge <https://www.howtoforge.com>`__


We've done some `benchmarks <https://timmehosting.de/benchmarks>`__ for
CMS systems such as Wordpress, Drupal, Joomla, TYPO3, etc., and the
result is that nginx delivers pages up to 50% faster than Apache. At the
same time nginx can handle up to 177% as many requests per second (RPS)
as Apache.

-- `Timme Hosting <https://timmehosting.de>`__


.. _why_use_it.notes:

Notes
-----

Please feel free to add your own testimonial, but we prefer that it
refer to a *high traffic site* or a site that Nginx somehow provided a
*unique* solution for. Also, if numbers (server utilization, network
throughput, simultaneous connections, etc) and/or an actual link to the
site being discussed can be provided it makes it much more relevant for
people curious about Nginx.