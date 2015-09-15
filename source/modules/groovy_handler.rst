
.. meta::
   :description: The Groovy module is used for embedding or Groovy programs.

Groovy
======

`Nginx-Clojure <http://nginx-clojure.github.io>`_ is a NGINX module for embedding Clojure or Java or Groovy programs, typically those `Ring <ring-clojure/ring/blob/master/SPEC>` based handlers.

There are some simple examples about Groovy handler.

Inline Groovy Handler
---------------------

In nginx.conf

.. code-block:: nginx

  location /groovy {
      handler_type 'groovy';
      handler_code ' 
      import nginx.clojure.java.NginxJavaRingHandler;
      import java.util.Map;
          public class HelloGroovy implements NginxJavaRingHandler {
              public Object[] invoke(Map<String, Object> request){
                  return [200, //http status 200
                         ["Content-Type":"text/html"], //headers map
                         "Hello, Groovy & NGINX!"]; //response body can be string, File or Array/Collection of them
              }
          }
      ';
  }

External Groovy Handler
-----------------------

In nginx.conf

.. code-block:: nginx

  location /groovy {
      handler_type 'groovy';
      handler_name 'mytest.HelloGroovy';
  }

In HelloGroovy.groovy

.. code-block:: groovy

  package mytest;
  import nginx.clojure.java.NginxJavaRingHandler;
  import java.util.Map;
  public class HelloGroovy implements NginxJavaRingHandler {
    public Object[] invoke(Map<String, Object> request){
       return 
       [200,  //http status 200
        ["Content-Type":"text/html"],//headers map
        "Hello, Groovy & NGINX!" //response body can be string, File or Array/Collection of them
        ]; 
    }
  }

More details can be found in `nginx-clojure.github.io <http://nginx-clojure.github.io>`_.
