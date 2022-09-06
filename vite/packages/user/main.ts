import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import Welcome from './pages/Welcome.vue'
import EnterPwd from './pages/EnterPwd.vue'
import AddAccount from './pages/AddAccount.vue'
import SpaceSelect from './pages/SpaceSelect.vue'
import Template from './pages/Template.vue'
import {createRouter,createWebHashHistory} from 'vue-router'

const routes=[
  {
    path:'/',name:'home',component:Welcome,

  },
  {
    path:'/add',component: AddAccount
  },
  {
    path:'/pwd',name:'pwd',component: EnterPwd
  },
  {
    path:'/space',name:'space',component: SpaceSelect
  },
  {
    path:'/template',name:'template',component: Template
  }

]
const router=createRouter({
  history:createWebHashHistory(),
  routes
})
tools.getWindowArgs(window).globalArgs
createApp(App).use(Antd).use(router).mount('#app')
tools.getWindowArgs(window)


