---
image: cover.jpg
---

命令列表

```bash
# 描述rc的行为，排查错误
kubectl describe rc nginx  

# 描述pod的行为，排查错误
kubectl describe pod PodName

# 获取接口ip
kubectl get ep 

# 得到指定命名空间下的pods
kubectl get pods --namespace=kube-system

# 强制删除某一个命名空间内的pods
kubectl delete pods coredns-699f8ddd77-6t5g5 --namespace=kube-system  --grace-period=0 —force

# 查看某一个pods的日志
kubectl logs --tail=50 -f coredns-699f8ddd77-kgfbs --namespace=kube-system

# 查看某一命名空间下的secrets对象
kubectl get secrets -n kube-system

# 得到scecret对象描述
kubectl describe secrets/kubernetes-dashboard-certs -n kube-system

# 得到副本集
kubectl get ReplicaSet -n kube-system

# 查看deployment状态
kubectl rollout status deployment/metrics-server-v0.3.1 -n kube-system

# 查看pod的yaml文件
kubectl get pods metrics-server-v0.3.1-8f79f7b54-z6j2z -n kube-system -o yaml

# 创建secrets对象
kubectl create secret generic kubernetes-ca-certs --from-file=ssl -n kube-system

# 创建configmap
kubectl create configmap apollo --from-file=apollo

# 强制删除pods
kubectl delete pods acce --grace-period=0 --force

# 删除所有异常状态的pod
kubectl get pods | grep Evicted | awk '{print $1}' | xargs kubectl delete pod
kubectl get pods -n istio-system | grep Evicted | awk '{print $1}' | xargs kubectl delete pod  -n istio-system

# 未测试过的命令
kubectl get pods --field-selector 'status.phase=Failed' -o name | xargs kubectl delete

# 删除指定命名空间下所有异常状态的pod
kubectl get pods -n kube-system | grep Evicted | awk '{print $1}' | xargs kubectl delete pod -n kube-system

# 现在我们需要找到新创建的用户的Token
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print'

# metrics-server用到的语句
kubectl create rolebinding -n kube-system kubernetes-metrics-minimal --role=extension-apiserver-authentication-reader --serviceaccount=kube-system:metrics-server

kubectl describe serviceaccount/default -n kube-system

kubectl get secret default-token-hpni0 -o yaml -n kube-system

kubectl cluster-info

kubectl config view

kubectl delete pod kube-flannel-ds-t9wts --now -n kube-system

kubectl api-versions

kubectl describe ds kube-flannel-ds -n kube-system

kubectl port-forward --address 0.0.0.0 -n istio-system $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') 16686:16686


kubectl exec -ti pod-use-pvc  -n glusterfs -- /bin/bash

kubectl edit configmap filebeat-inputs -n elastic-system

kubectl get all --all-namespaces -o name|grep ceph

# 删除命名空间
kubectl delete namespace jenkins
```