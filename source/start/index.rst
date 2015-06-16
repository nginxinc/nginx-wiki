Getting Started
===============

.. toctree::
   :hidden:

   topics/recipes
   topics/depth/ifisevil
   topics/recipes/alkaline
   topics/recipes/drupal
   topics/recipes/mailman
   topics/recipes/pmwiki
   topics/tutorials/basics_linux
   topics/tutorials/config_pitfalls
   topics/tutorials/dynamic_php

Tutorial 1: The Basics
----------------------

You can't just dive in without a clue and hope to achieve something great. Nginx
is NOT Apache. It is not lighttpd. It is not IIS. A successful Nginx deployment
requires basic understanding of your server and of Nginx configuration. In this
tutorial, we aim to get you through the "bare minimum" basics.

1.  :doc:`Getting Started with Linux<topics/tutorials/basics_linux>`

.. todo::
   ..
      2.  :doc:`Getting Started with BSD<topics/tutorials/basics_bsd>`
      3.  :doc:`Getting Nginx Installed<topics/tutorials/basics_installation>`
      4.  :doc:`Serving Hello World<topics/tutorials/basics_hello>`

Tutorial 2: Get Configured
--------------------------

Now that you know what's going on, you're ready to put a configuration together
and get rocking with Nginx. Are you excited yet?

.. todo::
   ..
      1.  :doc:`The Basic Nginx Configuration<topics/tutorials/config_basic>`
      2.  :doc:`The Static Content Configuration<topics/tutorials/config_static>`
      3.  :doc:`The Dynamic Content Configuration<topics/tutorials/config_dynamic>`

4.  :doc:`Things to Avoid at all Costs<topics/tutorials/config_pitfalls>`

Tutorial 3: Dynamic Content
---------------------------

Now that you have the basics out of the way, you're ready to get something a bit
more useful out of Nginx. After all, you probably are interested in serving more
than just static content. Most content on the web is dynamic, this tutorial
focusses on getting you familiar with how Nginx serves dynamic content.

.. todo::
   ..
      1.  :doc:`Why is it Different<topics/tutorials/dynamic_why>`

2.  :doc:`Serving PHP<topics/tutorials/dynamic_php>`

.. todo::
   ..
      3.  :doc:`Serving Python<topics/tutorials/dynamic_python>`
      4.  :doc:`Serving Ruby<topics/tutorials/dynamic_ruby>`

Quick Start
===========

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

.. todo::
   ..
      1.  :doc:`Application Configurations<topics/apps>`

Other Examples
--------------

Of course, Nginx can do much more. We're barely scratching the surface. If
you're interested, you can take a look at some other examples that have been
developed.

.. todo::
   ..
      1.  :doc:`Examples<topics/examples>`

Nginx in Depth
==============

Tricky Concepts
---------------

.. todo::
   ..
      1.  :doc:`Why IF Really is Evil<topics/depth/if>`
      2.  :doc:`How Rewrites Work<topics/depth/rewrites>`
      3.  :doc:`The Tricky Location Blocks<topics/depth/location>`


Advanced Deployments
--------------------
.. todo::
   ..
      1.  :doc:`Compiling Nginx<topics/depth/compiling>`
      2.  :doc:`Adding Aditional Modules<topics/depth/modules>`
      3.  :doc:`Nginx Version Numbers<topics/depth/versions>`
