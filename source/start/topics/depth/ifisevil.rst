If Is Evil
==========

The if directive in nginx suffers from some weird implementation quirks that
one needs to be aware of before they use it. The if directive is consistent,
though, so with proper testing one can safely use it.

Do note that nginx has other directives that are often better suited than
using an if. Please see the Alternative Solution section.

That said, there are quite a few scenarios where using the if directive is the
only possible way to accomplish something, for instance, when checking url
query arguments.

.. code-block:: nginx

    if ($arg_post = 140){
        return 301 http://example.com/;
    }

The following directives are always 100% safe to use in if-in-location context:

* return [...];
* rewrite [...];

Anything else may possibly cause unpredictable behaviour.

If advanced logic is required within the nginx configuration then consider using
one of the third party modules such as the lua module.

Alternative Solutions
---------------------

File System Operations
~~~~~~~~~~~~~~~~~~~~~~

**Short version:** Use try_files directive.

The ever popular check if a file or directory exist is the most popular incorrect
usage of if. Coming from apache the if is the first thing people turn to.

However, nginx has a directive dedicated to check for the existance of files.
The try_files directive takes n amount of path arguments and a fallback argument.

If one of the path arguments matches the internal uri is set to that and the file
is served. Please note that location re-evaluation does not happen.

If the fallback argument matches then the request is internally rewritten to that
uri and location re-evaluation happens. It's also possible to use a named location
as the fallback argument.

.. code-block:: nginx

    location / {
        try_files $uri $uri /index.php;
    }

    location ~* \.php$ {
        # Your typical PHP location.
        # [...]
    }

In some cases it may be good idea to use embedded scripting modules (embedded
perl, or various 3rd party modules) to do the scripting.

Examples
--------

Here are some examples which explain why if-in-location is unpredictable.

.. code-block:: nginx

        # only the second header will be present in the response
        # not really bug, just how it works
        location /only-one-if {
            set $true 1;

            if ($true) {
                add_header X-First 1;
            }

            if ($true) {
                add_header X-Second 2;
            }

            return 204;
        }

        # request will be sent to backend without uri changed
        # to '/' due to if
        location /proxy-pass-uri {
            proxy_pass http://127.0.0.1:8080/;

            set $true 1;

            if ($true) {
                # nothing
            }
        }

        # try_files wont work due to if
        location /if-try-files {
             try_files  /file  @fallback;

             set $true 1;
             if ($true) {
                 # nothing
             }
        }

        # nginx will crash with a segmentation fault.
        location /crash {
            set $true 1;
            if ($true) {
                # fastcgi_pass here
                fastcgi_pass  127.0.0.1:9000;
            }

            if ($true) {
                # no handler here
            }
        }

        # alias with captures isn't correcly inherited into implicit nested
        # location created by if
        location ~* ^/if-and-alias/(?<file>.*) {
            alias /tmp/$file;

            set $true 1;
            if ($true) {
                # nothing
            }
        }

Why This Behavior Is Not a Bug
------------------------------

Directive "if" is a part of the rewrite module which evaluates instructions
imperatively. Conversely, the nginx configuration in general is declarative.
Due to user demand, an attempt was made to enable some non-rewrite directives
inside "if", and this lead to situation we have now. It works, but oddly.
