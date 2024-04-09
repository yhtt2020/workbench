import { ref, onMounted, type App } from "vue";
const timer: any = ref(null);
export function useDoubleClick(doubleCallback, clickCallback?) {
  const doubleClick = (event) => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
      doubleCallback?.(event); // 执行双击事件的回调函数
    } else {
      timer.value = setTimeout(() => {
        timer.value = null;
        clickCallback?.(event); // 执行单击事件的回调函数
      }, 200); // 假设200毫秒内没有第二次点击，则视为单击
    }
  };

  return { doubleClick };
}

// 局部注册
export const vDoubleClick = {
  mounted: (el: Element, binding: any) => {
    const { doubleClick } = useDoubleClick(
      () => {
        // 双击事件回调
        if (binding.value && typeof binding.value === "function") {
          binding.value("double");
        }
      },
      () => {
        // 单击事件回调
        if (binding.arg && typeof binding.arg === "function") {
          binding.arg("single");
        }
      }
    );

    el.addEventListener("click", doubleClick);
  },
  unmounted: (el: Element) => {
    // el.removeEventListener("click", doubleClick);
  },
};

// 全局注册
export const install = (app: App): void => {
  app.directive("resize", vDoubleClick);
};
