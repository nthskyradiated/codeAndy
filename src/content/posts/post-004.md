---
isDraft: false
title: "Deploying Mongodb Statefulsets in Kubernetes"
excerpt: "The simplest way I deploy a sandbox NoSQL statefulset for our developers."
slug: deploying-mongodb-stateful-sets-in-kubernetes
publishDate: 2023-12-29
author: AndyP
tags: [ Kubernetes, Mongodb, NoSQL, Deployment]
sortOrder: 4
---
# Deploying Mongodb pods
I use several different approaches to deploy mongodb pods in development. Most of them utilizes shared nfs storage folders for volume mounts and one of which is for the storage of key-file for pod authentication.

## 1. Create a mongodb user account
```bash
sudo useradd mongodb

# take note of user's uid to used for mounting permissions in the yaml config
cat /etc/passwd | grep mongodb
```
```bash
# in this case: 1001
mongodb:x:1001:1001::/home/mongodb:/bin/sh
```

## 2. Create Directories to Share via NFS
Create directories needed that will be shared with the worker nodes.

```bash
sudo mkdir -p /srv/nfs/kubedata /srv/nfs/mongo-keyfile
sudo chown mongodb:mongodb /srv/nfs/kubedata /srv/nfs/mongo-keyfile
```

## 3. Configuring the NFS share
Make sure NFS service is installed.
  
```bash
sudo apt update
sudo apt install nfs-kernel-server
```
Configure the NFS exports.
```bash
sudo nano /etc/exports

# Add the entries below:
/srv/nfs/mongo-keyfile *(rw,fsid=1,sync,no_subtree_check,anonuid=1001,anongid=1001)

/srv/nfs/kubedata node01(rw,sync,no_subtree_check,all_squash,anonuid=1001,anongid=1001) node02(rw,sync,no_subtree_check,all_squash,anonuid=1001,anongid=1001)
```

Export the shares and run and enable the NFS service.
```bash
sudo exportfs -ra
sudo systemctl start nfs-kernel-server
sudo systemctl enable nfs-kernel-server
```
## 4. Configure the shares on the worker nodes
Make sure the NFS client service is installed.
```bash
sudo apt update
sudo apt install nfs-common
```
Create a mount point and mount the shared folder.
```bash
sudo mkdir -p /mnt/nfs/kubedata
sudo mount <your-nfs-server-ip>:/srv/nfs/kubedata /mnt/nfs/kubedata

#verify the mount:
df -h
```
Make the mount persistent by adding entry to fstab.
```bash
sudo nano /etc/fstab

# add the entry below
control-plane-ip:/srv/nfs/kubedata /mnt/nfs/kubedata nfs defaults 0 0
```
## 5. Generate the keyfile needed for pod authentication
```bash
# I'm naming mine mkey

openssl rand -base64 756 > mkey
chmod 400 mkey
sudo chown mongodb:mongodb mkey

# make sure to move it to /srv/nfs/mongo-keyfile
```
## 6. The rest of the configurations is detailed in the deployment yaml files
refer to the deployment yaml files for more details.

## 7. Initiate the replicaset
if running a replicaset, you need to initiate the replication process right after the first pod is created since mongodb requires initialization (```rs.initiate()```) as it is an administrative task that sets up the internal replication structure. It requires MongoDB to first ensure all nodes are ready and then one of the nodes (typically the first replica) is designated as primary.

While Kubernetes can spin up multiple replicas, MongoDB itself needs to be instructed to form a replica set. The methods above help automate that process within a containerized setup..

```bash
kubectl exec -ti <pod name> -- mongosh -u <username> -p <password>

# run this inside the container instance
rs.initiate()
```

I don't like the manual approach so I deploy my replicaset with a sidecar.