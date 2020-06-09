
.. meta::
   :description: A sample NGINX configuration for Geth (go-ethereum).

Geth (go-ethereum)
==================

Geth (go-ethereum): https://geth.ethereum.org/

A small NGINX recipe that makes Geth's RPC and Websocket interface remotely accessible on a node. With this config RPC becomes remotely accessible at `http://{SERVER_IP}/rpc` and websockets at `http://{SERVER_IP}/ws`.

First start and sync a node on the device with the RPC and websocket endpoints opened, you can use the following command:

.. code-block:: bash

   ./geth --cache 4096 --rpc --rpcaddr "127.0.0.1" --rpccorsdomain "*" --rpcport "8545" --rpcapi "db, eth, net, web3, personal" --ws --wsport 8546 --wsaddr "127.0.0.1" --wsorigins "*" --wsapi "web3, eth" --maxpeers=100


To test with Web3.js you can use the following providers:

.. code-block:: javascript

    var Web3 = require('web3');
    var web3 = new Web3()

    // Replace localhost with remote IP
    web3.setProvider(new Web3.providers.HttpProvider('http://localhost/rpc'));
    web3.setProvider(new Web3.providers.WebsocketProvider('http://localhost/ws'));

Recipe
------

.. code-block:: nginx

  server {

    listen 80;
    listen [::]:80;
    server_name localhost;

    location ^~ /ws {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass   http://127.0.0.1:8546/;
    }

    location ^~ /rpc {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass    http://127.0.0.1:8545/;
    }
  }
