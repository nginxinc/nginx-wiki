
.. meta::
   :description: How to use NGINX to interface with PHP on windows using a FastCGI daemon.

PHP-FastCGI on Windows
======================

Overview
--------
NGINX can interface with PHP on Windows via a FastCGI daemon, which ships with PHP: php-cgi.exe. 
You need to run ``php-cgi.exe -b 127.0.0.1:<port>`` and use ``fastcgi_pass_ 127.0.0.1:<port>;`` in the NGINX configuration file. 
After being launched, ``php-cgi.exe`` will keep listening for connections in a command prompt window. 
To hide that window, use the tiny utility `RunHiddenConsole <http://redmine.lighttpd.net/attachments/660/RunHiddenConsole.zip>`_ 

.. 
  Dead link
  (the original can be found at http://www.msfn.org/board/index.php?act=ST&f=70&t=49184 but downloading requires signing up for the message board and the binaries are identical - md5sum abc6379205de2618851c4fcbf72112eb).



Steps
-----
#. Install `NGINX for Win32 <install_win32_binaries_>_`.
#. Install the `Windows binaries of PHP <http://windows.php.net/>`_, making sure that ``php-cgi.exe`` is installed in the same directory as ``php.exe``.
#. Create somewhere (e.g. in ``c:\nginx\``) a batch file ``start-php-fcgi.bat`` similar to this one:

  start-php-fcgi.bat
  
  .. code-block:: bat

    @ECHO OFF
    ECHO Starting PHP FastCGI...
    set PATH=C:\PHP;%PATH%
    c:\bin\RunHiddenConsole.exe C:\PHP\php-cgi.exe -b 127.0.0.1:9123

  nginx.conf
  
  .. code-block:: nginx

    root c:/www;

    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9123;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }



Autostarting PHP and NGINX
--------------------------
#. Schedule a basic (on Windows Vista) task to run the batch file above at system start up under the SYSTEM account. 
#. If using Windows NGINX from http://kevinworthington.com/nginx-for-windows/, schedule a basic (on Windows Vista) task to run ``C:\nginx\conf\start-nginx.bat`` file at system start up under the SYSTEM account in starting directory ``C:\nginx``. 
#. A home made Cygwin build of NGINX can be scheduled using a batch file similar to this:

  .. code-block:: bash
    
    cd /d C:\cygwin\bin && bash -c /usr/local/nginx/sbin/nginx
