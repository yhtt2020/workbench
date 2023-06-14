# 开发调试指南

1.建议使用nvm安装nodejs-14版本
2.安装visualStudio community 版本 ，需要安装c++桌面程序sdk，并勾选win10 sdk
3.安装python3.10，并设置环境变量
4.yarn根目录
5.yarn vite目录
6.vite下yarn run build编译一遍
7.复制一个/node_modules下的dragula/dist/dragula.css 到 dragula/dist/dragula.min.css，不然会报这个库缺文件

启动项目
0.hosts下添加映射
C:\Windows\System32\drivers\etc\hosts 注意这个文件不能带.txt扩展名，否则不生效
``
127.0.0.1 table.com
127.0.0.1 1.table.com
127.0.0.1 2.table.com
127.0.0.1 3.table.com
127.0.0.1 4.table.com
127.0.0.1 5.table.com
127.0.0.1 6.table.com
``
测试方式，使用cmd ping table.com
注意：代理要排除这个域名，否则可能导致无法打开
1./vite yarn run start
2./ yarn run start