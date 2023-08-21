// 主要保存 二次封装后的基础组件
import "@vue/runtime-core";

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    XtTab: typeof import("./Tab/index.vue")["default"];
  }
}
