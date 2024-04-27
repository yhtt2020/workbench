import { ttappConversionIcon } from "./add";
import { validate } from "./validate";
import { cardStore as useCardSize } from "../../../../../../store/card";
import { storeToRefs } from "pinia";
import { navStore } from "../../../../../../store/nav";
import { useTTAppStore } from "../../../../../ttApp/src/store";
export const updateIcon = (ttappId: string) => {
  let ttappData = validate(ttappId);
  ttappData = ttappConversionIcon(ttappData);
  return ttappData;
};
/** 更新桌面数据 */
export const update = (id: string) => {
  const cardStore = useCardSize();
  const { desks }: any = storeToRefs(cardStore);
  // 过滤所有桌面
  desks.value = desks.value.map((desk) => {
    // 过滤当前桌面
    desk.cards = desk.cards.map((obj) => {
      const customData = obj.customData;

      // 过滤单图标
      if (obj.name == "myIcons") {
        let res = customData.iconList[0].open;
        if (res.type == "ttapp" || res.value == id) {
          customData.iconList[0] = updateIcon(res.value);
          return obj;
        }
      }
      // // 过滤文件夹
      if (obj.name == "folder") {
        customData.list = customData.list.map((data) => {
          // 过滤ttapp
          if (data.type == "ttapp" && data.value == id) {
            let ttappData = validate(id);
            data.icon = ttappData._logo;
            data.name = ttappData.name;
            return data;
          }
          return data;
          //     // 过滤应用卡片
          //     if (data.type == "card") {
          //       const currentId = data?.cardData?.customData?.parentId;
          //       if (currentId === id) {
          //         return false;
          //       }
          //     }
          //     return true;
        });
      }
      return obj;
    });
    return desk;
  });
};

// 更新导航栏图标
export const updateNav = (id) => {
  const nav = navStore();
  const ttApp: any = useTTAppStore();
  // 更新导航元素的辅助函数
  const updateNavItem = (navItem) => {
    if (navItem) {
      const item = ttApp.select(id);
      navItem.name = item.name;
      navItem.icon = item._logo;
    }
  };

  // 查找各个导航列表中的对应元素
  const footIcon = nav.copyFootNav.find(
    (item: any) => item.cardData?.id === id
  );
  const leftIcon = nav.sideNavigationList.find(
    (item: any) => item.cardData?.id === id
  );
  const rightIcon = nav.rightNavigationList.find(
    (item: any) => item.cardData?.id === id
  );

  // 更新导航元素
  updateNavItem(footIcon);
  updateNavItem(leftIcon);
  updateNavItem(rightIcon);
};
