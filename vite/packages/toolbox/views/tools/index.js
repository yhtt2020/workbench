// import { defineAsyncComponent } from "vue";
let test = "showTools";
let toolsRouter = [
  {
    path: "/",
    name: test,
    component: () => import("../views/" + test + "/index.vue"),
  },
];
let toolsList = [];

export default {
  install(app) {
    // 1、获取当前路径下所有文件中的index.vue
    const components = import.meta.glob("./*/index.vue");
    // 2、遍历组件模块
    for (const [fullPath, fn] of Object.entries(components)) {
      const name = fullPath.replace("./", "").split("/")[0];
      console.log("fullPath :>> ", fullPath);
      // 动态添加路由
      // 动态添加路由
      const route = {
        path: "/",
        component: () => import("../views/tools/" + name + "/index.vue"),
      };
      toolsRouter.push(route);
      // 动态添加数组
      toolsList.push({
        img: "../../assets/images/" + name + ".jpg",
      });
      // 3、进行注册
      //   app.component(componentName, defineAsyncComponent(fn));
    }
  },
};
export { toolsRouter, toolsList };
