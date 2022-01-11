#### 1、打包UMD SDK第三方应用版本
`npm run build`

###### 1、进入到electron-app/tsbSdk中执行上面的命令
###### 2、SDK文件在browser项目中采用一异步引入的方式，避免资源对项目资源的竞争
###### 3、目前预留了(支持sdk鉴权的设计)，后续需配合后端完善
###### 4、设计大致参考[微信JSSDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1)
###### 5、第三方应用需要使用tsb-SDK的页面必须先注入config配置信息，否则将无法调用
###### 5、完善后建包发布npm


#### 2、鉴权部分设计
>- 微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用，我们设计成同一个origin仅需调用一次
>- 后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
>- jsapi_ticket获取后，去生成tsb-SDK权限验证的签名
>- 签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
>- 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
>- 对string进行sha1签名，得到signature


#### 3、使用说明📖

##### 步骤一、💥引入tsbSdk
`import tsbk from 路径地址`

##### 步骤二、💥通过config接口注入权限验证配置
第三方应用需要使用tsb-SDK的页面必须先注入config配置信息，否则将无法调用。对于变化url的SPA的web app可在每次url变化时注入config配置信息。
```
tsbk.config({
  appId: '', // 必填，第三方应用的唯一标识
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [] // 必填，需要使用的JS接口列表
})
```
👀目前只需要如下即可(检验功能未实现)
```
tsbk.config({
  signature: "ts"
})
```

##### 步骤三、💥通过ready,error接口处理验证
```
#ready接口处理成功验证
wx.ready(function(){
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，任何sdk接口的调用，须把相关接口放在ready函数中调用来确保正确执行。
})
```

```
#error接口处理失败验证
wx.error(function(res){
  // config信息验证失败会执行error函数，错误可以在返回的res参数中查看，对于SPA可以在这里更新签名。
})

```

#### 4、接口调用说明📖 
##### 🤔通用参数，可选
所有接口通过tsbk对象来调用，参数是一个对象，除了每个接口本身需要传的参数之外，还有以下通用参数：
>- success：接口调用成功时执行的回调函数。
>- fail：接口调用失败时执行的回调函数。

##### 一、💥隐藏第三方应用(后台常驻) hideApp
示例
```
tsbk.ready(function() {
  tsbk.hideApp()
})
```
##### 二、💥跳转短说社区【设置/账号/账号信息】toBind接口
示例
```
tsbk.ready(function() {
  tsbk.toUser()
})

```
##### 三、💥跳转短说社区【设置/账号/用户信息】toUser接口

