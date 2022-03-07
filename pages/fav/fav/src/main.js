import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import './assets/css/main.css'
import 'ant-design-vue/dist/antd.css'
import store from './store'
import tsbk from '@/core/tsbSdk'
let app=createApp(App).use(Antd).use(store).mount('#app')
if(window.tsbSdk){
  //本地应用环境下采用此登录方法
  window.tsbk=tsbk //将客户端sdk挂载在windows对象上
  tsbk.config({
    signature: "ts"
  })
  tsbk.on('gotUserInfo',(event,args)=> {
    let user =args.user.value
    app.$store.commit('saveUserInfo',user)
  })
  tsbk.ready()
  window.appReady()
}else{
  //非本地部署采用其他方法
}

// window.addEventListener("message", function (e) {
//
//   let channel = e.data.eventName;
//   let args=e.data.args
//   console.log('收到message',channel,args)
// }
// )
