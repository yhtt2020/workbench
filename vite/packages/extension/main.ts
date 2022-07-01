import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import {createRouter,createWebHashHistory} from 'vue-router'
import Install from './pages/Install.vue'
import PopList from './pages/PopList.vue'
const ipc = eval('require')('electron').ipcRenderer
window.ipc=ipc
window.callerId=0
const routes=[
  {
    path:'/install',component:Install
  },
  {
    path:'/pop',component: PopList
  }
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})
ipc.invoke('getPopCallerId').then((data)=>{
  console.log(data)
  window.callerId=data
})
tools.getWindowArgs(window).globalArgs
createApp(App).use(Antd).use(router).mount('#app')
tools.getWindowArgs(window)


