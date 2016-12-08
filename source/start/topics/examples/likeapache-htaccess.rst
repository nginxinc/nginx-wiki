
.. meta::
   :description: You might think that you want to use .htaccess in your NGINX configuration, but you don't. Here's why.

Like Apache: .htaccess
======================

You can't do this. 
You shouldn't. 
If you need .htaccess, you're probably doing it wrong.



Why?
----
This is a great question. 
For starters, for .htaccess to work Apache needs to check EVERY directory in the requested path for the existence of a .htaccess file and if it exists it reads EVERY one of them and parses it. 
This happens for EVERY request. 
Remember that the second you change that file, it's effective. 
This is because Apache reads it every time.



Numbers
-------
``http://example.com/site/files/images/layout/header.png``

Let's say we're not doing any funky aliasing and the file system looks like the path. 
This covers most of the sites out there. 
There is the / directory, then site/, files/, images/, and layout/. 
This amounts to 5 directories that could have a .htaccess file. 
Let's say you added a .htaccess in /, files/ and images/. 
That's three .htaccess files. 
That's pretty typical.

Now the numbers, that's 6 file system stats and 4 file system reads. 
Including one for the requested file. This happens for every read. 
We'll ignore parsing time because both NGINX and Apache need to do this and we'll consider the difference in time for this negligible.

+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| Requests / Hour | NGINX FS Stats | NGINX FS Reads | Apache FS Stats | Apache FS Reads | Comment                                                      |
+=================+================+================+=================+=================+==============================================================+
| 1               | 1              | 1              | 6               | 4               | Single Request [Pretty much no load]                         |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| 10              | 10             | 10             | 60              | 40              | Ten Requests [Pretty much no load]                           |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| 3,600           | 3,600          | 3,600          | 21,600          | 14,400          | 1 req/sec [Very low load]                                    |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| 144,000         | 144,000        | 144,000        | 864,000         | 576,000         | 40 req/sec [Moderate traffic - nothing very large]           |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| 324,000         | 324,000        | 324,000        | 1,944,00        | 1,296,000       | 90 req/sec [Higher traffic site - not massive]               |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+
| 576,000         | 576,000        | 576,000        | 3,456,000       | 2,304,000       | 160 req/sec [Pretty high traffic - still not massive though] |
+-----------------+----------------+----------------+-----------------+-----------------+--------------------------------------------------------------+

More Numbers
------------
The default for Apache is to use AllowOverride All. Let's look at this for a Drupal website. 
One image for the theme. 
If you're website DocRoot is at ``/var/www/drupal6/`` then we just added more file system stats. 
This adds 3 stats per request. 
This is an incredibly common Apache/Drupal setup. 
It's the end result of countless guides out there.

``/var/www/drupal6/sites/example.com/themes/yourtheme/images/layout/header.png``

Two .htaccess files will be in this path unless you create your own. 
I'll be assuming you added one in /var/www/ because this is common.

+-----------------+----------------+----------------+-----------------+-----------------+-------------+
| Requests / Hour | NGINX FS Stats | NGINX FS Reads | Apache FD Stats | Apache FS Reads | Comment     |
+=================+================+================+=================+=================+=============+
| 144,000         | 144,000        | 144,000        | 1,296,000       | 576,000         | 40 req/sec  |
+-----------------+----------------+----------------+-----------------+-----------------+-------------+
| 324,000         | 324,000        | 324,000        | 2,916,000       | 1,296,000       | 90 req/sec  |
+-----------------+----------------+----------------+-----------------+-----------------+-------------+
| 576,000         | 576,000        | 576,000        | 51,840,000      | 2,304,000       | 160 req/sec |
+-----------------+----------------+----------------+-----------------+-----------------+-------------+



Conclusion
----------
Stop using .htaccess. 
It's horrible for performance. 
NGINX is designed to be efficient. 
Adding something like this destroys that.
