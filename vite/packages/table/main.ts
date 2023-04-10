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


import Icon from './components/Icon.vue'
import PanelButton from './components/PanelButton.vue'
import BackBtn from './components/comp/BackBtn.vue'


import 'viewerjs/dist/viewer.css'


import piniaPersist from "./js/ext/pinia-plugin-persist/index";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";

import dayjs from 'dayjs';
import routes from './route/route'
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
  cardStore().setRouteParams(to.params)
  next()
})

app.use(pinia).use(Antd).use(vcolorpicker).use(router).use(VueViewer).mount('#app')
app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar',vueCustomScrollbar)

export default router;

