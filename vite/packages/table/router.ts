import { createRouter, createWebHashHistory,createWebHistory } from "vue-router";
import routes from "./route/route";
import { appStore } from "./store";
import { message } from "ant-design-vue";
import { usePlatLimit, usePlat } from "../table/ui/hooks/usePlat";
import { useUserPermit } from "../table/permission/user/useUserPermit";
const router = createRouter({
  //在开发调试模式下，需要使用webHash模式，否则进去空白，打包换回webHistory
  history: createWebHistory(),
  routes,
});
router.beforeEach(async (to, from, next) => {

  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  await useUserPermit();
  // 用户环境判断 优先级2
  if (
    usePlatLimit("web", to.name, {
      msg: false,
    })
  ) {
    console.log("路由触发限制环境拦截 :>> ",to.name);
    next({
      name: "home",
    });
  }

  // 桌面定制时屏蔽路由跳转功能
  if (!appStore().showGuide) {
    //检测是否是需要记忆的
    //判断当前是某个路由的根目录，且meta里配置了记忆
    // if (to.redirectedFrom) {
    //   if (to.redirectedFrom.meta.rememberChildrenPosition) {
    //     //查询记忆位置
    //     let rememberPosition = localStorage.getItem(
    //       "router:remember:" + to.redirectedFrom.name
    //     );
    //     if (rememberPosition) {
    //       try {
    //         const remRoute = JSON.parse(rememberPosition);
    //         if (remRoute.name !== to.name) {
    //           next(remRoute);
    //         }
    //       } catch (e) {
    //         localStorage.removeItem(
    //           "router:remember:" + to.redirectedFrom.name
    //         );
    //         console.error("未找到记忆路由，不做操作");
    //       }
    //     }
    //   }
    // }
    //抽出匹配到的进行遍历，并判断其中是否存在rember位置的，如果存在记忆位置的，则将当前的位置和参数，整个存入localstorage以便下次取出
    // let needWrite = from.matched.find((item) => {
    //   return item.meta.rememberChildrenPosition;
    // });
    // if (needWrite) {
    //   localStorage.setItem(
    //     "router:remember:" + needWrite.name,
    //     JSON.stringify({
    //       name: from.name,
    //       params: from.params,
    //     })
    //   );
    // }

    if (from.name === "home") {
      document.body.style.setProperty("--backGroundImgBlur", "12px");
      document.body.style.setProperty("--backGroundImgLight", 0.3);
    }
    // cardStore().setRouteParams(to.params);
    next();
  } else {
    message.info("定制过程中无法操作");
  }
});
router.afterEach((to, from) => {
  // appStore().currentRoute = {
  //   name: to.name,
  //   params: to.params,
  // };
});
export { router };
