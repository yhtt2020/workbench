## main文件夹说明
本文件夹主要用于存放各类需要被主进程调用的js。考虑到主进程的特殊性，将此类js放到此处统一引入。
（main文件夹是不会直接引入的，都是编译进去的，所以放在/main目录下是不会被打包进去，故统一存放至此）