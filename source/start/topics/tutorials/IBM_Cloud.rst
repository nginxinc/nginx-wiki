.. meta::
    :description: How to install NGINX on IBM Cloud

==========================
Install NGINX on IBM Cloud
==========================


You should have an IBM Cloud account, otherwise you can register here_. At the end of the tutorial you will have a cluster with an Nginx up and runnning.

1. We will provision a new Kubernetes Cluster for you if, you already have one skip to step 3

2. We will deploy the IBM Cloud Block Storage plug-in, if already have it skip to step 2

3. Nginx deployment

Step 1 provision Kubernetes Cluster
-----------------------------------

- Click the **Catalog** button on the top 
- Select **Service** from the catalog
- Search for **Kubernetes Service** and click on it

.. image:: /source/images/kubernetes-select.png

- You are now at the Kubernetes deployment page, you need to specify some details about the cluster 
- Choose a plan **standard** or **free**, the free plan only has one worker node and no subnet, to provision a standard cluster, you will need to upgrade you account to Pay-As-You-Go 
  - To upgrade to a Pay-As-You-Go account, complete the following steps:

  1. In the console, go to Manage > Account.
  2. Select Account settings, and click Add credit card.
  3. Enter your payment information, click Next, and submit your information
- Choose **classic** or **VPC**, read the docs_ and choose the most suitable type for yourself 

 .. image:: /source/images/infra-select.png
 
- Now choose your location settings, for more information please visit Locations_
- Choose **Geography** (continent)

.. image:: /source/images/location-geo.png

- Choose **Single** or **Multizone**, in single zone your data is only kept in on datacenter, on the other hand with Multizone it is distributed to multiple zones, thus  safer in an unforseen zone failure 

.. image:: /source/images/location-avail.png

- Choose a **Worker Zone** if using Single zones or **Metro** if Multizone

 .. image:: /source/images/location-worker.png
 
- If you wish to use Multizone please set up your account with VRF_ or enable Vlan-spanning_
- If at your current location selection, there is no available Virtual LAN, a new Vlan will be created for you 
 
- Choose a **Worker node setup** or use the preselected one, set **Worker node amount per zone**

.. image:: /source/images/worker-pool.png

- Choose **Master Service Endpoint**,  In VRF-enabled accounts, you can choose private-only to make your master accessible on the private network or via VPN tunnel. Choose public-only to make your master publicly accessible. When you have a VRF-enabled account, your cluster is set up by default to use both private and public endpoints. For more information visit endpoints_.

.. image:: /source/images/endpoints.png

- Give cluster a **name**

.. image:: /source/images/name-new.png

- Give desired **tags** to your cluster, for more information visit tags_

.. image:: /source/images/tasg-new.png

- Click **create**

.. image:: /source/images/create-new.png

- Wait for you cluster to be provisioned

.. image:: /source/images/cluster-prepare.png

- Your cluster is ready for usage 

.. image:: /source/images/cluster-done.png

Step 2 deploy IBM Cloud Block Storage plug-in
---------------------------------------------
The Block Storage plug-in is a persistent, high-performance iSCSI storage that you can add to your apps by using Kubernetes Persistent Volumes (PVs).
 
- Click the **Catalog** button on the top 
- Select **Software** from the catalog
- Search for **IBM Cloud Block Storage plug-in** and click on it

.. image:: /source/images/block-search.png

- On the application page Click in the _dot_ next to the cluster, you wish to use
- Click on  **Enter or Select Namespace** and choose the default Namespace or use a custom one (if you get error please wait 30 minutes for the cluster to finalize)

.. image:: /source/images/block-cluster.png

- Give a **name** to this workspace 
- Click **install** and wait for the deployment

.. image:: /source/images/block-storage-create.png
 

Step 3 deploy Nginx
-------------------

We will deploy  Nginx on our cluster 
  
- Click the **Catalog** button on the top 
- Select **Software** from the catalog
- Search for **Nginx Opensource** and click on it

.. image:: /source/images/nginx-search.png

- Please select IBM Kubernetes Service

.. image:: /source/images/select-target.png

- On the application page Click in the _dot_ next to the cluster, you wish to use

.. image:: /source/images/select-cluster.png

- Click on  **Enter or Select Namespace** and choose the default Namespace or use a custom one 

.. image:: /source/images/details-namespace.png

- Give a unique **name** to workspace, which you can easily recognize

.. image:: /source/images/details-name.png

- Select which resource group you want to use, it's for access controll and billing purposes. For more information please visit resource groups_.

.. image:: /source/images/details-resource.png

- Give **tags** to your nginx workspace, for more information visit tags_.

.. image:: /source/images/details-tags.png

- Click on **Parameters with default values**, You can set deployment values or use the default ones

![def-val](/parameters.png

- After finishing everything, **tick** the box next to the agreements and click **install**

.. image:: /source/images/install.png

- The nginx workspace will start installing, wait a couple of minutes 

.. image:: /source/images/in-progress.png

- You nginx workspace has been successfully deployed

.. image:: /source/images/done.png

Verify Nginx installation
-------------------------

- Go to Resources_ in your browser 
- Click on **Clusters**
- Click on your Cluster

.. image:: /source/images/resource-select.png

- Now you are at you clusters overview, here Click on **Actions** and **Web terminal** from the dropdown menu


.. image:: /source/images/cluster-main.png

- Click **install** - wait couple of minutes 

.. image:: /source/images/terminal-install.jpg

- Click on **Actions**
- Click **Web terminal** --> a terminal will open up

- **Type** in the terminal, please change NAMESPACE to the namespace you choose at the deployment setup:

.. code-block:: bash

$ kubectl get ns

.. image:: /source/images/get-ns.png


.. code-block:: bash

$ kubectl get pod -n NAMESPACE -o wide 

.. image:: /source/images/get-pod.png

.. code-block:: bash

$ kubectl get service -n NAMESPACE

.. image:: /source/images/get-service.png


- Running Ngninx service will be visible 
- Copy the **External ip**, you can access the website on this IP
- Paste it into your browser
- Nginx welcome message will be visible

.. image:: /source/images/nginx-welcome.png

You successfully deployed an Nginx webserver on IBM Cloud! 


.. _here: http://cloud.ibm.com/registration
.. _docs: https://cloud.ibm.com/docs/containers?topic=containers-infrastructure_providers
.. _Locations: https://cloud.ibm.com/docs/containers?topic=containers-regions-and-zones#zones
.. _VRF: https://cloud.ibm.com/docs/dl?topic=dl-overview-of-virtual-routing-and-forwarding-vrf-on-ibm-cloud
.. _Vlan-spanning: https://cloud.ibm.com/docs/vlans?topic=vlans-vlan-spanning#vlan-spanning
.. _endpoints: https://cloud.ibm.com/docs/account?topic=account-service-endpoints-overview
.. _tags: https://cloud.ibm.com/docs/account?topic=account-tag
.. _Resources: http://cloud.ibm.com/resources
.. _groups: https://cloud.ibm.com/docs/account?topic=account-account_setup#bp_resourcegroups
