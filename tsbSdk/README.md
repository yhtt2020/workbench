#### 1、打包 UMD SDK 第三方应用版本

`npm run build`

###### 1、进入到 electron-app/tsbSdk 中执行上面的命令

###### 2、SDK 文件支持 ES Module、CommonJS、AMD 的调用

###### 3、目前预留了(支持 sdk 鉴权的设计)，后续需配合后端完善，已经支持续签鉴权 jsapi_ticket

###### 4、设计大致参考[微信 JSSDK](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#1)

###### 5、在类似 Vue 的 SPA 单页面项目中使用需注意：要使用 tsb-SDK 的页面必须先注入 config 配置信息，否则将无法调用。如需全局应用，例如 Vue 项目中在 mixin 或 main 文件中的 created 方法中预先注入 config 鉴权配置信息，在其他页面文件中就无需重复注入。

###### 6、在 html 文件中直接使用需注意：script 标签中引入 sdk，在 window.onload 方法上挂上 tsbk.default.config 配置信息。具体方法的调用在 tsbk.default.ready()调用时传入具体的回调执行方法

###### 7、所有的 sdk 方法都已包装成一个 Promise，支持链式回调执行。

###### 8、完善后建包发布 npm

#### 2、鉴权部分设计

> - 微信 jssdk 是同一个 url 仅需调用一次，对于变化 url 的 SPA 的 web app 可在每次 url 变化时进行调用，我们设计成同一个 origin 仅需调用一次
> - 后期给第三方应用一个接口调取 jsapi_ticket（有效期 7200 秒，开发者必须在自己的服务全局缓存 jsapi_ticket）
> - jsapi_ticket 获取后，去生成 tsb-SDK 权限验证的签名
> - 签名生成规则如下：参与签名的字段包括 noncestr（随机字符串）, 有效的 jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的 Origin）
> - 对所有待签名参数按照字段名的 ASCII 码从小到大排序（字典序）后，使用 URL 键值对的格式（即 key1=value1&key2=value2…）拼接成字符串 string
> - 对 string 进行 sha1 签名，得到 signature

#### 3、使用说明 📖

##### 步骤一、💥 引入 tsbSdk

`import tsbk from 路径地址` ES module 引入
`<script src="路径文件"></script>` script 标签引入 ❗️ 对象在全局 tsbk.default 中
###### demo in html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <script src="./tsbSdk.js"></script>
  </head>
  <body>
    <button id="test22">测试sdk按键</button>
    <script>
      window.onload = () => {
        tsbk.default.config({
          signature: "ts",
        });
      };
    </script>
  </body>
  <script>
    var button22 = document.getElementById("test22");

    button22.onclick = () => {
      tsbk.default.ready(() => {
        tsbk.default
          .getUserProfile()
          .then((res) => {
            console.log(res, "res!!!");
          })
          .catch((err) => {
            console.log(err, "err!!!");
          });
      });
    };
  </script>
</html>
```

###### demo in Vue main.js
```javascript
import tsbk from './core/tsbSdk'

Vue.prototype.$tsbk = tsbk

const Instance = new Vue({
  router,
  store,
  mixins: [MainMixin],
  created() {
    Vue.prototype.$tsbk.config({
      signature: "ts"
    })
  },
  render: h => h(App)
}).$mount('#app')
```
```javascript
//in components just use it
export default {
  props: {},
  data() {
    return {}
  },
  methods: {
    inviteLink() {
      this.$tsbk.ready(() => {
        this.$tsbk.openOsxInviteMember({
          groupId: this.$store.getters.getFid
        })
      })
    }
  },
}

