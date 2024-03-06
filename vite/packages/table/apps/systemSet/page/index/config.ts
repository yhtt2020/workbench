type SetItem = {
  name: string;
  icon: string;
  component: string;
};
export const navList = <SetItem[]>[
  {
    name: "通用设置",
    icon: "fluent:settings-16-regular",
    component: "Common",
  },

  { name: "主题外观", icon: "fluent:color-24-regular", component: "Theme" },
  {
    name: "桌面设置",
    icon: "fluent:desktop-16-regular",
    component: "Desk",
  },
  {
    name: "设备设置",
    icon: "fluent:slide-settings-24-regular",
    component: "device",
  },

  {
    name: "分屏设置",
    icon: "fluent:window-multiple-16-filled",
    component: "Screen",
  },
  {
    name: "弹幕设置",
    icon: "fluent:code-text-16-regular",
    component: "barrage",
  },
  { name: "按键设置", icon: "fluent:keyboard-16-regular", component: "key" },
  { name: "开发模式", icon: "fluent:code-16-regular", component: "develop" },
];
