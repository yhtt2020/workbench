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
  // {
  //   type: "tab",
  //   tabKey: "mode",
  //   list: [
  //     {
  //       name: "网站链接",
  //       value: "link",
  //     },
  //     {
  //       name: "系统程序或文件",
  //       value: "app",
  //     },
  //   ],
  // },
  {
    type: "slot",
    slot: "mode",
    border: true,
  },
  {
    type: "children",
    flag: "link",
    flagKey: "mode",
    children: [
      {
        type: "input",
        inputKey: "value",
      },
      {
        type: "info",
        title: "打开方式",
        info: "选择链接打开方式。",
      },
      {
        type: "drop",
        dropKey: "type",
        list: [
          {
            icon: "mingcute:windows-line",
            name: "系统默认浏览器",
            value: "default",
            info: "使用Windows系统默认浏览器打开",
          },
          {
            icon: "fluent:globe-16-regular",
            name: "工作台内置浏览器",
            value: "internal",
            info: "在工作台内直接打开，不会跳转到外部应用软件。",
          },
          {
            icon: "fluent:globe-16-regular",
            name: "想天浏览器",
            value: "thinksky",
            info: "使用想天浏览器打开",
          },
          {
            icon: "fluent:phone-16-regular",
            name: "手机模式",
            value: "mob",
            info: "使用想天浏览器内置的「手机模式」打开，可以模拟手机端的浏览状态。",
          },
        ],
      },
    ],
  },
  {
    type: "children",
    flag: "action",
    flagKey: "mode",
    children: [
      {
        type: "info",
        title: "快捷指令",
        info: "在弹出窗内选择合适的指令",
      },
      {
        type: "setAction",
        actionKey: "actions",
      },
    ],
  },
  {
    type: "children",
    flag:'app',
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
    title: "填充模式",
    info: "图标填充模式",
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
        name: "1x1",
      },
      {
        value: "mini1",
        name: "2x1",
      },
      {
        value: "small",
        name: "2x2",
      },
      {
        value: "default",
        name: "2x4",
      },
      {
        value: "long",
        name: "4x2",
      },
      {
        value: "big",
        name: "4x4",
      },
    ],
  },
];

// 图标尺寸转换
export const sizeTransform = {
  mini: "1x1",
  mini1: "2x1",
  small: "2x2",
  default: "2x4",
  long: "4x2",
  big: "4x4",
};

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
