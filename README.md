# 项目说明
![Picture](https://www.apps.vip/wp-content/uploads/2023/09/1695004332-%E6%A1%8C%E9%9D%A2-1385x800.png)
![Picture](https://www.apps.vip/wp-content/uploads/2023/06/1687245185-%E7%BC%96%E7%BB%84-16-1400x436.png)
目前支持在电脑上使用，外接扩展屏的时候，可以实现触摸操作。也可以在主屏中窗口化使用。

也可以结合spacedesk将手机、平板模拟为扩展屏。模拟后可实现相同的功能。相对于直接便携显示器来说，模拟的更加卡一些。

B站开源相关介绍视频：
[【皮克斯的工作台】写了整整2年，投入超100万的超级缝合怪生产力软件要开源了，前端大礼包](https://www.bilibili.com/video/BV14841117Gp/?spm_id_from=333.999.0.0)

系列视频：[副屏操作系统](https://www.bilibili.com/video/BV1u14y1c7Qu/?spm_id_from=333.999.0.0)

本项目官方主页：[想天浏览器官方主页](https://www.apps.vip)

文档项目：[XtUI项目主页](https://gitee.com/tsbrowser/xtui) （持续更新中）

## 开源项目引用说明

本项目基于一些开源组件开发而成。最底层是基于Electron的Min浏览器，这是一个多标签浏览器，我们在此基础上增加了大量的优化和开发。

包括开发了多功能左侧栏、标签组空间、密码管理器、收藏夹等等大量功能。

其中浏览器插件部分，引用了一个基于AGPL的插件。大家可以自行查阅依赖，已经放置到/packages目录下了。

B站账号：
[玩屏开发者皮克斯](https://space.bilibili.com/167397379)

服务端暂不开源。我们会为希望独立使用的用户提供离线模式，敬请关注后续的项目更新。


项目是天天工作台的客户端前端部分，是全部前端源码，基于AGPL3.0协议开源。请勿直接用作商业用途。



# 开发调试指南

1.建议使用nvm安装nodejs-16版本

2.安装visualStudio community 版本 ，需要安装c++桌面程序sdk，并勾选win10 sdk

3.安装python3.10，并设置环境变量

4.yarn根目录

5.yarn vite目录

6.vite下yarn run build编译一遍

7.复制一个/node_modules下的dragula/dist/dragula.css 到 dragula/dist/dragula.min.css，不然会报这个库缺文件

## 启动项目

0.hosts下添加映射

C:\Windows\System32\drivers\etc\hosts 注意这个文件不能带.txt扩展名，否则不生效
注意，是每行一个。MD解析可能混在一行上了
```
127.0.0.1 table.com

127.0.0.1 1.table.com

127.0.0.1 2.table.com

127.0.0.1 3.table.com

127.0.0.1 4.table.com

127.0.0.1 5.table.com

127.0.0.1 6.table.com
```

验证方式，使用cmd ping table.com

注意：代理要排除这个域名，否则可能导致无法打开

1./vite yarn run start  在/vite目录下执行yarn run start命令，启动渲染进程

2./ yarn run start 在/根目录下执行yarn run start 启动electron客户端


## 打包桌面客户端

在根目录运行yarn run packageWin
