export const getBarHeight = () => {
  // 获取底部菜单
  const bottomBar = document.getElementsByClassName("xt-main-bottom-bar")[0];
  if (bottomBar) {
    return bottomBar.clientHeight;
  }
};
