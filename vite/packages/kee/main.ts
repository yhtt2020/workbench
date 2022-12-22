import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/icon/iconfont.css'
import App from './App.vue'
import tools from '../../src/util/tools.js'
import * as antIcons from '@ant-design/icons-vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Passwords from './page/Passwords.vue'
import PasswordDetail from './page/PasswordDetail.vue'
import PasswordBank from './page/PasswordBank.vue'
import RemarkEditor from './page/RemarkEditor.vue'
const app = createApp(App)
app.config.globalProperties.$antIcons = antIcons
const pinia = createPinia()
const routes = [
  {
    path:'/remarkEditor/:uuid?',
    name:'remark',
    component: RemarkEditor
  },
  {
    path:'/passwordBank',
    name:'bank',
    component: PasswordBank
  },
  {
    path:'/passwords/value/:value?/type/:type?/:uuid?/:target?',
    name:'passwords',
    component: Passwords,
    children: [
      {
        name:'detail',
        path:'',
        component:PasswordDetail
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(router).mount('#app')
tools.getWindowArgs(window)

export default router;

