// import devtools from '@vue/devtools'//注释此行无法连接vue调试工具
// 注册想天客户端状态
import { isWeb, isWin, isMac, isOffline, isGuest, isSingle } from "./ui/hooks/env";
import {
  useEnv,
  useEnvLimit,
  // useComLimit,
  currentEnv,
} from "./permission/useEnv";
import {
  usePlat,
  usePlatLimit,
  useComLimit,
  currentPlat,
} from "./permission/usePlat.ts";
import type { UseEnv, baseEnv } from "./permission/useEnv";
import archiveHelper from "./js/lib/archiveHelper";
window.$isOffline = isOffline;
window.$isGuest = isGuest;
window.$isSingle = isSingle;
window.$useEnv = useEnv;
window.$usePlat = usePlat;
window.$currentEnv = currentEnv;
window.$currentPlat = currentPlat;
window.$useEnvLimit = useEnvLimit;
window.$usePlatLimit = usePlatLimit;
window.$useComLimit = useComLimit;
//import {initDb} from './js/api/db'
import { createApp } from "vue";
import Antd from "ant-design-vue";
// import 'ant-design-vue/dist/antd.less';
import App from "./App.vue";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import "dayjs/locale/zh-cn";
import "./index.css";
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
// 新版天天应用
import '../table/apps/ttApp/src/modules/wujie/theme.css'
// 注册任务引导
import VueShepherdPlugin from "vue-shepherd";
import "shepherd.js/dist/css/shepherd.css";
// 注册系统相关样式和字体
import "../../public/css/index.scss";

import { confirm } from "./ui/new/confirm";
import type { Confirm } from "./ui/new/confirm";
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

//initDb()
//socket部分
import { initSocket } from "./js/socket/socket";
initSocket();
import initStores from "./initStores";

import { Notifications } from "./js/chat/sessionNotice";

import Wujie from "wujie-vue3";

import { tt } from "./permission/global/global";
import { useMit } from "./hooks";
import type { TT } from "./permission/global/type";

import hevueImgPreview from "hevue-img-preview";

import tsbApi from './js/lib/tsbApi'

const { ipcRenderer } = require("electron");
import {screenStore} from "./store/screen";
import {appStore} from "./store";

// Your SDKAppID
// init TUIKit
if(!usePlat('client')){
  (window as any).tsbApi=tsbApi
}
const notice = new Notifications();
(window as any).$notice = notice;

dayjs.locale("zh-cn");

const app = createApp(App);

//腾讯IM部分
// import { loadChat,TUIKit } from "./chat";
import { loadChat,TUIChatKit,TUIComponents} from "./chat";
loadChat();
TUIChatKit.components(TUIComponents,app);

// 导入IM的UI覆写样式文件
import "./apps/chat/assets/chat.scss";

app.use(Wujie);
// app.use(hevueImgPreview)
// 使用 provide 将全局变量作为响应式对象
app.provide("isWeb", isWeb);
app.provide("isWin", isWin);
app.provide("isMac", isMac);
app.provide("isOffline", isOffline);
app.provide("isSingle", isSingle);
app.provide("isGuest", isGuest);
app.provide("$useEnv", useEnv);
app.provide("$usePlat", usePlat);
app.provide("currentEnv", currentEnv);
app.provide("currentPlat", currentPlat);

// 使用 globalProperties 将全局变量附加到 Vue 实例上
app.config.globalProperties.$currentEnv = currentEnv;
app.config.globalProperties.$currentPlat = currentPlat;
app.config.globalProperties.$isWeb = isWeb;
app.config.globalProperties.$isWin = isWin;
app.config.globalProperties.$isMac = isMac;
app.config.globalProperties.$isOffline = isOffline;
app.config.globalProperties.$isSingle = isSingle;
app.config.globalProperties.$isGuest = isGuest;
app.config.globalProperties.$bus = useMit;
app.config.globalProperties.$useEnv = useEnv;
app.config.globalProperties.$usePlat = usePlat;
window.$ui = {
  confirm,
  router,
};
const newTT: TT = tt;

declare global {
  interface Window {
    tt: TT;
  }
}

window.tt = tt;
app.provide("tt", newTT);
app.config.globalProperties.tt = newTT;

const pinia = createPinia();
pinia.use(piniaPersist);

// @ts-ignore
window.$ = $;
const options: PluginOptions = {};
const $app = app
  .use(pinia)
  .use(Antd)
  .use(Vue3ColorPicker)
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
  // 旧版使用TUIKit组件挂载
  // .use(TUIKit)
  // .use(WujieVue)
  .use(hevueImgPreview)
  .use(VueShepherdPlugin)
  .use(XTUI)
  .mount("#app");
registerXTUI(app);

app.component("Icon", Icon);
app.component("PanelButton", PanelButton);
app.component("BackBtn", BackBtn);
app.component("vueCustomScrollbar", vueCustomScrollbar);

if (usePlat('client')) {
  window.USER_DATA_PATH = window.globalArgs["user-data-dir"]; //挂载一个用户数据目录的常量，方便后续开发
}

// 监听窗口位置尺寸变化
ipcRenderer.on("start-watch-window-size-position", (event, data) => {
  const screen = screenStore()
  if(screen.screenFlag){
    const app = appStore()
    const zoom = app.settings.zoomFactor
    screen.screenTip = true
    screen.currentScreen = {...data, zoom}
  }
});

window.$app = $app;
initStores();

// devtools.connect()
export { router };
