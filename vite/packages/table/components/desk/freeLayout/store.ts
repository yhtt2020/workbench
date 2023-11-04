import { defineStore, storeToRefs } from "pinia";

import { cardStore } from "../../../store/card";
// @ts-ignore
export const useFreeLayoutStore = defineStore("useFreeLayoutStore", {
  state: () => ({
    // 自由布局数据
    freeLayoutData: {},
    // 自由布局状态
    freeLayoutState: {},
    // 拖拽时的数据
    dragData: {},
    // 默认状态数据
    defaultState: {
      start: true,
      position: "top center",
      width: 2000,
      height: 2000,
      auxLine: true,
      afterDrop: false, // 鼠标落下吸附网格
      whileDrag: false,
      zoom: 1,
      margin: 6,
    },
  }),
  getters: {
    // 获取当前桌面数据
    getCurrentDesk() {
      const card: any = cardStore();
      const { currentDeskId, desks } = storeToRefs(card);
      const desk = desks.value.filter(
        (item) => item.id === currentDeskId.value
      );
      return desk[0];
    },
    // 获取当前桌面Id
    getCurrentDeskId() {
      const card: any = cardStore();
      const { currentDeskId } = storeToRefs(card);
      return currentDeskId.value;
    },
    // 获取当前自由布局数据
    getFreeLayoutData() {
      return this.freeLayoutData[this.getCurrentDeskId];
    },
    // 获取当前自由布局状态
    getFreeLayoutState() {
      return this.freeLayoutState[this.getCurrentDeskId];
    },
    // 获取当前自由布局是否开启
    isFreeLayout() {
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        return this.freeLayoutState[this.getCurrentDeskId].start;
      }
    },
    // 获取当前自由布局边距状态
    getFreeLayoutMargin() {
      return this.getFreeLayoutState?.afterDrop
        ? this.getFreeLayoutState?.margin
        : 0;
    },
  },
  actions: {
    // 吸附网格
    snapToGrid(x: number, y: number): [number, number] {
      let width = 140 - 6 + this.getFreeLayoutMargin * 2;
      let height = 102 - 6 + this.getFreeLayoutMargin * 2;
      const snappedX = Math.round(x / width) * width;
      const snappedY = Math.round(y / height) * height;
      return [snappedX, snappedY];
    },

    // 初始化自由布局组件数据
    initFreeLayout() {
      // 格式化数据
      const desk = this.getCurrentDesk;
      const cardDatas = {};
      desk?.cards.forEach((item) => {
        const { id, name, data, customData } = item;
        cardDatas[item.id] = {
          top: 0,
          left: 0,
          id,
          name,
          customData,
        };
      });
      // 保存数据
      this.freeLayoutState[this.getCurrentDeskId] = this.defaultState;
      this.freeLayoutData[this.getCurrentDeskId] = cardDatas;
    },
    // 初始化自由布局状态数据
    initFreeLayoutState() {
      for (let key in this.defaultState) {
        if (!this.getFreeLayoutState.hasOwnProperty(key)) {
          this.getFreeLayoutState[key] = this.defaultState[key];
        }
      }
      console.log("初始化数据成功 :>> ", this.getFreeLayoutState);
    },
    // 更新自由布局数据
    renewFreeLayout() {
      // 如果自由布局数据存在进行切换
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        this.freeLayoutState[this.getCurrentDeskId].start =
          !this.freeLayoutState[this.getCurrentDeskId].start;
      } else {
        // 否则进行初始化
        this.initFreeLayout();
      }
    },
    // 清空自由布局组件数据
    clearFreeLayoutData() {
      this.getFreeLayoutData = {};
    },
    // 删除自由布局组件数据
    clearFreeLayoutState() {
      this.getFreeLayoutState = {};
    },
    clearFreeLayout() {
      delete this.freeLayoutData[this.getCurrentDeskId];
      delete this.freeLayoutState[this.getCurrentDeskId];
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["freeLayoutData", "freeLayoutState"],
        // storage: dbStorage,
        storage: localStorage,
      },
    ],
  },
});
