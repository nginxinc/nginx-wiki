
.. meta::
   :description: An example configuration that shows how to use NGINX as a reverse proxy for Java servers.

Java servers like Jetty, GlassFish and Tomcat
=============================================

You cannot deploy using .war files.
The application files need to be deployed into a folder, because the Java web application folder must be specified for Nginx so that it can find and directly send static files like images (.jpg, .png, .gif), stylesheets (.css) and JavaScript (.js) directly.
These files don't need to be processed by the Java server - just let Nginx do this job.

For this sample we use Jetty, because it has the best performance.

In the below example nginx works as a reverse proxy in the front of Java Servers.



Context of the web application on Jetty
---------------------------------------

Configure the context of your web application by editing ``jetty/contexts/YOUR_WEB_APPLICATION_FOLDER.xml``

Be careful to set the resourceBase (YOUR_WEB_APPLICATION_FOLDER) and virtualHosts (YOUR_DOMAIN) correctly.

.. code-block:: xml

  <?xml version="1.0"?>
  <!DOCTYPE Configure PUBLIC "-//Mort Bay Consulting//DTD Configure//EN" "http://jetty.mortbay.org/configure.dtd">
  <Configure class="org.mortbay.jetty.webapp.WebAppContext">
    <Set name="configurationClasses">
      <Array type="java.lang.String">
        <Item>org.mortbay.jetty.webapp.WebInfConfiguration</Item>
        <Item>org.mortbay.jetty.plus.webapp.EnvConfiguration</Item>
        <Item>org.mortbay.jetty.plus.webapp.Configuration</Item>
        <Item>org.mortbay.jetty.webapp.JettyWebXmlConfiguration</Item>
        <Item>org.mortbay.jetty.webapp.TagLibConfiguration</Item>
      </Array>
    </Set>
    <Set name="contextPath">/</Set>
    <Set name="resourceBase"><SystemProperty name="jetty.home" default="."/>/webapps/YOUR_WEB_APPLICATION_FOLDER</Set>
    <Set name="virtualHosts">
      <Array type="java.lang.String">
        <Item>YOUR_DOMAIN</Item>
       </Array>
    </Set>
    <New id="YOUR_DB_NAME" class="org.mortbay.jetty.plus.naming.Resource">
      <Arg>jdbc/YOUR_DB_NAME</Arg>
      <Arg>
        <New class="org.postgresql.ds.PGConnectionPoolDataSource">
          <Set name="User">postgres</Set>
          <Set name="Password">*****</Set>
          <Set name="DatabaseName">YOUR_DB_NAME</Set>
          <Set name="ServerName">localhost</Set>
          <Set name="PortNumber">5432</Set>
        </New>
      </Arg>
    </New>
  </Configure>



Configure the path to the Java web application
----------------------------------------------

.. code-block:: nginx

  root  /PATH/TO/YOUR/WEB/APPLICATION;



Configure the address of the Java server
----------------------------------------

.. code-block:: nginx

  proxy_pass  http://localhost:8080;



Configure the extensions and the servlet path to be processed by the Java server
--------------------------------------------------------------------------------

.. code-block:: nginx

  location ~ \.do$ {
    proxy_pass        http://localhost:8080;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header  Host $http_host;
  }
  location ~ \.jsp$ {
    proxy_pass        http://localhost:8080;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header  Host $http_host;
  }
  location ^~/servlets/* {
    proxy_pass        http://localhost:8080;
    proxy_set_header  X-Real-IP $remote_addr;
    proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header  Host $http_host;
  }



Server section configuration
----------------------------

.. code-block:: nginx

  server {
    listen          80;
    server_name     YOUR_DOMAIN;
    root            /PATH/TO/YOUR/WEB/APPLICATION;
    location / {
      index index.jsp;
    }
    location ~ \.do$ {
      proxy_pass        http://localhost:8080;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header  Host $http_host;
    }
    location ~ \.jsp$ {
      proxy_pass        http://localhost:8080;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header  Host $http_host;
    }
    location ^~/servlets/* {
      proxy_pass        http://localhost:8080;
      proxy_set_header  X-Real-IP $remote_addr;
      proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header  Host $http_host;
    }
  }



On the same server, protect the Java server from external access
----------------------------------------------------------------

If you are running Nginx on the same server of the Java, the best practice is to deny access to port 8080 so only Nginx can access it. 
On Linux do

.. code-block:: bash
  
  /sbin/iptables -A INPUT -p tcp -i eth0 --dport 8080 -j REJECT --reject-with tcp-reset

If you have only 1 web application with Jetty, you can bind your host to localhost so that Jetty would run only from localhost.

So you don't need to configure iptables to protect external access.

On ``conf/jetty.xml``

.. code-block:: xml

  <Set name="host"><SystemProperty name="jetty.host" default="localhost"/></Set>

Or on embedded Jetty server code:

.. code-block:: java

  Server server = new Server();
  SelectChannelConnector connector = new SelectChannelConnector();
  connector.setHost("localhost"); // bind jetty to run only from localhost
  connector.setPort(8080);
  server.addConnector(connector);
  server.start();
  server.join();

.. seealso:: To embed a java handler in nginx, check out :doc:`../../../modules/clojure`.

.. todo::
   ..
      :doc:`java handler <javahandler>`
