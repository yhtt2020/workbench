import { storeToRefs } from "pinia";
import { navStore } from "../../../../../../store/nav";

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

  const iconData = ttappConversionIcon(data);
  // console.log("iconData :>> ", iconData,data);
  let navData = useFileConversionNav(iconData);
  // 添加第三方卡片id做标识
  navData.cardData = {
    id: data.id,
  };
  console.log("   copyFootNav.value :>> ", copyFootNav.value);
  // 有指定位置
  if (position != undefined) {
    // 添加到底部导航栏
    if (position == "bottom") {
      copyFootNav.value.unshift(navData);
    }
    // 添加到左侧导航栏
    else if (position == "left") {
      sideNavigationList.value.unshift(navData);
    }
    // 添加到右侧导航栏
    else if (position == "right") {
      rightNavigationList.value.unshift(navData);
    }
  }
  // 没有指定位置
  else {
    // 添加到底部导航栏
    if (navigationToggle.value[2]) {
      copyFootNav.value.unshift(navData);
    }
    // 添加到左侧导航栏
    else if (navigationToggle.value[0]) {
      sideNavigationList.value.unshift(navData);
    }
    // 添加到右侧导航栏
    else if (navigationToggle.value[1]) {
      rightNavigationList.value.unshift(navData);
    }
  }
};
export const ttappConversionIcon = (data: any) => {
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
  data = ttappConversionIcon(data);
  useAddCard({
    name: "myIcons",
    data: {
      iconList: [data],
    },
  });
};
