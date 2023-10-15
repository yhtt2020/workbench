import {createApp} from 'vue'
import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.less';
import App from './App.vue'
import ColorPicker from 'colorpicker-v3'
import 'colorpicker-v3/style.css'
import {createRouter, createWebHashHistory} from 'vue-router'
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

import {setupCalendar} from 'v-calendar';
import 'viewerjs/dist/viewer.css'
/*消息提示组件*/
import Toast, {PluginOptions} from 'vue-toastification'
import "vue-toastification/dist/index.css";
// 注册基础组件
// import  baseComponents from "./components/card/libs/index"
import baseComponents from "./ui/libs/index"
// 注册业务组件
// import components from "./components/card/components/index"
import components from "./ui/components/index"

// 注册任务引导
import VueShepherdPlugin from 'vue-shepherd';
import 'shepherd.js/dist/css/shepherd.css';


// 导入codemirror主题色样式表和语言包
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/swift/swift'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/php/php'

import piniaPersist from "./js/ext/pinia-plugin-persist/index";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";

import dayjs from 'dayjs';

import "../../public/css/styleSwitch/index.scss"
import "../../public/css/styleSwitch/codemirror.scss"
import "../../public/css/styleSwitch/toast.scss"
import "../../public/css/styleSwitch/category.scss"
import '../../public/css/styleSwitch/font.scss'
import {router} from './router'
import routerTab from "./js/common/routerTab";

//腾讯IM部分
import {loadChat, TUIKit} from './chat'
loadChat()


//socket部分
import {initSocket} from './js/socket/socket'
// initSocket()

import {Notifications} from './js/common/sessionNotice'


import WujieVue from 'wujie-vue3'
// const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
// Your SDKAppID
// init TUIKit


const notice = new Notifications()
window.$notice = notice


dayjs.locale('zh-cn');

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

// @ts-ignore
window.$ = $
const options: PluginOptions = {}
const $app = app.use(pinia).use(Antd).use(baseComponents).use(components).use(ColorPicker).use(router).use(VueViewer).use(setupCalendar, {}).use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
      trigger: "mouseenter click"
    }, // => Global default options * see all props
  }
).use(Toast, options).use(TUIKit).use(WujieVue).use(VueShepherdPlugin).mount('#app')

app.component('Icon', Icon)
app.component('PanelButton', PanelButton)
app.component('BackBtn', BackBtn)
app.component('vueCustomScrollbar', vueCustomScrollbar)

window.USER_DATA_PATH = window.globalArgs['user-data-dir']//挂载一个用户数据目录的常量，方便后续开发

window.$app = $app

export {
  router
};
