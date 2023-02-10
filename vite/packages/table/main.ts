import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import tools from '../../src/util/tools.js'
import * as antIcons from '@ant-design/icons-vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Index from './page/Index.vue'
const app = createApp(App)
app.config.globalProperties.$antIcons = antIcons
const pinia = createPinia()
const routes = [
  {
    path:'/',
    name:'index',
    component: Index
  },

]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(router).mount('#app')
tools.getWindowArgs(window)

export default router;

