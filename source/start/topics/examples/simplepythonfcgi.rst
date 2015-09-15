
.. meta::
   :description: This example NGINX configuration dispatches TurboGears Python using FastCGI.

Dispatching TurboGears Python via FCGI
======================================

This confirmed to run on Mac OS X 10.4.7 under Turbogears 0.9.9 and 1.1a (so, no reason not to run under the 1.0b release).


Information was drawn from the Turbogears trac wiki which shows how to use NGINX to proxy to TG, and the nearby :doc:`fastcgiexample`  page, the latter detailing the PHP/FCGI process.

.. 
   Dead link
   `Turbogears trac wiki <http://trac.turbogears.org/turbogears/wiki/NginxIntegration>`_
   
This is for NGINX/FCGI/Turbogears



Conventions
-----------
Substitute thoughout with the values relevant to your own set-up:

- ``${HOST} = localhost`` - (or whatever you choose)
- ``${PORT} = 8080`` - (or whatever you choose)
- ``${NGINX} = /usr/local/nginx`` - location of NGINX installation
- ``${PROJECTBASE} /opt/projects/wiki20`` - location of Turbogears project
- ``${PROJECTNAME} wiki20``



Getting the required files
--------------------------
Two files are required to be created: ``${NGINX}/scripts/fcgi.py`` and ``${NGINX}/scripts/${PROJECTNAME}.fcgi``.

To create ``${NGINX}/scripts/fcgi.py``:

.. code-block:: bash

  $ mkdir ${NGINX}/scripts 
  $ curl -o ${NGINX}/scripts/fcgi.py http://www.saddi.com/software/py-lib/py-lib/fcgi.py


To create ``${NGINX}/scripts/${PROJECTNAME}.fcgi`` ...

Copy and paste the following to ``${NGINX}/scripts/${PROJECTNAME}.fcgi``. 
Edit the file, navigate to the ``"USER EDIT SECTION"`` and replace each instance of ``${PROJECTBASE}`` and ``${PROJECTNAME}`` with the corresponding values for your project.

.. code-block:: python

  #!/usr/bin/python
  #
  # File name: project.fcgi
  #
  # This module provides the glue for running TurboGears applications behind
  # FastCGI-enabled web servers. The code in this module depends on the fastcgi
  # module downloadable from here:
  #
  # http://www.saddi.com/software/py-lib/py-lib/fcgi.py
  #
  # NOTE: The fcgi.py file needs to be placed in a location that is on the
  # system path, such as the same the directory as the tg_fastcgi.py file
  # or in the base directory of the TG app code.
  #
  # To configure this module, please edit the three variables in the "USER EDIT
  # SECTION" before starting the TG application. Also remember to edit the
  # top of this file with the correct Python installation information.

  import cherrypy
  import sys
  import os
  from os.path import *
  import pkg_resources
  import turbogears

  pkg_resources.require("TurboGears")

  # -- START USER EDIT SECTION
  # -- Users must edit this section --
  code_dir = '${PROJECTBASE}' # (Required) The base directory of the TG app code.
  root_class_name = '${PROJECTNAME}.controllers.Root' # (Required) The fully qualified Root class name.
  project_module_name = '${PROJECTNAME}.config' # (Required) The config module name.
  log_dir = '' # (Optional) The log directory. Default = code_dir.
  # -- END USER EDIT SECTION

  class VirtualPathFilter(object):
      def on_start_resource(self):
          if not cherrypy.config.get('virtual_path_filter.on', False):
       return
   prefix = cherrypy.config.get('virtual_path_filter.prefix', '')
   if not prefix:
       return

   path = cherrypy.request.object_path
   if path == prefix:
       path = '/'
   elif path.startswith(prefix):
       path = path[len(prefix):]
   else:
       raise cherrypy.NotFound(path)
   cherrypy.request.object_path = path


  def tg_init():
      """ Checks for the required data and initializes the application. """

      global code_dir
      global root_class_name
      global log_dir
      global project_module_name
      last_mark = 0

      # Input checks
      if not code_dir or not isdir(code_dir):
          raise ValueError("""The code directory setting is missing.
                              The fastcgi code will be unable to find
                              the TG code without this setting.""")

      if not root_class_name:
          raise ValueError("""The fully qualified root class name must
                              be provided.""")

      last_mark = root_class_name.rfind('.')
      
      if last_mark < 1 or last_mark + 1 == len(root_class_name):
          raise ValueError("""The user-defined class name is invalid.
                              Please make sure to include a fully
                              qualified class name for the root_class
                              value (e.g. wiki20.controllers.Root).""")

      sys.path.append(code_dir)

      # Change the directory so the TG log file will not be written to the
      # web app root.
      if log_dir and isdir(log_dir):
          os.chdir(log_dir)
      else:
          os.chdir(code_dir)
          log_dir = code_dir

      sys.stdout = open(join(log_dir, 'stdout.log'),'a')
      sys.stderr = open(join(log_dir, 'stderr.log'),'a')

      if exists(join(code_dir, "setup.py")):
          turbogears.update_config(configfile=join(code_dir, "dev.cfg"),modulename=project_module_name)
      else:
          turbogears.update_config(configfile=join(code_dir, "prod.cfg"),modulename=project_module_name)

      # Set environment to production to disable auto-reload and
      # add virutal path information.
      cherrypy.config.update({
          'global': {'server.environment': 'production'},
       '/' : { 'virtual_path_filter.on' : True,
       'virtual_path_filter.prefix' : '/bel.fcgi' }
    })

      # Parse out the root class information for Cherrypy Root class.
      package_name = root_class_name[:last_mark]
      class_name = root_class_name[last_mark+1:]
      _temp = __import__(package_name, globals(), locals(), [class_name], -1)
      Root = getattr(_temp, class_name)
      Root._cp_filters = [VirtualPathFilter()]
      cherrypy.root = Root()

  # Main section -
  # Initialize the application, then start the server.
  tg_init()

  from fcgi import WSGIServer
  cherrypy.server.start(initOnly=True, serverClass=None)

  from cherrypy._cpwsgi import wsgiApp
  WSGIServer(application=wsgiApp).run()



