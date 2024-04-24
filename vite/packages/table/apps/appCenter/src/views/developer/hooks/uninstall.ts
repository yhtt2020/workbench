import { storeToRefs } from "pinia";
import { cardStore as useCardSize } from "../../../../../../store/card";
import { navStore as useNavStore } from "../../../../../../store/nav";

export const uninstall = (id: string) => {
  clearDesk(id);
  clearNav(id);
};
const clearDesk = (id: string) => {
  const cardStore = useCardSize();
  const { desks }: any = storeToRefs(cardStore);
  // 过滤所有桌面
  desks.value = desks.value.map((desk) => {
    // 过滤当前桌面
    desk.cards = desk.cards.filter((obj) => {
      const customData = obj.customData;
      // 过滤小组件
      if (obj.name == "TTAppCard" && customData.parentId == id) {
        return false;
      }
      // 过滤单图标
      if (obj.name == "myIcons") {
        let res = customData.iconList[0].open;
        if (res.type == "ttapp" || res.value == id) {
          return false;
        }
      }
      // 过滤文件夹
      if (obj.name == "folder") {
        customData.list = customData.list.filter((data) => {
          // 过滤ttapp
          if (data.type == "ttapp" && data.value == id) {
            return false;
          }
          // 过滤应用卡片
          if (data.type == "card") {
            const currentId = data?.cardData?.customData?.parentId;
            if (currentId === id) {
              return false;
            }
          }
          return true;
        });
      }
      return true;
    });
    return desk;
  });
};
const clearNav = (id: string) => {
  // 获取导航数据
  const navStore = useNavStore();
  const { copyFootNav, sideNavigationList, rightNavigationList }: any =
    storeToRefs(navStore);

  // 过滤底部导航栏
  copyFootNav.value = copyFootNav.value.filter((data: any) => {
    // 过滤应用卡片
    if (data.type == "card") {
      const currentId = data?.cardData?.customData?.parentId;
      if (currentId === id) {
        return false;
      }
    }
    // 过滤单图标
    if (data.type == "ttapp" && data.value == id) {
      return false;
    }
    // 过滤文件夹
    if (data.type == "folder") {
      data.children = data.children.filter((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          return false;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.customData?.parentId;
          if (currentId === id) {
            return false;
          }
        }
        return true;
      });
    }
    return true;
  });
  // 过滤侧边导航栏
  sideNavigationList.value = sideNavigationList.value.filter((data: any) => {
    // 过滤应用卡片
    if (data.type == "card") {
      const currentId = data?.cardData?.customData?.parentId;
      if (currentId === id) {
        return false;
      }
    }
    // 过滤单图标
    if (data.type == "ttapp" && data.value == id) {
      return false;
    }
    // 过滤文件夹
    if (data.type == "folder") {
      data.children = data.children.filter((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          return false;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.customData?.parentId;
          if (currentId === id) {
            return false;
          }
        }
        return true;
      });
    }
    return true;
  });
  // 过滤右边导航栏
  rightNavigationList.value = rightNavigationList.value.filter((data: any) => {
    // 过滤应用卡片
    if (data.type == "card") {
      const currentId = data?.cardData?.customData?.parentId;
      if (currentId === id) {
        return false;
      }
    }
    // 过滤单图标
    if (data.type == "ttapp" && data.value == id) {
      return false;
    }
    // 过滤文件夹
    if (data.type == "folder") {
      data.children = data.children.filter((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          return false;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.customData?.parentId;
          if (currentId === id) {
            return false;
          }
        }
        return true;
      });
    }
    return true;
  });
};
