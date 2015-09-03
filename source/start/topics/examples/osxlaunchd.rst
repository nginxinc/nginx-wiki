
.. meta::
   :description: How to launch an NGINX daemon on a system running OSX.

OSX Launchd
===========

Save this file as ``/System/Library/LaunchDaemons/nginx.plist``

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
                           "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
      <dict>
        <key>Label</key><string>nginx</string>
        <key>Program</key><string>/usr/local/sbin/nginx</string>
        <key>KeepAlive</key><true/>
        <key>NetworkState</key><true/>
        <key>StandardErrorPath</key><string>/var/log/system.log</string>
        <key>LaunchOnlyOnce</key><true/>
      </dict>
    </plist>

You will want to place this in ``/System/Library/LaunchDaemons/nginx.plist``, and it is helpful to issue 

.. code-block:: bash

   launchctl load -F /System/Library/LaunchDaemons/nginx.plist

after which it should behave correctly. Of course, the corresponding unload command is simply "unload", with or without the -F. Note that this launches nginx on boot, rather than when you choose it to. It also tells it to log stderr to syslog, which may not be to your preference (nginx likes to log to /usr/local/log/nginx.err).

