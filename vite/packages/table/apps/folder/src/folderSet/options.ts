export const nameOptions = [
  {
    type: "info",
    title: "图标名称",
    info: "修改当前应用图标名称",
    icon: "fluent:arrow-clockwise-16-regular",
    iconCb: "titleIconCb",
  },
  {
    type: "input",
    inputKey: "name",
  },
];
export const filesOptions = [
  {
    type: "slot",
    slot: "model",
  },
  {
    type: "tab",
    list: [
      {
        name: "自定义",
        value: "custom",
      },
      {
        name: "桌面整理",
        value: "arrange",
      },
      {
        name: "文件夹观察",
        value: "observe",
      },
    ],
    tabKey: "model",
  },
  {
    type: "children",
    flag: "observe",
    flagKey: "model",
    children: [
      {
        type: "slot",
        slot: "custom",
      },
    ],
  },
  // {
  //   type: "children",
  //   flag: ["observe", "arrange"],
  //   flagKey: "model",
  //   children: [],
  // },
  {
    type: "info",
    title: "图标整理规则",
    info: "选择需要整理到分组的图标类型。",
  },
  {
    type: "multiple",
    multipleKey: "rules",
    border: true,
    list: [
      {
        name: "应用程序",
        value: "app",
      },
      {
        name: "文档",
        value: "docx",
      },
      {
        name: "文件夹",
        value: "folder",
      },
    ],
  },
  {
    type: "info",
    title: "图标排序规则",
    info: "选择图标排序方式，不设置排序规则的情况下可自由拖拽排列。但是不拖出分组到桌面或其他位置。",
  },
  {
    type: "select",
    selectKey: "sort",
    list: [
      {
        name: "无",
        value: "free",
      },
      {
        name: "最近使用",
        value: "lastUseTime",
      },
      {
        name: "使用最多",
        value: "useCount",
      },
    ],
  },
];
