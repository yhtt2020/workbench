import { defineAsyncComponent, defineComponent } from "vue";
export default {
  install(app) {
    // 1、获取当前路径下所有文件中的index.vue
    const components = import.meta.glob("./*/index.vue");
    // 2、遍历组件模块
    for (const [fullPath, fn] of Object.entries(components)) {
      const component = fullPath.replace("./", "").split("/")[0];
      const componentName = "Xt" + component;
      // 3、进行注册
      if (componentName == "XtZoom") {
        console.log('componentName :>> ', componentName);
        // app.component(componentName, defineComponent(component));
      } else {
        app.component(
          componentName,
          defineAsyncComponent(() =>
            fn().then((module) => {
              return module.default;
            })
          )
        );
      }
    }
  },
};
