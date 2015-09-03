
.. meta::
   :description: An example NGINX configuration that uses the valid_referers directive to handle referer spam.

Referer Spam Blocking
=====================

Referer spam is where someone will hit your site with the referer section of 
the browser request set to be a site they want to drive traffic to. The idea is 
to have links to those sites how up in any public stats pages you may have - 
which are common for blogs and forums.

With NGINX you can use the valid_referers module to handle this:

.. code-block:: nginx

   location / {
     valid_referers none blocked *.badreferer1.com badreferer2.com *.badreferer3.com badreferer4.net;
    
     if ($invalid_referer) {
       return   403;
     }
   }

Where you replace the badreferer domains with the referer domains that you wish 
to block.
