import { ref, onMounted, onBeforeUnmount, type App } from "vue";

const windowWidth = ref(document.documentElement.clientWidth);
const windowHeight = ref(document.documentElement.clientHeight);
// 更新窗口大小
const updateWindowSize = (cb?: Function) => {
  windowWidth.value = document.documentElement.clientWidth;
  windowHeight.value = document.documentElement.clientHeight;
  cb &&
    cb({
      windowWidth,
      windowHeight,
    });
};
// 使用窗口大小
export const useWindowSize = (cb?: Function) => {
  const handleResize = () => updateWindowSize(cb);

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    windowWidth,
    windowHeight,
  };
};
// 局部注册
export const windowSize = {
  mounted: (el: any, binding: any) => {
    const handleResize = () => updateWindowSize(binding.value);

    window.addEventListener("resize", handleResize);

    el._windowSizeCleanup = () => {
      window.removeEventListener("resize", handleResize);
    };
  },
  unmounted: (el: any) => {
    el._windowSizeCleanup();
  },
};

// 全局注册
export const install = (app: App): void => {
  app.directive("windowSize", windowSize);
};
