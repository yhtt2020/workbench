import { onMounted, onBeforeUnmount, ref } from "vue";
const useMenuEvent = (
  container: any,
  model,
  start,
  handleCloseMenu,
  bubble
) => {
  const show = ref(false);
  const menuX = ref(0);
  const menuY = ref(0);

  const setup = (e) => {
    console.log("bubble.value.value:>> ", !bubble.value);
    if (!bubble.value) {
      console.log("我应该执行了啊 :>> ");
      e.preventDefault(); // 阻止默认动作
      e.stopPropagation(); // 阻止事件冒泡
    }

    menuX.value = e.clientX;
    menuY.value = e.clientY;
    show.value = true;
  };

  // 右键
  const handleContextMenu = (e: any) => {
    if (!start.value || model.value != "contextmenu") return;
    setup(e);
  };

  // 左键
  const handleClickMenu = (e: any) => {
    if (!start.value || model.value != "click") return;
    setup(e);
  };
  // 关闭显示
  const closeMenu = () => {
    show.value = false;
    handleCloseMenu();
  };
  onMounted(() => {
    const element: any = container.value;
    element.addEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });
    element.addEventListener("click", handleClickMenu, { capture: true });
    window.addEventListener("click", closeMenu, { capture: true });
    window.addEventListener("contextmenu", closeMenu, { capture: true });
  });
  onBeforeUnmount(() => {
    const element: any = container.value;
    element.removeEventListener("contextmenu", handleContextMenu, {
      capture: true,
    });
    element.removeEventListener("click", handleClickMenu, {
      capture: true,
    });
    window.addEventListener("click", closeMenu, { capture: true });
    window.addEventListener("contextmenu", closeMenu, { capture: true });
  });
  return {
    show,
    menuX,
    menuY,
  };
};
export default useMenuEvent;
