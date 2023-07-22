import { createApp } from "vue";

import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import tools from "../../src/util/tools.js";

tools.getWindowArgs(window);

import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
const pinia = createPinia();
// 基础样式
import "./styles/index.scss";
// 主题样式
import "../../public/css/styleSwitch/index.scss";
// 基础组件
import baseComponents from "../table/components/card/components/index";
// 缓存
const app = createApp(App);
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\components\Icon.vue
import Icon from "../table/components/Icon.vue"


// 挂载Antd
app.use(Antd);

app.use(pinia).use(router);

// 全局注册基础组件
app.use(baseComponents);

// 全局挂载缓存
import cache from "../table/components/card/hooks/cache";
app.config.globalProperties.$cache = cache;

app.mount("#app");
