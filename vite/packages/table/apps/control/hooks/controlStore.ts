import { defineStore } from "pinia";
import { useControlList } from "../hooks/controlList";
import _ from "lodash-es";

// @ts-ignore
export const controlStore = defineStore("control", {
  state: () => ({
    // 清除底部导航栏控制中心红点显示
    firstNavVisible: true,
    // 设置配置
    setting: {
      // 第一次触发
      firstVisible: false,
      // 是否开启编辑
      isEdit: false,
    },
    // 通过muuri组件拖拽排序更新后的列表
    updateList: [],
    // 当前添加的控制中心
    currentAdd: [],
    // 当前控制中心的数据
    currentControlList: [],
  }),

  getters: {
    // 添加
    addControlList() {
      return this.currentAdd;
    },
    // 删除
    removeControlList() {
      return this.currentControlList;
    },
  },

  actions: {
    // 重置
    resetList() {},
    // 初始化获取
    initControlList() {
      if (this.currentControlList.length === 0) {
        this.currentControlList = useControlList;
      }
      if(!this.currentControlList.some(u=>u.id == "window-size-position") && !this.currentAdd.some(u=>u.id == "window-size-position")){
        this.currentControlList.push(
          {
            id: "window-size-position",
          }
        )
      }

    },
    // 更新列表
    updateControlList(list: any) {
      this.updateList = list;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "firstNavVisible",
          "setting",
          "currentAdd",
          "updateList",
          "currentControlList",
        ],
        storage: localStorage,
      },
    ],
  },
});
