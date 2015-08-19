
.. meta::
   :description: The Accept Language module parses Accept-Language HTTP headers to choose the most suitable locale for the user.

Accept Language Module
======================


Description
-----------
**nginx_accept_language_module** - Parses the Accept-Language header and gives 
the most suitable locale for the user from a list of supported locales from 
your website.

Available on github at :github:`giom/nginx_accept_language_module`

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <accept_language.installation_>`_.



Example Configuration
---------------------
.. code-block:: nginx

  set_from_accept_language $lang en ja pl;

where ``$lang`` is the variable in which to store the locale and ``en ja pl`` 
are the locales supported by your website

If none of the locales from ``accept_language`` is available on your website, 
it sets the variable to the first locale of your website's supported locales 
(in this case ``en``).
 
.. note:: It currently assumes that the accept-language is sorted by quality 
  values (from my tests it's the case for Safari, Firefox, Opera and IE) and 
  discards q (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html). In 
  the situation where I'm using the module, this assumption works... but buyer 
  beware :-)



.. _accept_language.installation:

Installation
------------
1. Download the module source from :github:`GitHub <giom/nginx_accept_language_module>`

2. Unpack, and then compile Nginx with:

  .. code-block:: bash

    $ ./configure --add-module=path/to/nginx_accept_language_module



Why did I create it?
--------------------
I'm using page caching with merb on a multi-lingual website and I needed a way to serve the correct language page from the cache.

..
   Commenting out this bit due to dead link - LinuxJedi
   I'll soon put an example on http://gom-jabbar.org



Bugs
----
Send Bugs to Guillaume Maury (dev@gom-jabbar.org)



Credits
-------
Thanks to Evan Miller for his `guide on writing nginx modules <http://www.evanmiller.org/nginx-modules-guide.html>`_.



Alternative
-----------
You can manage *$language_suffix* by this setting when you cannot add this module into your system.

.. code-block:: nginx

  # accept-language: en,en-US;q=0.8,ja;q=0.6
  set $first_language $http_accept_language;
  if ($http_accept_language ~* '^(.+?),') {
      set $first_language $1;
  }

  set $language_suffix 'en';
  if ($first_language ~* 'ja') {
      set $language_suffix 'ja';
  }

