import WujieVue from "wujie-vue3";
const { bus, setupApp, preloadApp, destroyApp } = WujieVue;

import cache from "../../../../../components/card/hooks/cache";

export const setTheme = () => {
  bus.$emit("setTheme", cache.get("themeName"));
};
export const setThemeColor = () => {
  bus.$emit(
    "setThemeColor",
    cache.get("--active-bg"),
    cache.get("--active-secondary-bg")
  );
};
export const useWuJieBus = () => {
  // 监听设置事件
  bus.$on("getTheme", () => {
    setTheme();
  });
  bus.$on("getThemeColor", () => {
    setThemeColor();
  });
};
