import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import {createRouter,createWebHashHistory} from 'vue-router'
import Index from './pages/Index.vue'
import Learn from './pages/Learn.vue'
import Home from './pages/Home.vue'
import Results from './pages/Results.vue'
import {createPinia} from "pinia";
const pinia = createPinia()
tools.getWindowArgs(window)
window.tools=tools

const routes=[
  {
    path:'/',component: Index,
    children:[
      {
        path:'/',component: Home
      },
      {
        path:'learn',component: Learn
      },
      {
        path:'results',component: Results
      }
    ]
  },


]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})


createApp(App).use(pinia).use(Antd).use(router).mount('#app')
