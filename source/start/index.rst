
.. meta::
   :description: Useful tools, examples, and other learning resources for getting started with NGINX.

Getting Started
===============

.. toctree::
   :hidden:

   topics/examples/dynamic_ssi
   topics/examples/full
   topics/examples/fullexample2
   topics/examples/loadbalanceexample
   topics/examples/reverseproxycachingexample
   topics/examples/SSL-Offloader
   topics/examples/logrotation
   topics/examples/server_blocks
   topics/examples/phpfcgi
   topics/examples/phpfastcgionwindows
   topics/examples/simplepythonfcgi
   topics/examples/simplerubyfcgi
   topics/examples/djangofastcgi
   topics/examples/fcgiwrap
   topics/examples/fastcgiexample
   topics/examples/javaservers
   topics/examples/mono
   topics/examples/x-accel
   topics/examples/likeapache
   topics/examples/likeapache-htaccess
   topics/examples/separateerrorloggingpervirtualhost
   topics/examples/imapproxyexample
   topics/examples/imapauthenticatewithapacheperlscript
   topics/examples/imapauthenticatewithapachephpscript
   topics/examples/nonrootwebpath
   topics/examples/headers_management
   topics/examples/source_tricks
   topics/examples/coding_style
   topics/examples/initscripts
   topics/examples/hardwarelberrors
   topics/examples/xsendfile
   topics/examples/memcachepreload
   topics/examples/embeddedperlminifyjs
   topics/examples/embeddedperlsitemapsproxy
   topics/examples/forwarded
   topics/recipes/cms_made_simple
   topics/recipes/codeigniter
   topics/recipes/drupal
   topics/recipes/dokuwiki
   topics/recipes/elgg
   topics/recipes/expressionengine
   topics/recipes/iredmail
   topics/recipes/mailman
   topics/recipes/mediawiki
   topics/recipes/moinmoin
   topics/recipes/mybb
   topics/recipes/omeka
   topics/recipes/oscommerce
   topics/recipes/osticket
   topics/recipes/phplist
   topics/recipes/piwik
   topics/recipes/pmwiki
   topics/recipes/pylons
   topics/recipes/pyrocms
   topics/recipes/qwebirc
   topics/recipes/redmine
   topics/recipes/silverstripe
   topics/recipes/spip
   topics/recipes/symfony
   topics/recipes/wordpress
   topics/recipes/xenforo
   topics/recipes/yii
   topics/recipes/zend
   topics/recipes/zenphoto
   topics/recipes/fcgizope
   topics/recipes/b2evolution
   topics/depth/ifisevil
   topics/tutorials/gettingstarted
   topics/tutorials/install
   topics/tutorials/installoptions
   topics/tutorials/commandline
   topics/tutorials/config_pitfalls
   topics/tutorials/debugging
   topics/tutorials/optimizations
   topics/tutorials/solaris_10_u5
   topics/tutorials/solaris_11
   topics/tutorials/openbsd

We have this handy :doc:`getting started<topics/tutorials/gettingstarted>` document to get you going. There is also the following resources:

* `Igor's introductory docs <http://nginx.org/en/docs/#introduction>`_
* `Guide to the most common web stack <https://michael.lustfield.net/nginx/dummies-guide-to-setting-up-nginx>`_
* `Martin's Nginx, PHP, Primer <http://blog.martinfjordvald.com/2010/07/nginx-primer/>`_

Additionally there are examples and tutorials below to help you get up to speed with configuring NGINX the way you want it.

Installing & Configuring NGINX
------------------------------

* :doc:`Installing NGINX<topics/tutorials/install>`
* :doc:`topics/tutorials/installoptions`
* :doc:`NGINX command line<topics/tutorials/commandline>`
* :doc:`Things to Avoid at all Costs<topics/tutorials/config_pitfalls>`
* :doc:`Why IF Really is Evil<topics/depth/ifisevil>`
* :doc:`topics/examples/initscripts`

Full Stack HOWTOs
-----------------

* `ISPConfig Control Panel including NGINX in Ubuntu 12.04 <https://www.howtoforge.com/perfect-server-ubuntu-12.04-lts-nginx-bind-dovecot-ispconfig-3>`_
* `LEMP Setup on Debian <http://www.binarytides.com/install-nginx-php-fpm-mariadb-debian/>`_
* `PHP-FPM / NGINX Security for Shared Hosting Environments <https://www.howtoforge.com/php-fpm-nginx-security-in-shared-hosting-environments-debian-ubuntu>`_

