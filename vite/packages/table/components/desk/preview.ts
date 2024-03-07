// 本文件专用于挂载需要 预览 的组件，不要在此文件中引入其他文件
import { defineAsyncComponent } from "vue";
/**
 * 挂载相关组件
 */
import Vuuri from "../vuuriHome/Vuuri.vue";
const MyIcons = defineAsyncComponent(
  () => import("../widgets/myIcons/index.vue")
);

const FloatMenu = defineAsyncComponent(
  () => import("./floatMenu/FloatMenu.vue")
);
// import Folder from "../../apps/folder";
const Folder = defineAsyncComponent(() => import("../../apps/folder"));
export default {
  components: {
    Vuuri,
    Folder,
    FloatMenu,
    MyIcons,
  },
};
