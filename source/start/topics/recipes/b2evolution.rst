server {
  listen 80;
  server_name b2evolution.blog www.b2evolution.blog;
  root /var/www/b2evolution;
  index index.php index.htm index.html;

location / {
    index index.php;
    try_files $uri $uri/ @b2evo;
  }

location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        try_files $uri /htsrv/getfile.php?$args;
                expires max;
                log_not_found off;
        }

location @b2evo {
    rewrite ^(.*) /index.php?$1 last;
  }

location /api/ {
auth_basic          off;
rewrite "^/api/v(?<version>[^/]+)/(?<parameters>(.+))$" /htsrv/rest.php?api_version=$version&api_request=$parameters last;
  }

  location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    fastcgi_pass           unix:/run/php/php7.0-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  }

}
