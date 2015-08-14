Embedded Perl Minify JS
=======================

Example module to minify javascript files
-----------------------------------------

Minimizing the javascript files make them compact hence faster to download.

I use the perl module from CPAN that can be obtained here:
http://search.cpan.org/~pmichaux/JavaScript-Minifier/

For CSS the minify library is available from http://search.cpan.org/~pmichaux/CSS-Minifier-0.01/

You can read more about the origional jsmin here:
http://www.crockford.com/javascript/jsmin.html


nginx.conf
^^^^^^^^^^

.. code-block:: nginx

    http {
      perl_modules perl; 

      # Get this module from the CPAN and put the file in this directory.
      # or install it systemwide
      perl_require Javascript/Minifier.pm; 
      perl_require Minify.pm; 

      root /var/www;
      server {
        location / {
          index  index.html index.htm;
        }
 
        location ~ \.js$  {
          perl Minify::handler;
        }
      } 
    } 

perl/Minify.pm
^^^^^^^^^^^^^^

.. code-block:: perl

    package Minify;
    use nginx;
    use JavaScript::Minifier qw(minify);

    sub handler {
      my $r=shift;
      my $cache_dir="/tmp";  # Cache directory where minified files will be kept
      my $cache_file=$r->uri;
      $cache_file=~s!/!_!g;
      $cache_file=join("/", $cache_dir, $cache_file);
      my $uri=$r->uri;
      my $filename=$r->filename;

      return DECLINED unless -f $filename;

      if (! -f $cache_file) {
        open(INFILE, $filename) or die "Error reading file: $!";
        open(OUTFILE, '>' . $cache_file ) or die "Error writting file: $!";
        minify(input => *INFILE, outfile => *OUTFILE);
        close(INFILE);
        close(OUTFILE);
      }
      $r->send_http_header("application/javascript");
      $r->sendfile($cache_file);
      return OK;
    }
    1;
    __END__

