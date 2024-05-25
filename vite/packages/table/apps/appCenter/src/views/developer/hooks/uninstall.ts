import { storeToRefs } from "pinia";
import { cardStore as useCardSize } from "../../../../../../store/card";
import { navStore as useNavStore } from "../../../../../../store/nav";
import { useTTAppStore } from "../../../../../ttApp/src/store";
import { useAppCenterStore } from "../../../store";
import { useFreeLayoutStore } from "../../../../../../components/desk/freeLayout/store";
import { message } from "ant-design-vue";

/** 卸载应用 */
export const uninstall = (id: string) => {
  clearStore(id);
  clearDesk(id);
  clearNav(id);
  clearDb(id);
  clearMyApps(id);
};
/** 删除store数据 */
const clearStore = (id: string) => {
  const ttappStore: any = useTTAppStore();
  ttappStore.removeList(id);
  ttappStore.removeData(id);
};
/** 删除桌面数据 */
const clearDesk = (id: string) => {
  const cardStore = useCardSize();
  const { desks }: any = storeToRefs(cardStore);
  const freeLayoutStore = useFreeLayoutStore();
  const { freeLayoutData }: any = storeToRefs(freeLayoutStore);
  // 过滤所有桌面
  desks.value = desks.value.map((desk) => {
    const deskId = desk.id;

    // 过滤当前桌面
    desk.cards = desk.cards.filter((obj) => {
      const customData = obj.customData;
      const customIndex = obj.id;
      // 过滤小组件
      if (obj.name == "TTAppCard" && customData.parentId == id) {
        delete freeLayoutData.value[deskId][customIndex];
        return false;
      }
      // 过滤单图标
      if (obj.name == "myIcons") {
        let res = customData.iconList[0].open;
        if (res.type == "ttapp" || res.value == id) {
          delete freeLayoutData.value[deskId][customIndex];
          return false;
        }
      }
      // 过滤文件夹
      if (obj.name == "folder") {
        customData.list = customData.list.filter((data) => {
          // 过滤ttapp
          if (data.type == "ttapp" && data.value == id) {
            delete freeLayoutData.value[deskId][customIndex];
            return false;
          }
          // 过滤应用卡片
          if (data.type == "card") {
            const currentId = data?.cardData?.customData?.parentId;
            if (currentId === id) {
              delete freeLayoutData.value[deskId][customIndex];
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
/** 删除导航栏数据 */
const clearNav = (id: string) => {
  const navStore = useNavStore();
  const { copyFootNav, sideNavigationList, rightNavigationList } = storeToRefs(navStore);

  // 主要的导航栏删除函数
  const filterNavItem = (items) => items.filter(item => {
    if (item.type === "folder") {
      item.children = item.children.filter(child => filterByType(child, id));
      if (item.children.length === 0) {
        return false; // 当文件夹为空时，删除该文件夹
      }
    }
    return filterByType(item, id);
  });

  // 根据类型和id过滤条目
  const filterByType = (item, id) => {
    if (item.type === "card" || item.type === "ttapp") {
      return item.cardData?.id !== id;
    }
    return true; // 默认保留该项
  };

  // 底部导航栏
  copyFootNav.value = filterNavItem(copyFootNav.value);
  // 左侧导航栏
  sideNavigationList.value = filterNavItem(sideNavigationList.value);
  // 右侧导航栏
  rightNavigationList.value = filterNavItem(rightNavigationList.value);
};

/** 删除我的应用数据 */
const clearMyApps = (id: string) => {
  const appCenterStore = useAppCenterStore();
  const filterApps = (app) =>  app.value !== id;

  // 更新 myApps 和 startMenu 两个属性，去除特定 id 的 ttapp 类型应用
  appCenterStore.myApps = appCenterStore.myApps.filter(filterApps);
  appCenterStore.startMenu = appCenterStore.startMenu.filter(filterApps);
}


/** 删除db数据 */
export const clearDb = async (id: string) => {
  const res: any = await new Promise((reject) => {
    tsbApi.ttapp.uninstall(id, (data) => {
      reject(data);
    });
  });
  if (res.code !== 200) {
    message.error("卸载失败");
    return;
  }
  message.success("卸载成功");
};

