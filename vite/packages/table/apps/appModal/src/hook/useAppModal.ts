import { ref, h } from "vue";
import { storeToRefs } from "pinia";
import { useAppModalStore } from "../store";
import OpenMode from "./OpenMode.vue";
import { runList as defaultRunList } from "../config/data";
import _ from "lodash";

export const useAppModal = (name: string) => {
  const appModalStore: any = useAppModalStore();
  const { runList } = storeToRefs(appModalStore);
  const app = appModalStore.getApp(name);

  const AppOpenMode = h(OpenMode, {
    name,
  });

  const initApp = () => {
    defaultRunList.forEach((item: any) => {
      const name = item.name;
      const res = runList.value.find((item) => item.name === name);

      if (res) {
        item.visible =
          typeof res.visible == "boolean" ? res.visible : item.visible;
        item.isMaximize =
          typeof res.isMaximize == "boolean" ? res.isMaximize : item.isMaximize;
        item.isFullScreen =
          typeof res.isFullScreen == "boolean"
            ? res.isFullScreen
            : item.isFullScreen;

        Object.assign(res, item);
      } else {
        runList.value.push(item);
      }
    });

    console.log("  runList.value :>> ", runList.value);
  };

  const openApp = (params?: any) => {
    if (app?.openMode === "modal") {
      app.props = params;
      appModalStore.switchVisible(name);
    } else {
      (window as any).$ui.router.push({
        name,
        params,
      });
    }
  };

  const switchVisible = (visible?: boolean) => {
    if (typeof visible === "boolean") {
      app.visible = visible;
    } else {
      app.visible = !app.visible;
    }
  };
  return {
    AppOpenMode,
    initApp,
    openApp,
    switchVisible,
  };
};
