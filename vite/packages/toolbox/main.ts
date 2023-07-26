import { createApp } from "vue";

import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import tools from "../../src/util/tools.js";

import Icon from './components/Icon.vue'
tools.getWindowArgs(window);

import router from "./router";
import Antd from "ant-design-vue";

import { createPinia } from "pinia";
import piniaPersist from "../table/js/ext/pinia-plugin-persist/index";
const pinia = createPinia();
pinia.use(piniaPersist);

// 基础样式
import "./styles/index.scss";
// 主题样式
import "../../public/css/styleSwitch/index.scss";
// 组件
import baseComponents from "../table/components/card/components/index";
import toolBaseComponents from "./components/index";

const app = createApp(App);

app.use(Antd).use(pinia).use(router);

app.component("Icon", Icon);
app.use(baseComponents).use(toolBaseComponents);

import cache from "../table/components/card/hooks/cache";
app.config.globalProperties.$cache = cache;

app.mount("#app");
