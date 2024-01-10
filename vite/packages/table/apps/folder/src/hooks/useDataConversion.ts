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
