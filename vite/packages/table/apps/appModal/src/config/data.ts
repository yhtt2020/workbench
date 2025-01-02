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
    icon: "/logo/ai.svg",
    ...defaultData,
  },
  {
    name: "income",
    cname: "收益中心",
    icon: "/logo/income.svg",
    ...defaultData,
  },
  {
    name: "siteNav",
    cname: "网址导航",
    icon: "/logo/nav.svg",
    ...defaultData,
  },
  {
    name: "calendar",
    cname: "日历",
    icon: "/logo/calendar.svg",
    ...defaultData,
  },
  {
    name: "note",
    cname: "便签",
    // icon: "/logo/note.svg",
    icon: "/logo/memorandum.svg",
    ...defaultData,
  },
  {
    name:"galleryModalApp",
    cname:"壁纸",
    icon:"/logo/wallpaper.svg",
    ...defaultData,
  }
];
