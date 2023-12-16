export const attributeOptions = [
  {
    type: "info",
    title: "图标名称",
    info: "修改当前应用图标名称",
  },
  {
    type: "input",
    inputKey: "name",
    border: true,
  },
  {
    type: "info",
    title: "图标链接",
    info: "自定义图标打开链接，支持网站地址或本地文件快捷方式类型。",
  },
  {
    type: "tab",
    tabKey: "mode",
    list: [
      {
        name: "网站链接",
        value: "link",
      },
      {
        name: "系统程序或文件",
        value: "app",
      },
    ],
  },
  {
    type: "children",
    flag: "link",
    flagKey: "mode",
    children: [
      {
        type: "input",
        border: true,
        inputKey: "value",
      },
      {
        type: "info",
        title: "打开方式",
        info: "选择链接打开方式。",
      },
      {
        type: "tab",
        tabKey: "type",
        list: [
          {
            name: "内置浏览器",
            value: "internal",
          },
          {
            name: "系统默认浏览器",
            value: "default",
          },
          {
            name: "想天浏览器",
            value: "thinksky",
          },
        ],
      },
    ],
  },
  {
    type: "children",
    flag: "app",
    flagKey: "mode",
    children: [
      {
        type: "slot",
        slot: "custom",
      },
    ],
  },
];
export const appearanceNameOptions = [
  {
    type: "info",
    title: "显示图标名称",
    info: "在图标下方显示自定义名称。",
    isSwitch: true,
    switchKey: "isName",
  },
];
export const appearanceOptions = [
  {
    type: "info",
    title: "图标圆角",
  },
  {
    type: "slider",
    sliderKey: "radius",
  },
  {
    type: "info",
    title: "图标形状",
    info: "选择图标形状",
  },
  {
    type: "tab",
    tabKey: "iconState",
    border: true,
    list: [
      {
        value: "cover",
        name: "覆盖",
      },
      {
        value: "fill",
        name: "填充",
      },
      {
        value: "scale-down",
        name: "缩小",
      },
      {
        value: "contain",
        name: "包含",
      },
    ],
  },
  {
    type: "info",
    title: "图标形状",
    info: "选择图标形状",
  },
  {
    type: "tab",
    tabKey: "iconShape",
    list: [
      {
        value: "square",
        name: "方形",
      },
      {
        value: "rectangle",
        name: "长方形",
      },
    ],
  },
];

export const appearanceColorOptions = [
  {
    type: "info",
    title: "自定义图标背景色",
    info: "默认使用通用设置，不支持已经上传自定义图片的图标。",
    isSwitch: true,
    switchKey: "isBg",
  },
  {
    type: "children",
    flag: true,
    flagKey: "isBg",

    children: [
      {
        type: "color",
        colorKey: "bg",
      },
    ],
  },
];
