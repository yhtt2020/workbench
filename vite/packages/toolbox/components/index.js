/**
 * 因为工作台基础组件在工具箱项目使用会有不兼容情况
 * 在这里会对一些基础组件进行重构
 */
import { defineAsyncComponent } from "vue";
export default {
  install(app) {
    // 1、获取当前路径下所有文件中的index.vue
    const components = import.meta.glob("./*/index.vue");
    // 2、遍历组件模块
    for (const [fullPath, fn] of Object.entries(components)) {
      const component = fullPath.replace("./", "").split("/")[0];
      const componentName = "T" + component;
      // 3、进行注册
      app.component(componentName, defineAsyncComponent(fn));
    }
  },
};
