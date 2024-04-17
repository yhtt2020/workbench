import { message } from "ant-design-vue";
import browser from "../../../../../js/common/browser";
import { useTTAppStore } from "../../store";
import { useTheme } from "./useTheme";
import { storeToRefs } from "pinia";
export const useWuJiePlugins = (id: string) => {
  console.log("id :>> ", id);
  const wuJieStore = useTTAppStore();
  const { ttappData } = storeToRefs(wuJieStore);
  // 数据不存在
  if (!(id in ttappData.value)) {
    ttappData.value[id] = {};
  }
  if (!(appInfo.id in data.value)) {
    data.value[appInfo.id] = {};
  }
  let res = {
    jsAfterLoaders: [
      // // 插入一个外联脚本
      // { src: "http://xxxx.js" },
      // // 插入一个内联监本
      // { content: 'console.log("test")' },
      // 执行一个回调，打印子应用名字
      {
        callback(appWindow) {
          useTheme(appWindow);
        },
      },
    ],
    windowPropertyOverride: (iframeWindow) => {
      // 屏蔽子应用parent对象 指向主应用window
      iframeWindow.parent = {};
      // 屏蔽子应用$wujie对象
      // iframeWindow.$wujie = {};
      // 代理open
      iframeWindow.open = (url, target, features, replace) => {
        browser.openInUserSelect(url);
      };
      // 代理alert
      iframeWindow.alert = (msg) => {
        message.info(msg);
      };
      // 代理localStorage
      iframeWindow.localStorage.getItem = (key) => {
        return ttappData.value[id][key];
      };
      iframeWindow.localStorage.setItem = (key, value) => {
        ttappData.value[id][key] = value;
      };
      iframeWindow.localStorage.removeItem = (key) => {
        delete ttappData.value[id][key];
      };
      iframeWindow.localStorage.clear = () => {
        ttappData.value[id] = {};
      };

      console.log(iframeWindow,'传递下去的window')
      return iframeWindow;
    },
    cssAfterLoaders: [
      { content: "body{position: relative}" },
    ],
    // cssAfterLoaders: [{ src: "http://127.0.0.1:5500/base.css" }],
  };
  return res;
};
// // 子应用监听事件
// window.$wujie?.bus.$on("事件名字", function (arg1, arg2, ...) {});
