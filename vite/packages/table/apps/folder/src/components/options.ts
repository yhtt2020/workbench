import { dateTimeStamp } from '../../../../components/widgets/clock/hooks/clockList';

// 单个文件数据
export const defaultData = {
  useCount: 0, // 使用次数
  lastUseTime: "",

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
};

// 时钟组件默认customData数据
export const defaultClockData = {
  backgroundFrame:true,
  clockId:"clock4",
  imgUrl:"https://a.apps.vip/icons/defaultBackground.jpg",
  blurs:3,
  bgZoom:100,
  zoom:1.5,
  customSize:"2x2",
  font:"font-family: '优设标题黑' !important;",
  fontColor:"#FFFFFF",
  enableSecond:false,
  currentStatus:"font",
  currentZoom:110,
  name: dateTimeStamp(Date.now()),
}