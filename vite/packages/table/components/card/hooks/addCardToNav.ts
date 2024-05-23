import { storeToRefs } from "pinia";
import { navStore } from "../../../store/nav";
import { computed } from "vue";
import { message } from "ant-design-vue";

interface ListItem {
    id: string;
    type: string;
}

/**
 * 导航栏相关信息和函数
 * @state {Boolean} state 导航栏是否显示
 * @list {Array} list 导航栏数据
 * @tip {String} tip 导航栏提示
 * @addFn {Function} addFn 添加到导航栏的函数
 * @open {Function} open 打开导航栏
 * @otherList {Array} otherList 其他两个导航栏中存在的数据
 * @returns {Object}
 */
export const navObj = computed(() => {
  const useNavStore = navStore();
  const {
    copyFootNav,
    sideNavigationList,
    rightNavigationList,
    navigationToggle,
  } = storeToRefs(useNavStore);

  return {
    foot: {
      state: navigationToggle.value[2],
      list: copyFootNav.value,
      tip: "主导航栏",
      addFn: (data: any) => {
        copyFootNav.value.unshift(data);
      },
      open: () => {
        navigationToggle.value[2] = true;
      },
      otherList: () => {
        let left = navigationToggle.value[0] ? sideNavigationList.value : [];
        let right = navigationToggle.value[1] ? rightNavigationList.value : [];
        return [...left, ...right];
      },
    },
    left: {
      state: navigationToggle.value[0],
      list: sideNavigationList.value,
      tip: "左侧导航栏",
      addFn: (data: any) => {
        sideNavigationList.value.unshift(data);
      },
      open: () => {
        navigationToggle.value[0] = true;
      },
      otherList: () => {
        let foot = navigationToggle.value[2] ? copyFootNav.value : [];
        let right = navigationToggle.value[1] ? rightNavigationList.value : [];
        return [...foot, ...right];
      },
    },
    right: {
      state: navigationToggle.value[1],
      list: rightNavigationList.value,
      tip: "右侧导航栏",
      addFn: (data: any) => {
        rightNavigationList.value.unshift(data);
      },
      open: () => {
        navigationToggle.value[1] = true;
      },
      otherList: () => {
        let foot = navigationToggle.value[2] ? copyFootNav.value : [];
        let left = navigationToggle.value[0] ? sideNavigationList.value : [];
        return [...foot, ...left];
      },
    },
  };
});

/**
 * 卡片添加到导航栏
 * @param data 卡片数据 暂时只可以传入object
 * @param type 添加到的导航栏 -- 'left' | 'right' | 'foot'
 */
export const addCardToNav = (data: object | Array<object>, type: string) => {
  const nav = navObj.value[type];
  if (nav.state) {
    nav.addFn(data);
  } else {
    tip(data, nav);
  }
};

/**
 * 没有打开导航栏的提示，打开后自动添加
 * @param data 添加到的导航栏的数据
 * @param nav 当前导航栏 => navObj.value[type] 里面包含了导航栏比较常见的操作
 */
const tip = (data, nav) => {
  window.$ui.confirm(`当前${nav.tip}没有打开，是否选择打开${nav.tip}`, "", {
    ok: () => {
      nav.open();
      setTimeout(() => {
        nav.addFn(data);
      });
    },
  });
};


/**
 * 删除图标，同时判断剩余导航栏中是否还有主页图标
 * @param data 要删除的数据
 * @param nav 当前导航栏 -- 'left' | 'right' | 'foot'
 * @returns void
 */
export const deleteIcon = (data: any, nav: string) => {
  // 当前导航栏的相关数据
  const current = navObj.value[nav];
  // 除当前导航栏外其他处于开启状态下的导航栏数据
  const otherList = current.otherList();
  // 当前导航栏数据
  const list = current.list;
  // 主要删除函数
  const _del = (data:any, list:any) => {
    const index = list.findIndex((item) => item.id === data.id);
    if(index !== -1){
      list.splice(index, 1);
      return 
    }
    // message.info(`未找到${data.name}`)
  };
  // 判断删除的图标是不是主页
  if (data.value === "home") {
    if (otherList.find((item) => item.value === "home")) {
      _del(data, list);
      return;
    } else {
      message.error("至少保留一个主页");
    }
  } else {
    _del(data, list);
  }
};


/**
 * 判断合并的是不是卡片
 * @param list 导航栏数据
 * @param id 要合并的图标id
 * @param dragId 拖拽图标的id
 * @returns Boolean
 */
export const checkItems = (list: Array<ListItem>, id: string, dragId: string): boolean => {

    let item: ListItem | undefined = undefined;
    let dragItem: ListItem | undefined = undefined;

    for (const listItem of list) {
        if (listItem.id === id) item = listItem;
        if (listItem.id === dragId) dragItem = listItem;
        if (item && dragItem) break; // 当两者都找到提前退出循环
    }

    // return item?.type === 'card' || dragItem?.type === 'card';
    return false
};


/**
 * 检测图标是否是工作台图标
 */
export const checkIsIfyIcon = (icon : string) => {
  const isIfyIcon = computed(() => {
    const regex = /^[a-z-]+:[a-z-]+(?:-\d+)?(?:-[a-z\d-]+)?.*$/
    return regex.test(icon)
  })
  return isIfyIcon
}