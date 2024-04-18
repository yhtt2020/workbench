import "./theme.css";
export const useTheme = (win: any = window) => {
  // 判断是否有无界
  if (!win?.$wujie) return;
  // 样式切换监听
  win.$wujie.bus.$on("setTheme", (themeName: string) => {
    win.document.documentElement.classList.remove(themeName);
    win.document.documentElement.classList.add(themeName);
  });
  win.$wujie.bus.$on("setThemeColor", (color1: string, color2: string) => {
    win.document.documentElement.style.cssText += `--tt-theme-color:${color1} !important;`;
    win.document.documentElement.style.cssText += `--tt-theme-secondary-color:${color2} !important;`;
  });
  // 样式初始化
  win.$wujie?.bus.$emit("getTheme");
  win.$wujie?.bus.$emit("getThemeColor");
};
