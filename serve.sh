#!/bin/bash

TMPFILE=`mktemp /tmp/nginx.conf.XXXXXX`
printf "error_log stderr info; pid /dev/null; daemon off; master_process off; events {} http { log_format simple '[\$time_local] \$remote_addr:\$remote_port [\$status]: \$request';access_log /dev/fd/2 simple; server { listen 8080; root .;} types {text.html html;text/css css;}}" >$TMPFILE

if [ -z $NGINX_PATH ]; then
    nginx -c $TMPFILE -p build/dirhtml
else
    $NGINX_PATH/nginx -c $TMPFILE -p build/dirhtml
fi

rm -f $TMPFILE
