import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import Index from './page/Index.vue'
import vueCustomScrollbar from "../../src/components/vue-scrollbar.vue";
const app = createApp(App)
const pinia = createPinia()
import Icon from './components/Icon.vue'
import PanelButton from './components/PanelButton.vue'
import BackBtn from './components/comp/BackBtn.vue'
import Home from './page/Home.vue'
import Lock from './page/Lock.vue'
import Power from './page/Power.vue'
import Apps from './page/Apps.vue'
import AppFrame from './page/AppFrame.vue'
import Music from './page/Music.vue'
import Status from './page/Status.vue'
//应用
import TomatoStart from './page/app/tomato/TomatoStart.vue'
import Tomato from './page/app/tomato/Tomato.vue'

const routes = [
  {
    path: '',
    name: 'index',
    component: Index,
    children: [
      {
        path: '', name: 'home', component: Home,
      },
      {
        path: '/apps',
        name: 'apps',
        component: Apps

      },
      {
        path: '/music',
        name: 'music',
        component: Music

      },{
        path:'/status',
        name:'status',
        component: Status
      }
    ]
  },
  {
    path: '/lock',
    name: 'lock',
    component: Lock

  },

  {
    path: '/power',
    name: 'power',
    component: Power

  },
  {
    path: '/TomatoStart',
    name: 'tomatoStart',
    component: TomatoStart
  },
  {
    path: '/Tomato',
    name: 'tomato',
    component: Tomato
  }, {
    path: '/app',
    name: 'app',
    component: AppFrame
  }


]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(router).mount('#app')
app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar',vueCustomScrollbar)
export default router;

