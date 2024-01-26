import { getHostAddress } from './../../../../components/widgets/myIcons/edit/hooks/getHostAddress';
import { nanoid } from "nanoid";

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

export const useFileConversionIcon = (data) => {
  const icon = {
    model: "file",
    size: "mini",
    open: {
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
    id: data.iconIndex || nanoid(6),
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

export const defaultIconData = {
  renewTime: "",
  id: "", // 图标id
  icon: "", // 显示的图标数据
  name: "", // 显示的图标名称
  isName: true, // 是否显示图标名称
  value: "",
  /**
   * 当前mode
   * app 所有应用
   * link 网址链接
   */
  mode: "app",
  attributeEdit: true,
  /**
   * 当前
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
};

// 桌面链接转为导航栏图标
export const useLinkConversionNav = (link)=>{
  const file = {
    name:link.name || '链接',
    icon:link.icon !== null ? link.icon : 'fluent-emoji:globe-with-meridians',
    type:'default',
    value: link.value,
    mode:'link',
    isBg:false,
    bg:'var(--secondary-transp-bg)',
    id:nanoid(6),
    linkIcon:link.icon === null ? true : false,
  }
  return file
}
