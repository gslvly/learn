run: 运行容器
  docker run -d ubuntu:版本 /bin/bash -c 'echo test'  版本可不要，默认最新版,如果镜像不存在，就去下载
  -d                                                  后台运行
  docker run -it ubuntu /bin/bash
  -it                                                 i:stdin t:在新容器内指定一个伪终端或终端。

logs id                                               查看容器的logs

images                                                镜像列表
rmi imageid                                           删除镜像
rmi $(docker images -q)                               删除镜像
ps                                                    容器列表(-a 全部列表,含有已经退出的)
stop id                                               退出容器 
stop $(docker ps -a -q)                               全部停止
rm id                                                 删除 id的容器 （必须容器已经退出了）
rm $(docker ps -a -q)                                 全删
pull 镜像名                                            获取新镜像
search 镜像名                                          在官网搜索此镜像
