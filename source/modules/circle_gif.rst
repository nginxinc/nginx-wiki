Circle Gif
==========

Description
-----------

**ngx_http_circle_gif_module** - Generates simple circle images with the colors and size specified in the URL. The images are served quickly, much faster than if they had been read from disk. The module was made to help web designers change the colors of their "round corners" without having to fire up PhotoShop. 

Example usage:

.. code-block:: nginx

  location /circles {
      circle_gif;
  }

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <circle_gif.installation_>`_.

Directives
----------

circle_gif
^^^^^^^^^^

:Syntax: ``circle_gif``
:Default: *none*
:Context: *location*

circle_gif_min_radius
^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``circle_min_radius`` *radius*
:Default: ``10``
:Context: *location*

The minimum radius of generated circle images, in pixels.

circle_gif_max_radius
^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``circle_max_radius`` *radius*
:Default: ``20``
:Context: *location*

The maximum radius of generated circle images, in pixels.

circle_gif_step_radius
^^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``circle_step_radius`` *step*
:Default: ``2``
:Context: *location*

The *step* in between generated circle images, in pixels.

Usage
-----

To retrieve a circle image, just call a URL in the location you specified that ends like

.. code-block:: HTML

  <background color>/<foreground color>/<radius>.gif

Where *radius* is the radius in pixels, and the colors are 24-bit hex colors (e.g., ``ffffff`` is white and ``000000`` is black). For example, with the configuration above, this URL would produce a black on white circle with a radius of 20 pixels:

.. code-block:: HTML

  /circles/ffffff/000000/20.gif

.. _circle_gif.installation:

Installation
------------

You first need the ImageMagick development headers.

This module is not distributed with the Nginx source. You can download the circle_gif module `here <http://wiki.nginx.org/File:Nginx_circle_gif-0.1.3.tar.gz>`_.

After extracting, add the following option to your Nginx ``./configure`` command:

.. code-block:: HTML

  --add-module=path/to/circle_gif/directory

Then ``make`` and ``make install`` as usual.

Bugs
----

Please report bugs to `Evan Miller <http://evanmiller.org>`_.
