
.. meta::
   :description: A sample NGINX configuration for Yii.

Yii
===

Recipe
------

This configuring gives SEF URLs for Yii


Nginx configuration
^^^^^^^^^^^^^^^^^^^

.. code-block:: nginx

    server {
            server_name domain.tld;

            root /usr/share/nginx/html;
            index index.html index.php;

            #Yii Specific location configurations.

            #SEF URLs for sampleapp. 
            location /sampleapp {
             rewrite ^/sampleapp/(.*)$ /sampleapp/index.php?r=$1;
            }

            location ~ /(protected|framework|nbproject) {
                deny all;
                access_log off;
                log_not_found off;
            }

            location ~ /themes/\w+/views {
                deny all;
                access_log off;
                log_not_found off;
            }

            location ~ \.(js|css|png|jpg|gif|swf|ico|pdf|mov|fla|zip|rar)$ {
                    try_files $uri =404;
            }

            #End Yii Specific specific location configurations.

            location ~ \.php$ {
                    root            /usr/share/nginx/html;
                    fastcgi_pass    127.0.0.1:9000;
                    fastcgi_index   index.php;
                    fastcgi_param   SCRIPT_FILENAME /usr/share/nginx/html/$fastcgi_script_name;
                    fastcgi_split_path_info ^(.+\.php)(/.+)$;
                    include         fastcgi_params;
            }


    }

Yii confugration
^^^^^^^^^^^^^^^^

After this, make sure that your Yii configuration file (main.php) for your app( sampleapp) contains the following information to enable SEF URLs in the app:

.. code-block:: php

                'urlManager'=>array(
                        'urlFormat'=>'path',
                        'showScriptName'=>false,
                        'rules'=>array(
                                '<controller:\w+>/<id:\d+>'=>'<controller>/view',
                                '<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
                                '<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
                        ),
                )

