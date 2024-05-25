const defaultData = {
  visible: false,
  isMaximize: false,
  isFullScreen: false,
  iconType: "select",
  width: "1000px",
  height: "752px",
  openMode: "modal",
};
/**
 * @description: 应用弹窗运行列表
 */
export const runList = [
  {
    name: "ai",
    cname: "AI助手",
    icon: "/img/appLogo/ai.png",
    ...defaultData,
  },
  {
    name: "income",
    cname: "收益中心",
    icon: "/logo/income.svg",
    ...defaultData,
  },
  {
    name: "note",
    cname: "便签",
    // icon: "/logo/note.svg",
    icon: "/img/appLogo/note.png",
    ...defaultData,
  },
];
