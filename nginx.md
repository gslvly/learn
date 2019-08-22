####location 
以 = 开头，表示精确匹配；如只匹配根目录结尾的请求，后面不能带任何字符串。
以^~ 开头，表示uri以某个常规字符串开头，如果匹配到，则不继续往下匹配。不是正则匹配
以~ 开头，表示区分大小写的正则匹配;
以~* 开头，表示不区分大小写的正则匹配
以/ 开头，通用匹配, 如果没有其它匹配,任何请求都会匹配到
#####匹配顺序：
(location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~* 正则顺序) > (location 部分起始路径) > (/)

####rewrite
rewrite只能放在 server{}, location{}, if{}中，并且只能对域名后的文件路径起作用。
#####执行顺序
1. 执行server块的rewrite指令
2. 执行location匹配
3. 执行选定的location中的rewrite指令

#####语法
rewrite regex replacement [flag];
#####flag
last : 立即结束执行，再次循环server
break : 不再执行同级别rewrite 不循环server 写在location中时会没有返回;
redirect : 返回302临时重定向，地址栏会显示跳转后的地址
permanent : 返回301永久重定向，地址栏会显示跳转后的地址，需注意端口
当不写flag时，会继续往后执行匹配，不重新匹配server内容


####if(condition)
当表达式只是一个变量时，如果值为空或任何以0开头的字符串都会当做false
直接比较变量和内容时，使用=或!=
~  正则表达式匹配
~* 不区分大小写的匹配
!~  区分大小写的不匹配
-f和!-f  用来判断是否存在文件
-d和!-d  用来判断是否存在目录
-e和!-e  用来判断是否存在文件或目录
-x和!-x  用来判断文件是否可执行

####其他
#####调试
```
   default_type    application/json;
   在locaiton中 return 200 '$uri xxx' 
```
#####变量
```
set $a "1"
if ($a = "1") {
  return 302
}
``` 
#####proxy_pass
`proxy_pass http://127.0.0.1:8008/;` 
在location中，url后有斜杠则不加匹配剩余的uri,没有则加上，
如果proxy_pass后面是变量，直接去变量的地址，不会因为没有斜杠而添加剩余余uri。如果需要，location必须使用正则匹配，使用$1匹配剩余uri。
####常用配置
    server {
      listen       81;
      server_name  localhost;
      root   D:/nginx/nginx-1.13.12/html/control;

    	gzip on;
   	  gzip_http_version 1.1;
    	gzip_comp_level 3;
    	gzip_types text/plain application/json application/javascript text/css  image/jpeg image/gif image/png application/zip;

        try_files $uri  /index.html;
    }
    server {
        listen       80;
        server_name  localhost;
        root   D:/nginx/nginx-1.13.12/html/frontend;
        try_files $uri  /index.html;
        location /api {
          proxy_pass http:127.0.0.1:8000/test;
        }
    }

