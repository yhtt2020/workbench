import { nanoid } from "nanoid";

import { defaultData } from "../components/options";
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
export const useIconConversionNav = (data)=>{
  const icon = {
    icon:data.icon,
    name:data.name,
    value:data.value,
    mode:data.mode,
    isBg:data.isBg,
    bg:data.bg,
    type:data.type,
    id:data.id || nanoid(6),
  }
  return icon;
}

// 单图标组件转为导航栏图标格式
export const useFileConversionNav = (data)=>{
  const icon = {
    icon:data.src,
    name:data.titleValue,
    value:data.open.value,
    mode:'app',
    isBg:data.isBackground,
    bg:data.backgroundColor,
    type:data.open.type,
    id:data.iconIndex || nanoid(6),
  }
  return icon;
}

// 桌面图标转为导航栏图标
export const useDeskConversionNav = (icon,name,item)=>{
  const file = {
    icon:icon,
    name,
    type:'tableApp',
    bg:'',
    isBg:false,
    mode:'app',
    value:item,
    id:nanoid(6)
  }
  return file
}