export const attributeOptions = [
  // {
  //   type: "info",
  //   title: "图标名称",
  //   info: "修改当前应用图标名称",
  // },
  // {
  //   type: "input",
  //   inputKey: "titleValue",
  //   border: true,
  // },
  // {
  //   type: "slot",
  //   slot: "title",
  //   border: true,
  // },
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
    type: "input",
    inputKey: "value",
  },
  {
    type: "children",
    flag: "link",
    flagKey: "mode",
    children: [
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
            name: "系统默认浏览器",
            value: "default",
          },
          {
            name: "内置浏览器",
            value: "internal",
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
    // switchKey: "isName", 新版
    switchKey: "isTitle",
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
    tabKey: "imgState",
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
  //   type: edit.value.open.type,
  //   value: edit.value.open.value,
  //   src: edit.value.src,

  {
    type: "info",
    title: "图标形状",
    info: "选择图标形状",
  },
  {
    type: "tab",
    tabKey: "imgShape",
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
  {
    type: "info",
    title: "图标大小",
    info: "选择图标大小",
  },
  {
    type: "tab",
    tabKey: "size",
    list: [
      {
        value: "mini",
        name: "1*1",
      },
      {
        value: "mini1",
        name: "2*1",
      },
      {
        value: "small",
        name: "2*2",
      },
      {
        value: "default",
        name: "2*4",
      },
      {
        value: "long",
        name: "4*2",
      },
      {
        value: "big",
        name: "4*4",
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
    switchKey: "isBackground",
  },
  {
    type: "children",
    flag: true,
    flagKey: "isBackground",

    children: [
      {
        type: "color",
        colorKey: "backgroundColor",
      },
    ],
  },
];
