import { defineStore } from "pinia";

import dbStorage from "../../store/dbStorage";
// @ts-ignore
export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    menus: [],
    autoOpenEdit: false, // 是否自动打开编辑
  }),
  getters: {
    newMenus() {},
    currentMenus() {},
  },
  actions: {
    addMenu(menu) {
      const existingMenu = this.menus.find(item => item.id === menu.id);

      if (existingMenu) {
        if (existingMenu.children && menu.children) {
          existingMenu.children = this.processChildren(existingMenu.children, menu.children);
        } else {
          Object.assign(existingMenu, menu); // 更新现有菜单项
        }
      } else {
        this.menus.push(menu); // 添加新菜单项
      }

      this.menus.sort((a, b) => a.id - b.id);
    },

    processChildren(itemChildren, menuChildren) {
      // 使用一个新数组来保存结果
      const newChildren = [...itemChildren];

      // 遍历menuChildren数组
      menuChildren.forEach((menuItem) => {
        // 查找newChildren中是否存在相同ID的项
        const existingIndex = newChildren.findIndex(
          (item) => item.id === menuItem.id
        );

        if (existingIndex !== -1) {
          // 如果存在相同ID的项，替换整个数据
          newChildren[existingIndex] = menuItem;
        } else {
          // 如果不存在，添加该项
          newChildren.push(menuItem);
        }
      });
      newChildren.sort((a, b) => a.id - b.id);
      return newChildren;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["autoOpenEdit"],
        // storage: localStorage,
        storage: dbStorage,
      },
    ],
  },
});
