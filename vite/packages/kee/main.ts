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
const pinia = createPinia()
const routes = [
  {
    path: '/', component: Passwords,
    redirect:'detail/:id',
    children:[
      {
        path:'detail/:id',component:PasswordDetail
      },
      {
        path:'language/:id',component:PasswordDetail,
      },
      {
        path:'instant/:id',component:PasswordDetail
      },
      {
        path:'light/:id',component:PasswordDetail
      },
      {
        path:'commun/:id',component:PasswordDetail
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