Adjust the TurboGears configuration
-----------------------------------
Edit the ``${PROJECTBASE}/dev.cfg`` or ``${PROJECTBASE}/prod.cfg`` file (whichever you are using), uncomment the ``server.socket_port`` assignment and change ``${PORT}`` to a value of your choice 
(make sure nothing else is running on that port, Tomcat defaults to 8080, as does Jetty. Save yourself some time and check first with a ``telnet localhost 8080``, you should see *Connection refused*).

The relevant lines in prod/dev.cfg are::

  server.socket_port=${PORT}



Spawning a FastCGI TurboGears process
-------------------------------------
The lighttpd "spawn-fcgi" script is useful: download, compile and install lighttpd. 
Then (replacing ``${HOST}`` and ``${PORT}`` values appropriately), execute the following::

  /usr/local/bin/spawn-fcgi -a ${HOST} -p ${PORT} -u nobody -f ${NGINX}/scripts/${PROJECTNAME}.fcgi



NGINX configuration
-------------------
Save the following into ``${NGINX}/conf/fastcgi_params``

.. code-block:: nginx

  #fastcgi.conf
  fastcgi_param GATEWAY_INTERFACE CGI/1.1;
  fastcgi_param SERVER_SOFTWARE nginx;

  fastcgi_param QUERY_STRING $query_string;
  fastcgi_param REQUEST_METHOD $request_method;
  fastcgi_param CONTENT_TYPE $content_type;
  fastcgi_param CONTENT_LENGTH $content_length;

  fastcgi_param SCRIPT_NAME $fastcgi_script_name;
  fastcgi_param REQUEST_URI $request_uri;
  fastcgi_param DOCUMENT_URI $document_uri;
  fastcgi_param DOCUMENT_ROOT $document_root;
  fastcgi_param SERVER_PROTOCOL $server_protocol;

  fastcgi_param REMOTE_ADDR $remote_addr;
  fastcgi_param REMOTE_PORT $remote_port;
  fastcgi_param SERVER_ADDR $server_addr;
  fastcgi_param SERVER_PORT $server_port;
  fastcgi_param SERVER_NAME $server_name;

Add the following to the server section of the ``${NGINX}/conf/nginx.conf`` configuration file, changing ``${HOST}`` and ``${PORT}`` as appropriate:

.. code-block:: nginx

  # static files
  location ~ ^/(images|javascript|js|css|flash|media|static)/ {
    root ${PROJECTBASE}/${PROJECTNAME}/static;
  }

  location = /favicon.ico {
    root ${PROJECTBASE}/${PROJECTNAME}/static/images;
  }

  # pass all requests to FastCGI TG server listening on ${HOST}:${PORT}
  #
  location / {
    fastcgi_pass ${HOST}:${PORT};
    fastcgi_index index;
    fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;
    include conf/fastcgi_params;
 }
 


Starting NGINX
--------------
Start NGINX with ``${NGINX}/sbin/nginx``. 
Point your browser to ``http://${HOST}:${PORT}/``, your Turboears project should be serving via FastCGI. 
If so... congratulations.



Performance test software
-------------------------
Basic but usefully free http://www.hpl.hp.com/research/linux/httperf/

Good luck.

.. note:: I left the IP address as ``0.0.0.0`` because it worked for me, whereas ``127.0.0.1`` did not. 
  If you're experiencing difficulties connecting to ``0.0.0.0:8080``, these are both alternative options: ``localhost:8080``, ``127.0.0.1:8080``.
