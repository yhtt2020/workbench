import { dateTimeStamp } from "../../../../components/widgets/clock/hooks/clockList";

// 单个文件数据
export const defaultData = {
  useCount: 0, // 使用次数
  lastUseTime: "",
  type: "link", //link ,action ,app
  open:{
    mode:"default",
  },
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
  icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
  list: [],
  // size: "2x2",
  customSize: "2x2",
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
  // 用于数据更新的标记
  _updateFlag: "123",
};
