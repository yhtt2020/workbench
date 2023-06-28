export const viewport = {
  mounted(el, binding) {
    const handleResize = () => {
      const screenWidth = window.innerWidth || document.documentElement.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight;
      binding.value(screenWidth, screenHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    el._handleResize = handleResize;
  },
  onBeforeUnmount(el) {
    const handleResize = el._handleResize;
    window.removeEventListener("resize", handleResize);
    delete el._handleResize;
  }
};