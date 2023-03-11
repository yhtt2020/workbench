import {createApp} from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import 'vcolorpicker/lib/style.css';
import {createRouter, createWebHashHistory} from 'vue-router'
import vcolorpicker from 'vcolorpicker'
import {createPinia} from 'pinia'



import vueCustomScrollbar from "../../src/components/vue-scrollbar.vue";


import Icon from './components/Icon.vue'
import PanelButton from './components/PanelButton.vue'
import BackBtn from './components/comp/BackBtn.vue'


import 'viewerjs/dist/viewer.css'


import piniaPersist from "pinia-plugin-persist";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";


import routes from './route/route'


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

// @ts-ignore
window.$=$

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
app.use(pinia).use(Antd).use(vcolorpicker).use(router).use(VueViewer).mount('#app')
app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar',vueCustomScrollbar)
export default router;

