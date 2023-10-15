import { onMounted, onBeforeUnmount, ref } from "vue";
const useMenus = (containerRef: any, start) => {
  // 是否显示菜单 和 菜单坐标
  const show = ref(false);
  const x = ref(0);
  const y = ref(0);

  // 展开显示
  const handleContextMenu = (e: any) => {
    if (!start.value) {
      return;
    }
    e.preventDefault(); // 阻止默认动作
    e.stopPropagation(); // 阻止事件冒泡
    show.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
  };
  // 关闭显示
  const closeMenus = () => {
    show.value = false;
  };
  onMounted(() => {
    const div = containerRef.value;
    div.addEventListener("contextmenu", handleContextMenu, { capture: true }); // 第三个参数是为了捕获阶段处理，预防阻止事件冒泡无法触发
    window.addEventListener("click", closeMenus, { capture: true });
    window.addEventListener("contextmenu", closeMenus, { capture: true });
  });
  onBeforeUnmount(() => {
    const div = containerRef.value;
    div.removeEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });
    window.addEventListener("click", closeMenus, { capture: true });
    window.addEventListener("contextmenu", closeMenus, { capture: true });
  });
  return {
    show,
    x,
    y,
  };
};
export default useMenus;
