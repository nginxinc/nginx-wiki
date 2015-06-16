Java
====

[http://nginx-clojure.github.io Nginx-Clojure] is a Nginx module for embedding Clojure or Java or Groovy programs, typically those [https://github.com/ring-clojure/ring/blob/master/SPEC Ring] based handlers.

There is a simple example about Java handler.

in nginx.conf

       location /myJava {
          handler_type 'java';
          handler_name 'mytest.Hello';
       }


In Hello.java

       package mytest;
       import static nginx.clojure.MiniConstants.*;
       import java.util.HashMap;
       import java.util.Map;
       public  class Hello implements NginxJavaRingHandler {
       
               @Override
               public Object[] invoke(Map<String, Object> request) {
                   return new Object[] { 
                           NGX_HTTP_OK, //http status 200
                           ArrayMap.create(CONTENT_TYPE, "text/plain"), //headers map
                           "Hello, Java & Nginx!"  //response body can be string, File or Array/Collection of them
                           };
               }
           }




More details can be found in [http://nginx-clojure.github.io nginx-clojure.github.io]
