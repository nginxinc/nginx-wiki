Log Rotation
============

Nginx will re-open its logs in response to the ``USR1`` signal.

.. code-block:: bash

  $ mv access.log access.log.0
  $ kill -USR1 `cat master.nginx.pid`
  $ sleep 1
  $ gzip access.log.0    # do something with access.log.0


References
----------

* `Quick Answer <http://article.gmane.org/gmane.comp.web.nginx.english/2495>`_ 
* `How it works <http://article.gmane.org/gmane.comp.web.nginx.english/583>`_ 
* `Another explanation <http://article.gmane.org/gmane.comp.web.nginx.english/181>`_ 
* `Debian's logrotate script <http://article.gmane.org/gmane.comp.web.nginx.english/586>`_
