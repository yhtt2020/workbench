import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia).use(Antd).mount("#app");
