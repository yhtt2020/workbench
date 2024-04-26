import { storeToRefs } from "pinia";
import { navStore } from "../../../../../../store/nav";
import { validate } from "./validate";

import {
  defaultData,
  useFileConversionIcon,
  useFileConversionNav,
} from "../../../../../../ui/hooks/useDataConversion";
import { useAddCard } from "../../../../../../hooks";
export const addNav = (data: any, position?: string) => {
  const nav = navStore();
  const {
    navigationToggle,
    copyFootNav,
    sideNavigationList,
    rightNavigationList,
  }: any = storeToRefs(nav);

  const iconData = conversionIcon(data);
  // console.log("iconData :>> ", iconData);
  const navData = useFileConversionNav(iconData);

  // console.log("navData :>> ", navData,position);
  // 有指定位置
  if (position != undefined) {
    // 添加到底部导航栏
    if (position == "bottom") {
      copyFootNav.value.push(navData);
    }
    // 添加到左侧导航栏
    else if (position == "left") {
      sideNavigationList.value.push(navData);
    }
    // 添加到右侧导航栏
    else if (position == "right") {
      rightNavigationList.value.push(navData);
    }
  }
  // 没有指定位置
  else {
    // 添加到底部导航栏
    if (navigationToggle.value[2]) {
      copyFootNav.value.push(navData);
    }
    // 添加到左侧导航栏
    else if (navigationToggle.value[0]) {
      sideNavigationList.value.push(navData);
    }
    // 添加到右侧导航栏
    else if (navigationToggle.value[1]) {
      rightNavigationList.value.push(navData);
    }
  }
};
const conversionIcon = (data: any) => {
  return useFileConversionIcon({
    ...defaultData,
    id: data.id,
    value: data.id,
    name: data.name,
    icon: data._logo,
    type: "ttapp",
  });
};
export const addIcon = (data: any) => {
  data = conversionIcon(data);
  useAddCard({
    name: "myIcons",
    data: {
      iconList: [data],
    },
  });
};
