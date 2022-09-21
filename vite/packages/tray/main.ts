import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import {createRouter,createWebHashHistory} from 'vue-router'
import Detail from './page/Detail.vue'
import Home from './page/Home.vue'
import './styles/flex-class.css' // 引入flex快写样式
import './styles/box.css'
import './styles/text.css'

const routes=[
  {
    path:'/',component: Home,
  },
  {
    path:'/detail',component: Detail
  }
]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})

createApp(App).use(Antd).use(router).mount('#app')

