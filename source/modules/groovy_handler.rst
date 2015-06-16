Groovy
======

[http://nginx-clojure.github.io Nginx-Clojure] is a Nginx module for embedding Clojure or Java or Groovy programs, typically those [https://github.com/ring-clojure/ring/blob/master/SPEC Ring] based handlers.

There are some simple examples about Groovy handler.

1. Inline Groovy Handler

in nginx.conf
       location /groovy {
          handler_type 'groovy';
          handler_code ' 
               import nginx.clojure.java.NginxJavaRingHandler;
               import java.util.Map;
               public class HelloGroovy implements NginxJavaRingHandler {
                  public Object[] invoke(Map<String, Object> request){
                     return [200, //http status 200
                             ["Content-Type":"text/html"], //headers map
                             "Hello, Groovy & Nginx!"]; //response body can be string, File or Array/Collection of them
                  }
               }
          ';
       }


2. External Groovy Handler

in nginx.conf

       location /groovy {
          handler_type 'groovy';
          handler_name 'mytest.HelloGroovy';
       }


in HelloGroovy.groovy

   package mytest;
   import nginx.clojure.java.NginxJavaRingHandler;
   import java.util.Map;
   public class HelloGroovy implements NginxJavaRingHandler {
      public Object[] invoke(Map<String, Object> request){
         return 
         [200,  //http status 200
          ["Content-Type":"text/html"],//headers map
          "Hello, Groovy & Nginx!" //response body can be string, File or Array/Collection of them
          ]; 
      }
   }

More details can be found in [http://nginx-clojure.github.io nginx-clojure.github.io].
