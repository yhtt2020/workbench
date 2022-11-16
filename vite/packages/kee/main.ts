import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Passwords from './page/Passwords.vue'
import PasswordDetail from './page/PasswordDetail.vue'
import PasswordLanguage from './page/PasswordLanguage.vue'
const pinia = createPinia()
const routes = [
  {
    path: '/', component: Passwords,
    redirect:'/zenmaster',
    children:[
      {
        path:'/zenmaster',component:PasswordDetail
      },
      {
        path:'/languagefinches',components:PasswordLanguage,
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


