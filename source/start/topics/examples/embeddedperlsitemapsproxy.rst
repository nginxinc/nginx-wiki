
.. meta::
   :description: An example NGINX configuration that acts as a proxy that serves sitemaps dynamically.

Embedded Perl Sitemaps Proxy
============================

We run a CMS hosting business.

Each website is hosted on its own domain and for each website a sitemap.xml is dynamically generated on the fly when requested.

These sitemaps are useful to feed your urls to the search engines. https://www.sitemaps.org/index.html

Normally it is the job of the site-owner/webmaster to submit these sites to the search engine. Some do and some dont.

We wanted to serve all these sites dynamically and here is how it is done with NGINX and perl module.

Note: There might be other easier way of doing this but IANASEO.

Goals: 
1. A central server that lists a master-map of all domains and let the search engines spider them.
2. Cross-domain submitting. Domains in our master-map should allow the central server to serve the sitemap.

Changes on ``robots.txt`` (also a dynamic script)
sitemap: http://sitemaps.example.com/domain-name.com-sitemap.xml

So the ``robots.txt`` looks something like this

.. code-block:: properties

    User-agent: *
    Disallow: /cgi-bin/
    Disallow: /tmp/
    Disallow: /cache/
    Disallow: /class/
    Disallow: /images/
    Disallow: /include/
    Disallow: /install/
    Disallow: /kernel/
    Disallow: /language/
    Disallow: /templates_c/
    Disallow: /themes/
    Disallow: /uploads/
    sitemap: http://sitemaps.worldsoft-cms.info/ispman.net-sitemap.xml

The domain-name.com is ofcoarse replaced with the correct name.
This sends all sitemaps requests to a central server running NGINX.

nginx.conf (related parts only):

.. code-block:: nginx

    http {
      include       mime.types;
      default_type  application/octet-stream;

      perl_modules lib;
      perl_require Sitemap.pm;

      keepalive_timeout  65;

      server {
        listen       8090;
        server_name  sitemaps.worldsoft-cms.info;

        location / {
          root   html;
          index  index.html index.htm;
          if (!-f $request_filename) {
            rewrite ^/(.*)-sitemap.xml$ /sitemap/$1 last;
            # If a file matches somethingsomething-sitemap.xml 
            # then redirect it to /sitemap/somethingsomething
            # here somethingsomething will match a domain
          }
        }

        location /sitemap {
          perl Sitemap::handler;
        }
      }
    }

lib/Sitemap.pm:

.. code-block:: perl

    package Sitemap;
    use nginx;
    use LWP::Simple;

    our $basedir="/usr/local/sitemapnginx/html";

    sub handler {
      my $r=shift;
      my $uri=$r->uri;
      $uri=~ s!^/*sitemap/*!!g;
      $uri=~ s!/.*!!g;
      # now $uri has just the domain name such as nginx.com

      my $sitemap_url="http://$uri/sitemap.xml";
      # Get the sitemap from something like http://ispman.net/sitemap.xml (this is dynamic and fresh)

      my $sitemap_data=get($sitemap_url);
      # if the result does not include this string, return 404 Not found.
      return 404 if $sitemap_data !~ m/urlset/; 

      # if found, then cache it.
      my $sitemap_file="$basedir/$uri-sitemap.xml";
      open "F", ">$sitemap_file";
      print F $sitemap_data;
      close("F");
      $r->send_http_header("application/xml");
      # return the cached file
      $r->sendfile($sitemap_file);
      $r->flush;
      return OK;
    }

    1;


Example master-map:

.. code-block:: xml

    <?xml version='1.0' encoding='UTF-8'?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain0.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain1.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain2.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain3.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain4.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain5.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain6.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain7.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain8.de-sitemap.xml</loc></url>
    <url><loc>http://sitemaps.worldsoft-cms.info/demo-domain9.de-sitemap.xml</loc></url>
    ...
    ...
    ...
    ... thousands of lines later ...
    </urlset>

