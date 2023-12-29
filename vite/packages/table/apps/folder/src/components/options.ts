// 单个文件数据
export const defaultData = {
  useCount: 0, // 使用次数
  lastUseTime: "",
  mode: "app",
  type: "",
  value: "",
  icon: "",
  iconState: "cover",
  iconShape: "square",
  name: "",
  isName: true,
  bg: "",
  isBg: false,
  radius: 5,
  isRadius: true,
};
export const defaultFolderData = {
  name: "文件夹",
  icon: "",
  list: [],
  size: "2x2",
  // 文件锁 开启后无法拖出
  lock: true,
  // 布局样式
  layout: "rows", // columns
  // 排序规则
  sort: "free",
  // 文件夹模式
  model: "custom",
  // 分类规则
  rules: [],
};
