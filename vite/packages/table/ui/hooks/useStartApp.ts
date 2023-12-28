import browser from "../../js/common/browser";
import { appStore } from "../../store";
import {taskStore} from "../../apps/task/store";
/**
 *
 * @param type
 * @param value
 * @param router 这个是路由 ts无法调用 得手动传入
 */
export const startApp = (type, value, router?) => {
  if (type === "" || value === "") {
    console.warn("startApp :>> type or value 不能为空");
  }
  switch (type) {
    // 默认浏览器
    case "default":
      browser.openInSystem(value);
      break;
    // 嵌入浏览器
    case "internal":
      browser.openInTable(value, {});
      break;
    // 想天浏览器
    case "thinksky":
      browser.openInInner(value);
      break;
    // 轻应用
    case "lightApp":
      ipc.send("executeAppByPackage", {
        package: value,
      });
      break;
    // 酷应用
    case "coolApp":
      router.push({ name: "app", params: value });
      break;
    // 本地应用
    case "tableApp":
      require("electron").shell.openPath(require("path").normalize(value));
      break;
    // 系统应用
    case "systemApp":
      // router.push({ name: value });
      openSysApp(value,router)
      break;
    // 不知道是什么场景
    case "localApp":
      require("electron").shell.openPath(value);
      break;
  }
};

export const openSysApp = (value,router)=>{
  const useAppStore = appStore();
  const useTakeStore = taskStore()
  if(value === 'fullscreen'){
    useAppStore.toggleFullScreen()
  } else if(value === 'task'){
    useTakeStore.isTaskDrawer = true
  } else if(value === 'commun'){
    console.log(1111);
    return
  } else{
    router.push({name:value})
  }
}
