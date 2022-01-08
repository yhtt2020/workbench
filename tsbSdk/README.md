#### 打包UMD SDK文件
`npm run build`

###### 1、进入到electron-app/js/tsbSdk中执行上面的命令
###### 2、打包出来的文件在dist文件夹中，支持electron主应用环境或者browser从web应用环境的引入
###### 3、SDK文件在browser项目中采用一步引入的方式，避免资源对项目资源的竞争
###### 4、在Electron环境中使用SDK接口能力时，确保electron.ipcRenderer这个EventEmitter的实例赋予ipc这个对象
###### 5、同一个接口能力在electron环境和web环境中调用同一名称的方法
###### 5、完善后建包发布npm


#### 使用说明📖

###### 一、💥登出IM跳转短说社区【设置/账号/账号信息】能力接口
> electorn中调用:
>- 第一步：SDK根据环境创建对应的实例`const xxx = Module.default.content()`
>- 【备注：这里的default方法前缀是因为electorn项目中的module引入是采用commonJS，SDK设计成主应用和web应用都可以引入的方式】
>- 第二步：执行方法，实例完成监听`xxx实例.OsxpcBinding('event处理事件名称')`；例如`tsb.OsxpcBinding('navigateToAccount')`
>- 第三步：监听到消息会自动完成能力后续

>web应用中调用：
>- 第一步：SDK根据环境创建对应的实例`const xxx = Module.content()`
>- 第二步：在需要的事件上执行此方法`xxx实例.OsxpcBinding()`
>- 第三步：消息会发到主electron应用中执行后续，web应用只需要保证勿重复执行事件。


###### 二、💥登出IM跳转短说社区【设置/账号/用户信息】
> 同上
>- 方法名：OsxpcUserInfo