import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import Install from './pages/Install.vue'
import {createRouter,createWebHashHistory} from 'vue-router'
const ipc = eval('require')('electron').ipcRenderer
window.ipc=ipc
window.callerId=0
const routes=[
  {
    path:'/install',component:Install
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
createApp(App).use(Antd).use(router).mount('#app')
tools.getWindowArgs(window)


