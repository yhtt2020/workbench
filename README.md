# 项目说明
![Picture](https://www.apps.vip/wp-content/uploads/2023/09/1695004332-%E6%A1%8C%E9%9D%A2-1385x800.png)

本项目官方主页：www.apps.vip

B站账号：
[玩屏开发者皮克斯](https://space.bilibili.com/167397379)

服务端暂不开源。我们会为希望独立使用的用户提供离线模式，敬请关注后续的项目更新。


项目是想天工作台的客户端前端部分，是全部前端源码，基于AGPL3.0协议开源。请勿直接用作商业用途。



# 开发调试指南

1.建议使用nvm安装nodejs-16版本

2.安装visualStudio community 版本 ，需要安装c++桌面程序sdk，并勾选win10 sdk

3.安装python3.10，并设置环境变量

4.yarn根目录

5.yarn vite目录

6.vite下yarn run build编译一遍

7.复制一个/node_modules下的dragula/dist/dragula.css 到 dragula/dist/dragula.min.css，不然会报这个库缺文件

###启动项目

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

验证方式，使用cmd ping table.com

注意：代理要排除这个域名，否则可能导致无法打开

1./vite yarn run start  在/vite目录下执行yarn run start命令，启动渲染进程

2./ yarn run start 在/根目录下执行yarn run start 启动electron客户端


## 打包桌面客户端

在根目录运行yarn run packageWin
