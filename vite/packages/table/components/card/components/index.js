import { defineAsyncComponent } from "vue";
// 字符串转大写
const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default {
  install(app) {
    // 1、获取当前路径下所有文件中的index.vue
    const components = import.meta.glob("./*/index.vue");
    // 2、遍历组件模块
    for (const [fullPath, fn] of Object.entries(components)) {
      const component = capitalizeFirstLetter(
        fullPath.replace("./", "").split("/")[0]
      );
      const componentName = "Xt" + component;
      // 3、进行注册
      app.component(componentName, defineAsyncComponent(fn));
    }
  },
};
