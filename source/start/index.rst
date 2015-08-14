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
   topics/examples/simplecgi
   topics/examples/simplepythonfcgi
   topics/examples/fcgiwrap
   topics/examples/fastcgiexample
   topics/examples/javaservers
   topics/examples/x-accel
   topics/examples/likeapache
   topics/examples/likeapache-htaccess
   topics/examples/separateerrorloggingpervirtualhost
   topics/examples/imapproxyexample
   topics/examples/imapauthenticatewithapachephpscript
   topics/examples/headers_management
   topics/examples/source_tricks
   topics/examples/coding_style
   topics/examples/initscripts
   topics/recipes/alkaline
   topics/recipes/cms_made_simple
   topics/recipes/codeigniter
   topics/recipes/drupal
   topics/recipes/dokuwiki
   topics/recipes/elgg
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
   topics/depth/ifisevil
   topics/tutorials/gettingstarted
   topics/tutorials/install
   topics/tutorials/installoptions
   topics/tutorials/commandline
   topics/tutorials/dynamic_php
   topics/tutorials/config_pitfalls
   topics/tutorials/debugging
   topics/tutorials/optimizations
   topics/tutorials/solaris_10_u5
   topics/tutorials/solaris_11

We have this handy :doc:`getting started<topics/tutorials/gettingstarted>` document to get you going. There is also the following resources:

* `Igor's introductory docs <http://nginx.org/en/docs/introduction.html>`_
* `Guide to the most common web stack <http://michael.lustfield.net/content/dummies-guide-nginx>`_
* `Martin's Nginx, PHP, Primer <http://blog.martinfjordvald.com/2010/07/nginx-primer/>`_

Additionally there are examples and tutorials below to help you get up to speed with configuring NGINX the way you want it.

Installing & Configuring NGINX
------------------------------

* :doc:`Installing NGINX<topics/tutorials/install>`
* :doc:`topics/tutorials/installoptions`
* :doc:`NGINX command line<topics/tutorials/commandline>`
* :doc:`Things to Avoid at all Costs<topics/tutorials/config_pitfalls>`
* :doc:`Why IF Really is Evil<topics/depth/ifisevil>`
* :doc:`Serving PHP<topics/tutorials/dynamic_php>`
* :doc:`topics/examples/initscripts`

Pre-canned Configurations
-------------------------

As you learned in the tutorials, most Nginx configuration files are very
similar. You can apply the same logic to most web applications and achieve the
desired result. There are some applications that have weird little quirks that
tend to throw a wrench in things.

Nginx happens to have a very well rounded community that has worked to first
address these quirks and then share the resulting configurations. This has
resulted in many "copy and paste" configurations that are almost guaranteed
to work.

* `ActiveColab <https://www.howtoforge.com/running-activecollab-3-on-nginx-lemp-on-debian-wheezy-ubuntu-12.10>`_
* :doc:`topics/recipes/alkaline`
* `Chive <https://github.com/perusio/chive-nginx>`_
* :doc:`topics/recipes/cms_made_simple`
* :doc:`topics/recipes/codeigniter`
* `Contao <https://www.howtoforge.com/running-contao-2.10.2-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `CS-Cart <https://www.howtoforge.com/running-cs-cart-on-nginx-lemp-on-debian-wheezy-ubuntu-13.04>`_
* :doc:`topics/recipes/dokuwiki`
* :doc:`topics/recipes/drupal`
* :doc:`topics/recipes/elgg`
* `Feng Office <https://www.howtoforge.com/running-feng-office-community-edition-on-nginx-lemp-on-debian-squeeze-ubuntu-11.10>`_
* `Icinga <https://www.howtoforge.com/icinga-configuration-for-nginx-on-debian-wheezy-ubuntu-11.10>`_
* :doc:`topics/recipes/iredmail`
* `Joomla <https://docs.joomla.org/Nginx>`_
* :doc:`topics/recipes/mailman`
* :doc:`topics/recipes/mediawiki`
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
* :doc:`topics/recipes/xenforo`
* :doc:`topics/recipes/yii`
* :doc:`topics/recipes/zend`
* :doc:`topics/recipes/zenphoto`

Other Examples
--------------

Of course, Nginx can do much more. We're barely scratching the surface. If
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
* :doc:`topics/examples/simplecgi`
* :doc:`topics/examples/simplepythonfcgi`
* :doc:`topics/examples/fastcgiexample`
* :doc:`topics/examples/fcgiwrap`
* :doc:`topics/examples/javaservers`
* :doc:`topics/examples/x-accel`
* :doc:`topics/examples/likeapache`
* :doc:`topics/examples/likeapache-htaccess`
* :doc:`topics/examples/separateerrorloggingpervirtualhost`
* :doc:`topics/examples/imapproxyexample`
* :doc:`topics/examples/imapauthenticatewithapachephpscript`

Advanced Topics
---------------

* :doc:`topics/tutorials/debugging`
