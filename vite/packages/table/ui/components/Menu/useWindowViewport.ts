import { ref, onMounted, onBeforeUnmount } from "vue";

export default () => {
  // 创建窗口大小
  const windowWidth = ref(document.documentElement.clientWidth);
  const windowHeight = ref(document.documentElement.clientHeight);

  let resizeTimer: any = null; // 用于存储 setTimeout 的返回值

  const updateWindowDimensions = () => {
    // 在窗口大小变化停止后才更新窗口大小
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      windowWidth.value = document.documentElement.clientWidth;
      windowHeight.value = document.documentElement.clientHeight;
    }, 200); // 设置防抖延迟为200毫秒
  };

  // 监听窗口大小变化事件
  onMounted(() => {
    window.addEventListener("resize", updateWindowDimensions);
  });

  // 提供清理函数以移除事件监听器
  onBeforeUnmount(() => {
    window.removeEventListener("resize", updateWindowDimensions);
    clearTimeout(resizeTimer); // 清除定时器，避免在组件卸载后继续执行定时器内的逻辑
  });

  return {
    windowWidth,
    windowHeight,
  };
};
