####location 
以 = 开头，表示精确匹配；如只匹配根目录结尾的请求，后面不能带任何字符串。
以^~ 开头，表示uri以某个常规字符串开头，如果匹配到，则不继续往下匹配。不是正则匹配
以~ 开头，表示区分大小写的正则匹配;
以~* 开头，表示不区分大小写的正则匹配
以/ 开头，通用匹配, 如果没有其它匹配,任何请求都会匹配到
**注意 location xxx {} 其中xxx与括号之间很多时候需要空格，最好都加上*

#####匹配顺序：
(location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~* 正则顺序) > (location 部分起始路径) > (/)

####rewrite
rewrite只能放在 server{}, location{}, if{}中，并且只能对域名后的文件路径起作用。
##### 执行顺序
1. 执行server块的rewrite指令
2. 执行location匹配
3. 执行选定的location中的rewrite指令

##### 语法
rewrite regex replacement [flag];
##### flag
这儿分为server级和location级，其中if可写在server和location中，分别对应server级和location级。同级别中执行顺序看书写顺序。
last :  不再执行同级rewrite,写在location中重新循环server.
break : 不再执行同级rewrite，只往后匹配，如果在location中，会报404，因为location中没有嵌套location使其往继续往下级匹配;
redirect : 返回302临时重定向，地址栏会显示跳转后的地址
permanent : 返回301永久重定向，地址栏会显示跳转后的地址
当不写flag时，再次循环同级匹配

#### if(condition)
当表达式只是一个变量时，如果值为空或任何以0开头的字符串都会当做false
直接比较变量和内容时，使用=或!=
~  正则表达式匹配
~* 不区分大小写的匹配
!~  区分大小写的不匹配
-f和!-f  用来判断是否存在文件
-d和!-d  用来判断是否存在目录
-e和!-e  用来判断是否存在文件或目录
-x和!-x  用来判断文件是否可执行

#### 其他
##### 调试
```
   default_type    application/json;
   在locaiton中 return 200 '$uri xxx' 
```
##### 变量
```
set $a "1"
if ($a = "1") {
  return 302
}
``` 
##### proxy_pass

`proxy_pass http://127.0.0.1:8008/;` 
这里只讨论在location中的proxy_pass;

1、 location 使用非正则匹配
```
location /api {
 # 1. proxy_pass http://127.0.0.1:8008/a;
 # 2. proxy_pass http://127.0.0.1:8008;
}
```
* 1中 端口后面有"/" ,访问/api/test → /a/test；（匹配剩余的地址为/test,再将地址拼接到代理地址中）
* 2中 端口后面没有"/" ,访问/api/test → /api/test
此处要注意，并不是uri最后是否有"/"，是端口后面是否有"/"

2、location 使用正则匹配
```
location ~ /api/ {
  proxy_pass http://127.0.0.1:8008;
}
```
* 端口后面不加/，可行。
* 端口后面加/，则必须使用变量(任何变量都行，让其使用第3条规则)。因为代理地址会自动加上匹配剩余的uri,代理去正则匹配剩余的uri会使地址乱套。

3、如果proxy_pass后面有变量，直接去的那个地址，跳出1 2条规则。

#### 举例
```
server {
  listen       80;
  rewrite /a(.*) /b$1;
  rewrite /b(.*) /c$1 last;
  rewrite /c(.*) /d$1 break;
  location / {
    if ($uri ~ /d/) {
      rewrite /d/(.*) /api/$1 last;
    }
    return 200 '$uri';
  }
  location /api {
    proxy_pass http://127.0.0.1:8000/test; #端口号后面有/，代理删掉/api。
  }
  location ~ /t/(.*)/t {
    proxy_pass http://127.0.0.1:8000/test1/$1; 
    #proxy_pass http://127.0.0.1:8000/test1; 写法报错，必须使用变量，使用第3条代理规则。
  }
}
```
1. 访问/test 返回 /test
2. 访问/aaa  返回 /caa
3. 访问/api  返回 /cpi
4. 访问/d/dd 代理去 `http://127.0.0.1:8000/test/dd`
5. 访问/ee/t/test2/t/every 代理去 `http://127.0.0.1:8000/test1/test2`


