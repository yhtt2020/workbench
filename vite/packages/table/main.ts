// import devtools from '@vue/devtools'//注释此行无法连接vue调试工具

// 注册想天客户端状态
import currentEnv, { isWeb, isClient, isMac, isOffline } from "./ui/hooks/env";
window.$currentEnv = currentEnv;
window.$isWeb = isWeb;
window.$isClient = isClient;
window.$isMac = isMac;
window.$isOffline = isOffline;
import { createApp } from "vue";
import Antd from "ant-design-vue";
// import 'ant-design-vue/dist/antd.less';
import App from "./App.vue";
import ColorPicker from "colorpicker-v3";
import "colorpicker-v3/style.css";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import "dayjs/locale/zh-cn";
import "./index.css";
import { cardStore } from "./store/card";
import vueCustomScrollbar from "../../src/components/vue-scrollbar.vue";

import VueTippy from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling

import Icon from "./components/Icon.vue";
import PanelButton from "./components/PanelButton.vue";
import BackBtn from "./components/comp/BackBtn.vue";

import { setupCalendar } from "v-calendar";
import "viewerjs/dist/viewer.css";
/*消息提示组件*/
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
// 注册基础组件
// import  baseComponents from "./components/card/libs/index"
// import baseComponents from "./ui/libs/index"
// 注册业务组件
// import components from "./components/card/components/index"
// import components from "./ui/components/index.js"
import XTUI from "./ui/new/index.js";
import registerXTUI from "./ui/index";
// 注册任务引导
import VueShepherdPlugin from "vue-shepherd";
import "shepherd.js/dist/css/shepherd.css";
// 注册系统相关样式和字体
import "../../public/css/index.scss";
//
// import { confirm } from "../../../ui/new/confirm/index";
import { confirm } from "./ui/new/confirm";

// 导入codemirror主题色样式表和语言包
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/swift/swift";
import "codemirror/mode/clike/clike";
import "codemirror/mode/php/php";

import piniaPersist from "./js/ext/pinia-plugin-persist/index";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";

import dayjs from "dayjs";

import "../../public/css/styleSwitch/codemirror.scss";
import "../../public/css/toast.scss";
import "../../public/css/category.scss";

import { router } from "./router";
import routerTab from "./js/common/routerTab";

//腾讯IM部分
import { loadChat, TUIKit } from "./chat";
loadChat();

//socket部分
import { initSocket } from "./js/socket/socket";
initSocket();
import initStores from "./initStores";

import { Notifications } from "./js/common/sessionNotice";

import WujieVue from "wujie-vue3";
import mitt from "mitt";
// const { bus, setupApp, preloadApp, destroyApp } = WujieVue;
// Your SDKAppID
// init TUIKit

const notice = new Notifications();
window.$notice = notice;

const Mit = mitt();

dayjs.locale("zh-cn");

const app = createApp(App);

// 使用 provide 将全局变量作为响应式对象
app.provide("currentEnv", currentEnv);
app.provide("isWeb", isWeb);
app.provide("isClient", isClient);
app.provide("isMac", isMac);
app.provide("isOffline", isOffline);
// 使用 globalProperties 将全局变量附加到 Vue 实例上
app.config.globalProperties.$currentEnv = currentEnv;
app.config.globalProperties.$isWeb = isWeb;
app.config.globalProperties.$isClient = isClient;
app.config.globalProperties.$isMac = isMac;
app.config.globalProperties.$isOffline = isOffline;
app.config.globalProperties.$mit = Mit;
app.config.globalProperties.$xtConfirm = confirm;

const pinia = createPinia();
pinia.use(piniaPersist);

// @ts-ignore
window.$ = $;
const options: PluginOptions = {};
const $app = app
  .use(pinia)
  .use(Antd)
  .use(ColorPicker)
  .use(router)
  .use(VueViewer)
  .use(setupCalendar, {})
  .use(
    VueTippy,
    // optional
    {
      directive: "tippy", // => v-tippy
      component: "tippy", // => <tippy/>
      componentSingleton: "tippy-singleton", // => <tippy-singleton/>,
      defaultProps: {
        placement: "auto-end",
        allowHTML: true,
        trigger: "mouseenter click",
      }, // => Global default options * see all props
    }
  )
  .use(Toast, options)
  .use(TUIKit)
  .use(WujieVue)
  .use(VueShepherdPlugin)
  .use(XTUI)
  .mount("#app");
registerXTUI(app);

app.component("Icon", Icon);
app.component("PanelButton", PanelButton);
app.component("BackBtn", BackBtn);
app.component("vueCustomScrollbar", vueCustomScrollbar);

window.USER_DATA_PATH = window.globalArgs["user-data-dir"]; //挂载一个用户数据目录的常量，方便后续开发

window.$app = $app;
initStores();
// devtools.connect()
export { router };
