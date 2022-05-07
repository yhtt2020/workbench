# TSWork 想天工作台

##常用yarn命令集合：

开发环境下运行 
`yarn run start`

打包-electron-package mac上首选打包方式
packMacIntel 打包macIntel芯片版本
`yarn run package` 会根据当前平台打包一个文件，采用asar简单封装应用目录
使用的打包配置是
`./electron-builder-config.yml`

当我们一次性要打包两个mac的包的时候，单纯使用脚本比较麻烦，为此，我们单独做了一个打包产品的脚本。↓

`yarn run packagePrd`
特别需要注意的是：
这个脚本会引用electron-builder-config-prd.yml而不是electron-builder-config.yml
所以使用packagePrd脚本会将证书也打包进去。
而普通的package命名则不会打包进证书，这是最大的不同。

为了方便mac上做到无人值守打包，所以又封装了一个先后打包普通mac和arm架构的整合命令。
会自动先打包intel架构然后再打包arm架构（因为反过来的话，会导致开发环境下的包不兼容，以至于开发环境都跑不起来了）
一次性打包全部的mac平台↓

`yarn run packagePrdMacAll`

打包-electron-packager min自带的打包方式
- `npm run buildWindows`  win上面实际上无法完成最终的封包工作，会报错，没找到原因，并且win上，我们还会用advance installer来打包安装包，无所谓了
- `npm run buildMacIntel`
- `npm run buildMacArm`
- `npm run buildDebian`
- `npm run buildRaspi` (for Raspberry Pi, Raspberry Pi OS)
- `npm run buildLinuxArm64`
- `npm run buildRedhat`

## 打包流程说明：
一般都是先合并了一下/main目录下的js到/main.build.js
然后再合并了js文件里的有关js到/dist下
同时还合并了localization到/dist下
合并了css目录下到/dist/bundle.css
整个流程这边不详细说明了，看代码也能看得懂。
这些代码都放在/scripts文件夹内，可以仔细看它的执行逻辑，这边就不写清楚了。
buildBrowser.js  主要是合并js文件夹里的
buildBrowserStyle.js 单独合并了一下主界面的样式
build[platform] 打包各种平台
buildMain.js 打包main目录下的
buildPreload.js 打包preload
createPackage.js 用于打包操作，如果用electron-builder好像会跳过这个

