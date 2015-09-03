
.. meta::
   :description: An example of how to use dynamic SSI in your NGINX configuration.

Dynamic SSI Example
===================

It took a little while to figure this out and it's handy for creating one-off sites with "dynamic" content without a web framework.

.. code-block:: nginx

    user nginx;
    worker_processes  1;

    events {
        worker_connections  1024;
    }

    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile      on;
        tcp_nopush    on;
        keepalive_timeout 10;
        gzip          on;

        server {
            server_name  localhost;
            charset      utf-8;
            access_log   /var/log/nginx/access.log;

            root    /var/www;

            location = / {
                rewrite ^ /home redirect;
            }

            location / {
                ssi on;
                set $inc $request_uri;
                if (!-f $request_filename) { 
                    rewrite ^ /index.html last;     
                }
                if (!-f $document_root$inc.html) {
                    return 404;
                }
            }
        }
    }

Then if you have an index.html file similar to this:

.. code-block:: html

    <html>
      <body>
        <!--# include file="$inc.html" -->
      </body>
    </html>

it will now include (via SSI) whatever page is requested.   So for example /home would include home.html into index.html.  This makes it easy to have a common style (headers and footers) without resorting to PHP or a framework.


It assumes home.html exists.

