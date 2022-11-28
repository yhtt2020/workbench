import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import {createRouter,createWebHashHistory} from 'vue-router'
import PopList from './pages/PopList.vue'
const routes=[
  {
    path:'/pop',component: PopList
  }
]
const router=createRouter({
  history:createWebHashHistory(),
  base:'/html/',
  routes
})
let app=createApp(App).use(Antd).use(router).mount('#app')