```

##### 步骤二、💥 通过 config 接口注入权限验证配置

第三方应用需要使用 tsb-SDK 的页面必须先注入 config 配置信息，否则将无法调用。对于变化 url 的 SPA 的 web app 可在每次 url 变化时注入 config 配置信息。

```
tsbk.config({
  appId: '', // 必填，第三方应用的唯一标识
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [] // 必填，需要使用的JS接口列表
})
```

👀 💗目前只需要如下即可(实际检验功能未完成)

```
tsbk.config({
  signature: "ts"
})
```

##### 步骤三、💥 通过 ready函数

```
#ready准备函数
wx.ready(function(){
  // 必须把相关接口函数放在ready准备函数中执行。
})
```

#### 4、接口调用说明 📖

##### 🤔 所有sdk方法返回Promise，部分方法会回调返回实际的值，你可以处理这些正确的回调返回。
##### 一、🧊🔧隐藏第三方应用(后台常驻) hideApp 方法
###### 无参数
###### 正确回调返回: `{code: 200, msg: '成功'}`

示例

```
tsbk.ready(function() {
  tsbk.hideApp().then((res) => {
    //res {code: 200, msg: '成功'}
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})
```

##### 二、🧊🔧新建一个指定 url 的标签页 tabLinkJump 方法
###### 参数: 1、必填【url: String】
###### 正确回调返回: `{code: 200, msg: '成功'}`

示例

```
tsbk.ready(function() {
  tsbk.tabLinkJump({
    url: 'https://s.apps.vip/user/account-info'
  }).then((res) => {
    //res {code: 200, msg: '成功'}
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})

```

##### 四、🧊🔧消息推送 notice 方法 【暂面向想天内置应用】

###### 参数: 1、必填【title: String】消息标题

###### 参数: 2、必填【body: String】消息内容

###### 参数: 3、必填【category: String】消息类型 (lumen 存在以下：【聊天、入群邀请、好友申请】，短说存在以下：【互动消息、关注消息、应用消息】)
###### 参数: 4、选填【indexName: String】消息索引 lumen必填
###### 正确回调返回: `{code: 200, msg: '成功'}`

示例

```
tsbk.ready(function() {
  tsbk.notice({
    title: '标题...',
    body: '消息内容...',
    category: '好友申请',
    indexName: '1_12'
  }).then((res) => {
    //res {code: 200, msg: '成功'}
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})
```

##### 五、🧊🔧想天内置应用的免登 autoLoginSysApp 方法

示例

```
tsbk.ready(function() {
  tsbk.autoLoginSysApp()
})
```

##### 六、🧊🔧唤醒想天内置应用【仅支持后台休眠的内置应用】openSysApp 方法
###### 参数: 1、必填【appName: String】,目前想天内置应用有【团队协作、元社区、收藏夹、导入助手】
###### 参数：2、可选【url: String】，内置应用跳转链接 path 和 parameters 组成部分(不包含第一个'/')，目前仅支持元社区和团队协作的跳转
###### 正确回调返回: `{code: 200, msg: '成功'}`

示例

```
tsbk.ready(function() {
  tsbk.openSysApp({
    appName: '团队协作',
    url: '?fid=xxxxxxx'
  }).then((res) => {
    //res {code: 200, msg: '成功'}
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})
```

##### 七、🧊🔧创建短说圈子邀请链接窗体 openOsxInviteMember 方法
###### 参数: 1、必填【groupId: Number】,圈子的 id
###### 正确回调返回: `{code: 200, msg: '成功'}`

示例

```
tsbk.ready(function() {
  tsbk.openOsxInviteMember({
    groupId: 424
  }).then((res) => {
    //res {code: 200, msg: '成功'}
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})
```

##### 八、🧊🔧获取浏览器用户信息
###### 参数: 无
###### 正确回调返回: `{当前登录浏览器的用户信息}`

示例

```
tsbk.ready(() => {
  tsbk.getUserProfile().then(res => {
    //res 返回的用户信息
    //do something or nothing
  }).catch(err => {
    //do something or nothing
  })
})
```


### 【此部分内容是平台侧的知识点，应用侧开发无需阅读】

1、tsbSdk.listener()监听者有两个参数，
> - 第一个参数是必须的，为 saApp 应用的基本信息
> - 第二个参数是非必须的，为 DepList 订阅器收集，是一个数组，支持往订阅器中注入一个个订阅对象，依据具体情况执行订阅

2、留意区分内置应用和第三方应用的区别,第三方应用需要再转发一层消息到appPreload.js中，用封装好的tsbSdk.bridgeToPreload()方法 
