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
import Gallery from './page/Gallery.vue'
import Wizard from './page/Wizard.vue'


import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import $ from 'jquery'

//应用
import TomatoStart from './page/app/tomato/TomatoStart.vue'
import Tomato from './page/app/tomato/Tomato.vue'
import Deck from './page/Deck.vue'
import Setting from './page/Setting.vue'
import Weather from './page/app/Weather.vue'
import BiliIndex from './page/app/bili/Index.vue'
import LevelDetail from './page/LevelDetail.vue'
import My from './page/gallery/My.vue'

//设置
import BarrageSetting from './page/settings/BarrageSetting.vue'
import Bing from './page/gallery/Bing.vue'
import Lively from './page/gallery/Lively.vue'
import Wallheaven from './page/gallery/Wallheaven.vue'
import PapersSetting from './page/gallery/Setting.vue'

// @ts-ignore
window.$=$
const routes = [
  {
    path: '',
    name: 'index',
    component: Index,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
      },
      {
        path: '/app',
        name: 'app',
        component: AppFrame,
        children:[

        ]
      },
      {
        path:'/bili',
        name:'bili',
        component: BiliIndex
      },
      {
        path:'/levelDetail',
        name:'levelDetail',
        component: LevelDetail
      },
      {
        path: '/apps',
        name: 'apps',
        component: Apps

      },
      {
        path:'/barrage',
        name:'barrageSetting',
        component: BarrageSetting
      },
      {
        path: '/music',
        name: 'music',
        component: Music
      },
      {
        path:'/weather',
        name:'weather',
        component: Weather
      },
      {
        path:'/deck',
        component: Deck
      },{
        path:'/status',
        name:'status',
        component: Status
      },
      {
        path:'/setting',
        name:'setting',
        component: Setting,
        children: [

        ]
      }
    ]
  },
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    children: [

    ]
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: Gallery,
    children: [
      {
        path:'/bing',
        name:'bing',
        component:Bing
      },
      {
        path:'/lively',
        name:'lively',
        component: Lively
      },
      {
        path:'/wallheaven',
        name:'wallheaven',
        component: Wallheaven
      },
      {
        path:'/my',
        name:'my',
        component: My
      },
      {
        path:'/setting',
        name:'papersSetting',
        component: PapersSetting
      }
    ]
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
  },
  {
    path:'/wizard',
    component: Wizard
  }


]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(router).use(VueViewer).mount('#app')
app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar',vueCustomScrollbar)
export default router;

