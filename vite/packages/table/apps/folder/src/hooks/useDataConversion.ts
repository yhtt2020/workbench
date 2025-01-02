import { getHostAddress } from './../../../../components/widgets/myIcons/edit/hooks/getHostAddress';
import { nanoid } from "nanoid";
import _ from "lodash";
import { defaultData } from "../../../../apps/folder/src/components/options";
export const useIconConversionFile = (data) => {
  const file = {
    ...defaultData,
    id: nanoid(6),
    type: data.open.type,
    value: data.open.value,
    icon: data.src,
    name: data.titleValue,
    isName: data.isTitle,
    bg: data.backgroundColor,
    isBg: data.isBackground,
    radius: data.radius,
    isRadius: data.isRadius,
    iconState: data.imgState,
    iconShape: data.imgShape,
  };
  return file;
};

// 由于直接添加图标，size返回的是‘1x1‘，会导致无法读取到图标大小导致卡死，需要进行判断
const isTrueSize = (data) => {
  return !data.includes('x')
}

export const useFileConversionIcon = (data) => {
  //桌面转换图标
  const icon = {
    model: "file",
    size: (data.size && isTrueSize(data.size)) ? data.size ||  "mini" : "mini",
    type:data.type,
    actions:data.actions,
    open: {
      ...data.open,
      type: data.type,
      value: data.value,
    },
    titleValue: data.name,
    isTitle: data.isName,
    src: data.icon,
    isRadius: data.isRadius,
    radius: data.radius,
    imgState: data.iconState,
    imgShape: data.iconShape,
    isBackground: data.isBg,
    backgroundColor: data.bg,
    backgroundIndex: 0,
  };

  return icon;
};

// 文件夹图标转为导航栏图标格式
export const useIconConversionNav = (data) => {
  const icon = {
    icon: data.icon,
    name: data.name,
    value: data.value,
    mode: data.mode,
    isBg: data.isBg,
    bg: data.bg,
    type: data.type,
    id: data.id || nanoid(6),
    cardData: data.cardData,
  };
  return icon;
};

// 单图标组件转为导航栏图标格式
export const useFileConversionNav = (data) => {
  const icon = {
    icon: data.src,
    name: data.titleValue,
    value: data.open.value,
    mode: "app",
    isBg: data.isBackground,
    bg: data.backgroundColor,
    type: data.open.type,
    id: nanoid(6),
    cardData: data.cardData,
  };
  return icon;
};

// 桌面图标转为导航栏图标
export const useDeskConversionNav = (icon, name, item) => {
  const file = {
    icon: icon,
    name,
    type: "tableApp",
    bg: "",
    isBg: false,
    mode: "app",
    value: item,
    id: nanoid(6),
  };
  return file;
};
export const mergeData = (data) => {
  // console.log((data?.renewTime == defaultIconData.renewTime ? data : ''),'===========<<<<<<<<<<')
  if (data?.renewTime == defaultIconData.renewTime) return data;
  const target= _.merge({}, defaultIconData, data);
  return target;
};
// 默认图标格式
export const defaultIconData = {
  renewTime: 20240125, // 图标更新时间
  id: "", // 图标id
  icon: "", // 显示的图标数据
  name: "", // 显示的图标名称
  isName: true, // 是否显示图标名称
  value: "", // 图标链接
  /**
   * 当前mode
   * app 所有应用
   * link 网址链接
   */
  mode: "app",
  attributeEdit: true,
  /**
   * 图标类型
   * systemApp 系统应用
   * coolApp 酷应用
   * folder 文件夹
   * lightApp 轻应用
   * tableApp 桌面应用
   * default 系统默认浏览器
   * inner 内置浏览器
   * xt 想天浏览器
   */
  type: "",
  bg: "", // 背景颜色
  isBg: false, // 是否使用背景色
  radius: 0, // 图标的圆角
  isRadius: true, // 是否使用图标的圆角
  useCount: 0, // 使用次数
  lastUseTime: "", // 上次使用时间
  iconState: "cover", // 图标状态
  iconShape: "square", // 图标形状 长方形或正方形
  // 单图标展示的大小
  size: "1x1",
  // 拖拽链接展示图标
  linkIcon:false,
  summary:'',   // 酷应用，轻应用，网址导航等图标的简介
  default:{},   // 数据用于重置图标
};

// 桌面链接转为导航栏图标
export const useLinkConversionNav = (link)=>{
  const icon = {
    name:link.name || '链接',
    icon:link.icon !== null ? link.icon : '	https://a.apps.vip/icons/iconSelect/emoji/globe-showing-asia-australia.svg',
    value: link.value,
    mode:'link',
    isBg:false,
    bg:'',
    id:nanoid(6),
    linkIcon:false, //link.icon === null ? true : false
  }
  return icon
}
