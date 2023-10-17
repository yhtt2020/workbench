import { ref, onMounted } from "vue";
// 获取窗口大小
const windowWidth = ref(document.documentElement.clientWidth);
const windowHeight = ref(document.documentElement.clientHeight);

export default () => {
  onMounted(() => {
    // 窗口更新返回最新的窗口大小
    window.addEventListener("resize", () => {
      windowWidth.value = document.documentElement.clientWidth;
      windowHeight.value = document.documentElement.clientHeight;
    });
  });

  return {
    windowWidth,
    windowHeight,
  };
};
