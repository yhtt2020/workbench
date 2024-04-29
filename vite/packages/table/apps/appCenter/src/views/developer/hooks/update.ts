import { ttappConversionIcon } from "./add";
import { validate } from "./validate";
import { cardStore as useCardSize } from "../../../../../../store/card";
import { storeToRefs } from "pinia";
import { navStore } from "../../../../../../store/nav";
export const updateIcon = (ttappId: string) => {
  let ttappData = validate(ttappId);
  ttappData = ttappConversionIcon(ttappData);
  return ttappData;
};

export const update = (id: string) => {
  updateDesk(id);
  updateNav(id);
};
/** 更新桌面数据 */
export const updateDesk = (id: string) => {
  const cardStore = useCardSize();
  const { desks }: any = storeToRefs(cardStore);
  // 过滤所有桌面
  desks.value = desks.value.map((desk) => {
    // 过滤当前桌面
    desk.cards = desk.cards.map((obj) => {
      const customData = obj.customData;
      // 卡片会有init方法 通过全局事件处理掉了
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
          console.log("data :>> ", data);
          // 过滤ttapp
          if (data.type == "ttapp" && data.value == id) {
            let ttappData = validate(id);
            data.icon = ttappData._logo;
            data.name = ttappData.name;
            return data;
          }
          // 过滤应用卡片
          if (data.type == "card") {

            const currentId = data?.cardData?.id

            if (currentId !== id) return data;
            let ttappData = validate(id);
            //
            data.icon = ttappData._logo;
            data.name = ttappData.name;
          }
          return data;
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
  const { copyFootNav, sideNavigationList, rightNavigationList }: any =
    storeToRefs(nav);

  // 查找各个导航列表中的对应元素
  copyFootNav.value = copyFootNav.value.map((item: any) => {
    const data = validate(id);
    if (item.type === "ttapp" && item.cardData?.id === data.id) {
      item.name = data.name;
      item.icon = data._logo;
      return item;
    }
    if (item.type == "card") {
      if (item.type === "card" && item.cardData?.id === id) {
        const data = validate(id);
        item.name = data.name;
        item.icon = data._logo;
        return item;
      }
    }
    // // 过滤文件夹

    if (item.type == "folder") {
      item.children = item.children.map((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          let ttappData = validate(id);
          data.icon = ttappData._logo;
          data.name = ttappData.name;
          return data;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.id;
          if (currentId !== id) return data;
          let ttappData = validate(id);
          data.icon = ttappData._logo;
          data.name = ttappData.name;
        }
        return data;
      });
      return item;
    }
    return item;
  });

  sideNavigationList.value = sideNavigationList.value.map((item) => {
    if (item.type === "ttapp" && item.cardData?.id === id) {
      const data = validate(id);
      item.name = data.name;
      item.icon = data._logo;
      return item;
    }
    if (item.type == "card") {
      if (item.type === "card" && item.cardData?.id === id) {
        const data = validate(id);
        item.name = data.name;
        item.icon = data._logo;
        return item;
      }
    }
    // // 过滤文件夹

    if (item.type == "folder") {
      item.children = item.children.map((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          let ttappData = validate(id);
          data.icon = ttappData._logo;
          data.name = ttappData.name;
          return data;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.id;
          if (currentId !== id) return data;
          let ttappData = validate(id);

          data.icon = ttappData._logo;
          data.name = ttappData.name;
        }
        return data;
      });
      return item;
    }
    return item;
  });
  rightNavigationList.value = rightNavigationList.value.map((item: any) => {
    if (item.type === "ttapp" && item.cardData?.id === id) {
      const data = validate(id);
      item.name = data.name;
      item.icon = data._logo;
      return item;
    }
    if (item.type == "card") {
      if (item.type === "card" && item.cardData?.id === id) {
        const data = validate(id);
        item.name = data.name;
        item.icon = data._logo;
        return item;
      }
    }
    // // 过滤文件夹

    if (item.type == "folder") {
      item.children = item.children.map((data) => {
        // 过滤ttapp
        if (data.type == "ttapp" && data.value == id) {
          let ttappData = validate(id);
          data.icon = ttappData._logo;
          data.name = ttappData.name;
          return data;
        }
        // 过滤应用卡片
        if (data.type == "card") {
          const currentId = data?.cardData?.id;
          if (currentId !== id) return data;
          let ttappData = validate(id);

          data.icon = ttappData._logo;
          data.name = ttappData.name;
        }
        return data;
      });
      return item;
    }
    return item;
  });
};
