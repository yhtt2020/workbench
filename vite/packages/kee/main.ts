import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/icon/iconfont.css'
import App from './App.vue'
import tools from '../../src/util/tools.js'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Passwords from './page/Passwords.vue'
import PasswordDetail from './page/PasswordDetail.vue'
import PasswordLanguage from './page/PasswordLanguage.vue'
import PasswordInstant from './page/PasswordInstant.vue'
import LightFlow from './page/LightFlow.vue'
import Community from './page/Community.vue'
const pinia = createPinia()
const routes = [
  {
    path: '/', component: Passwords,
    redirect:'/zenmaster',
    children:[
      {
        path:'zenmaster',component:PasswordDetail
      },
      {
        path:'languagefinches',component:PasswordLanguage,
      },
      {
        path:'instant',component:PasswordInstant
      },
      {
        path:'light',component:LightFlow
      },
      {
        path:'yuan',component:Community
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})


createApp(App).use(pinia).use(Antd).use(router).mount('#app')

tools.getWindowArgs(window)

export default router;

