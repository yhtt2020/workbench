import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import 'vcolorpicker/lib/style.css';
import {createRouter, createWebHashHistory} from 'vue-router'
import vcolorpicker from 'vcolorpicker'
import {createPinia} from 'pinia'
import 'dayjs/locale/zh-cn';
import './index.css'
import {cardStore} from "./store/card";
import vueCustomScrollbar from "../../src/components/vue-scrollbar.vue";

import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // optional for styling

import Icon from './components/Icon.vue'
import PanelButton from './components/PanelButton.vue'
import BackBtn from './components/comp/BackBtn.vue'

import { setupCalendar } from 'v-calendar';
import 'viewerjs/dist/viewer.css'


import piniaPersist from "./js/ext/pinia-plugin-persist/index";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";

import dayjs from 'dayjs';
import routes from './route/route'

import "../../public/css/global.scss"
dayjs.locale('zh-cn');

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

// @ts-ignore
window.$=$

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,from,next) =>{
  if(from.name==='home'){
    document.body.style.setProperty('--backGroundImgBlur',  '12px');
    document.body.style.setProperty('--backGroundImgLight', 0.3);
  }
  cardStore().setRouteParams(to.params)
  next()
})

app.use(pinia).use(Antd).use(vcolorpicker).use(router).use(VueViewer).use(setupCalendar,{}).use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
      trigger:"mouseenter click"
    }, // => Global default options * see all props
  }
).mount('#app')
app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar',vueCustomScrollbar)
export default router;

