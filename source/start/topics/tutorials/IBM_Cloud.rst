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

.. _here: http://cloud.ibm.com/registration
.. _docs: https://cloud.ibm.com/docs/containers?topic=containers-infrastructure_providers
.. _Locations: https://cloud.ibm.com/docs/containers?topic=containers-regions-and-zones#zones
.. _VRF: https://cloud.ibm.com/docs/dl?topic=dl-overview-of-virtual-routing-and-forwarding-vrf-on-ibm-cloud
.. _Vlan-spanning: https://cloud.ibm.com/docs/vlans?topic=vlans-vlan-spanning#vlan-spanning
.. _endpoints: https://cloud.ibm.com/docs/account?topic=account-service-endpoints-overview
.. _tags: https://cloud.ibm.com/docs/account?topic=account-tag
