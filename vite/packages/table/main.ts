import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Index from './page/Index.vue'
const app = createApp(App)
const pinia = createPinia()
import Icon from './components/Icon.vue'
import PanelButton from './components/PanelButton.vue'
import Home from './page/Home.vue'
import Lock from './page/Lock.vue'

const routes = [
  {
    path:'',
    name:'index',
    component: Index,
    children:[
      {
        path:'',name:'home',component:Home,
      }
    ]
  },
  {
    path:'/lock',
    name:'lock',
    component: Lock

  }


]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(router).mount('#app')
app.component('Icon',Icon)
app.component('PanelButton',PanelButton)
export default router;

