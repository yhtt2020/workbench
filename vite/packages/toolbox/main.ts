import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import tools from "../../src/util/tools.js";
import router from "./router";

tools.getWindowArgs(window);

// tailwind
import "../table/index.css";
// 主题
import "../../public/css/styleSwitch/index.scss";
// 基础组件
import baseComponents from "../table/components/card/components/index";
// 缓存
import cache from "../table/components/card/hooks/cache";

const app = createApp(App);
app.use(Antd).use(router);
// 全局注册基础组件
app.use(baseComponents);
// 全局挂载缓存
app.config.globalProperties.$cache = cache;
app.mount("#app");
