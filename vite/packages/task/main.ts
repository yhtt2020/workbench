import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import {createRouter,createWebHashHistory} from 'vue-router'
import PopStash from './pages/PopStash.vue'
tools.getWindowArgs(window)


const routes=[
  {
    path:'/popStash',component: PopStash
  }
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})


createApp(App).use(Antd).use(router).mount('#app')