Pre-canned Configurations
-------------------------

As you learned in the tutorials, most NGINX configuration files are very
similar. You can apply the same logic to most web applications and achieve the
desired result. There are some applications that have weird little quirks that
tend to throw a wrench in things.

NGINX happens to have a very well rounded community that has worked to first
address these quirks and then share the resulting configurations. This has
resulted in many "copy and paste" configurations that are almost guaranteed
to work.

If the web applications with the configuration don't work, please check
whether the simplest web application works. For example, if PHP based web
applications such as mediawiki don't work, please check if PHP FastCGI 
(refer to :doc:`topics/examples/phpfcgi`) works.

* `ActiveColab <https://www.howtoforge.com/running-activecollab-3-on-nginx-lemp-on-debian-wheezy-ubuntu-12.10>`_
* `Chive <https://github.com/perusio/chive-nginx>`_
* :doc:`topics/recipes/cms_made_simple`
* :doc:`topics/recipes/codeigniter`
* `Contao <https://www.howtoforge.com/running-contao-2.10.2-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `CS-Cart <https://www.howtoforge.com/running-cs-cart-on-nginx-lemp-on-debian-wheezy-ubuntu-13.04>`_
* :doc:`topics/recipes/dokuwiki`
* :doc:`topics/recipes/drupal`
* :doc:`topics/recipes/elgg`
* :doc:`topics/recipes/expressionengine`
* `Feng Office <https://www.howtoforge.com/running-feng-office-community-edition-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `Icinga <https://www.howtoforge.com/icinga-configuration-for-nginx-on-debian-wheezy-ubuntu-11.10>`_
* :doc:`topics/recipes/iredmail`
* `Joomla <https://docs.joomla.org/Nginx>`_
* :doc:`topics/recipes/mailman`
* :doc:`topics/recipes/mediawiki`
* `Minio Object Storage <https://docs.minio.io/docs/setup-nginx-proxy-with-minio>`_
* :doc:`topics/recipes/moinmoin`
* :doc:`topics/recipes/mybb`
* :doc:`topics/recipes/omeka`
* :doc:`topics/recipes/oscommerce`
* :doc:`topics/recipes/osticket`
* `ownCloud <https://www.howtoforge.com/running-owncloud-5.0-on-nginx-lemp-on-debian-wheezy>`_
* `OXID eShop <https://www.howtoforge.com/running-oxid-eshop-community-edition-version-4.5.9-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `phpBB <https://raw.githubusercontent.com/phpbb/phpbb3/master/phpBB/docs/nginx.sample.conf>`_
* :doc:`topics/recipes/phplist`
* :doc:`topics/recipes/piwik`
* :doc:`topics/recipes/pmwiki`
* `PrestaShop <https://www.howtoforge.com/running-prestashop-1.5.x-on-nginx-lemp-on-debian-wheezy-ubuntu-12.10>`_
* `ProcessWire <https://www.howtoforge.com/running-processwire-on-nginx-lemp-on-debian-wheezy-ubuntu-13.04>`_
* :doc:`topics/recipes/pylons`
* :doc:`topics/recipes/pyrocms`
* :doc:`topics/recipes/qwebirc`
* `Redaxo <https://www.howtoforge.com/running-redaxo-4.4.x-on-nginx-lemp-on-debian-wheezy-ubuntu-12.10>`_
* :doc:`topics/recipes/redmine`
* `Roundcube <https://www.howtoforge.com/running-roundcube-0.7.1-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `Shopware 3.5.6 <https://www.howtoforge.com/running-shopware-community-edition-version-3.5.6-on-nginx-lemp-on-debian-squeeze-ubuntu-12.04>`_
* `Shopware 4.0.x <https://www.howtoforge.com/running-new-shopware-version-4.0.x-on-nginx-lemp-on-ubuntu-12.04>`_
* :doc:`topics/recipes/silverstripe`
* `Simple Groupware <https://www.howtoforge.com/running-simple-groupware-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* :doc:`topics/recipes/spip`
* `SugarCRM <https://www.howtoforge.com/running-sugarcrm-community-edition-on-nginx-lemp-on-debian-squeeze-ubuntu-11.04>`_
* :doc:`topics/recipes/symfony`
* `TYPO3 4.6 <https://www.howtoforge.com/running-typo3-4.6-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `TYPO3 6.3 <https://www.howtoforge.com/running-typo3-6.2-on-nginx-lemp-on-debian-wheezy-ubuntu-13.10>`_
* :doc:`topics/recipes/wordpress`
* `Wordpress caching <http://kbeezie.com/caching-wordpress/>`_
* :doc:`topics/recipes/xenforo`
* :doc:`topics/recipes/yii`
* :doc:`topics/recipes/zend`
* :doc:`topics/recipes/zenphoto`
* :doc:`topics/recipes/fcgizope`
* :doc:`topics/recipes/b2evolution`

