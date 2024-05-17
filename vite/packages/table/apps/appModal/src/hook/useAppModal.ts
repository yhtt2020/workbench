import { ref, h } from "vue";
import { storeToRefs } from "pinia";
import { useAppModalStore } from "../store";
import OpenMode from "./OpenMode.vue";
import { runList as defaultRunList } from "../config/data";

export const useAppModal = (name: string) => {
  const appModalStore: any = useAppModalStore();
  const { runList } = storeToRefs(appModalStore);

  const AppOpenMode = h(OpenMode, {
    name,
  });

  const initApp = () => {
    // 创建一个Set来快速检查name属性是否已存在
    const namesSet = new Set(runList.value.map((item) => item.name));

    // 遍历新数组
    defaultRunList.forEach((item: any) => {
      if (!namesSet.has(item.name)) {
        runList.value.push(item);
      }
    });
  };

  const openApp = (params?: any) => {
    const openMode = appModalStore.getApp(name)?.openMode;
    if (openMode === "modal") {
      appModalStore.switchVisible(name);
    } else {
      (window as any).$ui.router.push({
        name,
        params,
      });
    }
  };

  const switchVisible = (visible?: boolean) => {
    let res = appModalStore.getApp(name);
    if (typeof visible === "boolean") {
      res.visible = visible;
    } else {
      res.visible = !res.visible;
    }
  };
  return {
    AppOpenMode,
    initApp,
    openApp,
    switchVisible,
  };
};
