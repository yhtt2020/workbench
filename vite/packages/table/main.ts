import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createPinia } from "pinia";
import Index from "./page/Index.vue";
import vueCustomScrollbar from "../../src/components/vue-scrollbar.vue";

import Icon from "./components/Icon.vue";
import PanelButton from "./components/PanelButton.vue";
import BackBtn from "./components/comp/BackBtn.vue";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";

import piniaPersist from "pinia-plugin-persist";

import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";

import $ from "jquery";

//应用
// import TomatoStart from "./page/app/tomato/TomatoStart.vue";
// import Tomato from "./page/app/tomato/Tomato.vue";
// import Deck from "./page/Deck.vue";
// import Setting from "./page/Setting.vue";
// import Weather from "./page/app/Weather.vue";
// import BiliIndex from "./page/app/bili/Index.vue";
// import LevelDetail from "./page/LevelDetail.vue";
// import AddCard from "./page/app/add/AddCard.vue";
// import CardSetting from "./page/app/add/CardSetting.vue";
// //设置
// import BarrageSetting from "./page/settings/BarrageSetting.vue";

// // @ts-ignore
// window.$ = $;
// const routes = [
//   {
//     path: "",
//     name: "index",
//     component: Index,
//     children: [
//       {
//         path: "",
//         name: "home",
//         component: Home,
//       },
//       {
//         path: "/app",
//         name: "app",
//         component: AppFrame,
//         children: [],
//       },
//       {
//         path: "/bili",
//         name: "bili",
//         component: BiliIndex,
//       },
//       {
//         path: "/levelDetail",
//         name: "levelDetail",
//         component: LevelDetail,
//       },
//       {
//         path: "/apps",
//         name: "apps",
//         component: Apps,
//       },
//       {
//         path: "/barrage",
//         name: "barrageSetting",
//         component: BarrageSetting,
//       },
//       {
//         path: "/music",
//         name: "music",
//         component: Music,
//       },
//       {
//         path: "/weather",
//         name: "weather",
//         component: Weather,
//       },
//       {
//         path: "/deck",
//         component: Deck,
//       },
//       {
//         path: "/status",
//         name: "status",
//         component: Status,
//       },
//       {
//         path: "/setting",
//         name: "setting",
//         component: Setting,
//         children: [],
//       },
//       {
//         path: "/addCard",
//         name: "addCard",
//         component: AddCard,
//       },
//       {
//         path: "/setting",
//         name: "addCardSetting",
//         component: CardSetting,
//       },
//     ],
//   },
//   {
//     path: "/lock",
//     name: "lock",
//     component: Lock,
//     children: [],
//   },
//   {
//     path: "/gallery",
//     name: "gallery",
//     component: Gallery,
//   },
//   {
//     path: "/power",
//     name: "power",
//     component: Power,
//   },
//   {
//     path: "/TomatoStart",
//     name: "tomatoStart",
//     component: TomatoStart,
//   },
//   {
//     path: "/Tomato",
//     name: "tomato",
//     component: Tomato,
//   },
//   {
//     path: "/wizard",
//     component: Wizard,
//   },
// ];
// const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
// });
// app.use(pinia).use(Antd).use(router).mount("#app");
// app.component("Icon", Icon);
// app.component("PanelButton", PanelButton);
// app.component("BackBtn", BackBtn);
// app.component("vueCustomScrollbar", vueCustomScrollbar);

import routes from "./route/route";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

// @ts-ignore
window.$ = $;

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
app.use(pinia).use(Antd).use(router).use(VueViewer).mount("#app");
app.component("Icon", Icon);
app.component("PanelButton", PanelButton);
app.component("BackBtn", BackBtn);
app.component("vueCustomScrollbar", vueCustomScrollbar);
export default router;