Other Examples
--------------

Of course, NGINX can do much more. We're barely scratching the surface. If
you're interested, you can take a look at some other examples that have been
developed.

* :doc:`topics/examples/full`
* :doc:`topics/examples/fullexample2`
* :doc:`topics/examples/loadbalanceexample`
* :doc:`topics/examples/reverseproxycachingexample`
* :doc:`topics/examples/SSL-Offloader`
* :doc:`topics/examples/logrotation`
* :doc:`topics/examples/server_blocks`
* :doc:`topics/examples/dynamic_ssi`
* :doc:`topics/examples/phpfcgi`
* :doc:`topics/examples/phpfastcgionwindows`
* :doc:`topics/examples/simplepythonfcgi`
* :doc:`topics/examples/simplerubyfcgi`
* :doc:`topics/examples/djangofastcgi`
* :doc:`topics/examples/fastcgiexample`
* :doc:`topics/examples/fcgiwrap`
* :doc:`topics/examples/javaservers`
* :doc:`topics/examples/mono`
* :doc:`topics/examples/x-accel`
* :doc:`topics/examples/likeapache`
* :doc:`topics/examples/likeapache-htaccess`
* :doc:`topics/examples/separateerrorloggingpervirtualhost`
* :doc:`topics/examples/imapproxyexample`
* :doc:`topics/examples/imapauthenticatewithapacheperlscript`
* :doc:`topics/examples/imapauthenticatewithapachephpscript`
* :doc:`topics/examples/nonrootwebpath`
* `NGINX + SSL + SPDY <http://www.mare-system.de/guide-to-nginx-ssl-spdy-hsts/>`_
* `NGINX + PHP FPM + APC on CentOS 6 <http://www.binarytides.com/install-nginx-php-fpm-centos/>`_
* `Adding new vhosts with NGINX, PHP-FPM and Bash <http://www.sebdangerfield.me.uk/2012/05/nginx-and-php-fpm-bash-script-for-creating-new-vhosts-under-separate-fpm-pools/>`_
* `Serving an iPhone website with NGINX <http://nicknotfound.com/2009/01/12/iphone-website-with-nginx/>`_
* :doc:`topics/examples/hardwarelberrors`
* :doc:`topics/examples/xsendfile`
* :doc:`topics/examples/memcachepreload`
* `Block visitors by country <https://www.howtoforge.com/nginx-how-to-block-visitors-by-country-with-the-geoip-module-debian-ubuntu>`_
* :doc:`topics/examples/embeddedperlminifyjs`
* :doc:`topics/examples/embeddedperlsitemapsproxy`
* :doc:`topics/examples/forwarded`

Tools
-----

* `WiNGINX LEMP stack for Windows <http://winginx.com/en/>`_
* `VIM NGINX configuration syntax highlighting <http://www.vim.org/scripts/script.php?script_id=1886>`_
* :github:`Script for enabling/disabling virtual hosts easily <perusio/nginx_ensite>`
* :github:`build-nginx <jaygooby/build-nginx>` - Fetches nginx and any optional third-party modules and dependencies you specify, such as openssl and PCRE and then configures and builds


Advanced Topics
---------------

* :doc:`topics/tutorials/debugging`

Learning Resources
------------------

* `NGINX online courses - A collection of online courses from a wide range of providers <https://classpert.com/nginx>`_
* `Learn NGINX - Top NGINX tutorials ranked by developers <https://gitconnected.com/learn/nginx>`_
* `Programming Community Curated Resources for learning NGINX <https://hackr.io/tutorials/learn-nginx>`_
* `Learn NGINX - Free & Best online courses to learn NGINX  <https://coursesity.com/free-tutorials-learn/nginx>`_
