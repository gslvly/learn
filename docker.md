####run: 运行容器
  * `docker run -d ubuntu:版本 /bin/bash -c 'echo test' `
  版本可不要，默认最新版,如果镜像不存在，就去下载
  `-d ` 后台运行
  `docker run -it ubuntu /bin/bash` 
  -it i:stdin t:在新容器内指定一个伪终端或终端。
  `-p ip:5001:4000`                                     端口映射：通过ip:5001 访问容器4000端口
  `-P`                                                  端口映射：随机
  --name xxx                                          容器命名
  -v $PWD/www:/www                                    目录映射：将本地当前目录映射到容器/www目录

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
docker port adoring_stonebraker 5000                  查看容器adoring_stonebraker 5000端口绑定的外部端口
exec -it contenerid  /bin/bash                        进入容器
tag imageid name:tag                                  重命名
rename 原容器名  新容器名                               容器重命名

docker start                                          启动一个或多个已经被停止的容器
docker stop                                           停止一个运行中的容器
docker restart                                        重启容器 更新挂载的配置文件
docker kill  mynginx                                  杀掉一个运行中的容器
docker pause db01                                     暂停容器中所有的进程。
docker unpause  db01                                  恢复
docker create                                         只创建 不运行容器 与run命令相同
docker logs -f mynginx                                列出log

docker 构建
  docker build -t 镜像名 -f dockerfile .                构建镜像
  docker save -o 出口路径 镜像名                         保存镜像
  docker load -i 镜像文件                               加载镜像
  docker export contener > 路径                         导出容器
  docker import xxx  name:tag                           导入容器
  或者cat xxx |docker import - name:tag