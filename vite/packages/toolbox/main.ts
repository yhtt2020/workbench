import { createApp } from "vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import piniaPersist from "../table/js/ext/pinia-plugin-persist/index";
// 基础样式
import "./styles/index.scss";
// 主题样式
import "../../public/css/styleSwitch/index.scss";
// 注册基础组件
import baseComponents from "../table//components/card/libs/index";
// 注册业务组件
import components from "../table//components/card/components/index";

import cache from "../table/components/card/hooks/cache";

// @ts-ignore
const { tools } = window.$models;
tools.getWindowArgs(window);

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);

app.use(Antd).use(router);

app.use(baseComponents).use(components);

app.config.globalProperties.$cache = cache;

app.mount("#app");
