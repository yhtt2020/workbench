import { defineStore } from "pinia";

// @ts-ignore
export const useFloatMenuStore = defineStore("useFloatMenuStore", {
  state: () => ({
    x: null,
    y: null,
    menus: [],
    menusObj: {},
    firstPosition: ["right", "bottom", -40, -35],
  }),
  getters: {
    newMenus() {
      this.menus.forEach((item) => {
        console.log("item :>> ", item);
      });
    },
    currentMenus() {
      return this.menus;
    },
  },
  actions: {
    addMenu(menu) {
      const { id, parentId } = menu;
      let parent = true;
      let arr = this.menus.map((item) => {
        // 有父级ID 并且父级存在
        if (item.id == parentId) {
          let children = [...item.children];
          let flag = true;
          children = children.map((item) => {
            if (item.id == id) {
              flag = false;
              return menu;
            }
          });
          if (flag) {
            children.push(menu);
          }
          children.sort((a, b) => a.id - b.id);
          item.children = children;
          console.log("item :>> ", item);
          return item;
        }
        // 无父级ID 父级存在做替换
        else if (item.id == id) {
          return menu;
        }
        return item;
      });
      if (parent) {
        arr.push(menu);
      }
      arr.sort((a, b) => a.id - b.id);
      console.log("arr :>> ", arr);
      this.menus = arr;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // paths: ["x", "y"],
        storage: localStorage,
      },
    ],
  },
});
