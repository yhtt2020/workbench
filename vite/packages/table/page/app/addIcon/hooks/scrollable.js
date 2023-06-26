// 局部注册
export const scrollable = {
  mounted(el) {
    const handleMouseWheel = (event) => {
      event.preventDefault();
      let left = event.deltaY / 2;
      el.scrollLeft = el.scrollLeft + left;
    };
    el.addEventListener("wheel", handleMouseWheel);
  },
  onBeforeUnmount(el) {
    el.removeEventListener("wheel", handleMouseWheel);
  },
};

// 全局注册
export const scrollableInstall = (app) => {
  app.directive("scrollable", scrollable);
};
