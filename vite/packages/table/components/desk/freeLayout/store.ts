import { ref } from "vue";
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
      const card: any = cardStore();
      return this.freeLayoutData[card.currentDeskId];
      // return this.freeLayoutData[this.getCurrentDeskId];
    },
    // 获取当前自由布局状态
    getFreeLayoutState() {
      return this.freeLayoutState[this.getCurrentDeskId];

      const card: any = cardStore();
      return this.freeLayoutState[card.currentDeskId];
    },
    // 当前自由布局是否开启
    isFreeLayout() {
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        return this.freeLayoutState[this.getCurrentDeskId].start;
      }
    },
  },
  actions: {
    // 初始化自由布局数据
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
      this.freeLayoutState[this.getCurrentDeskId] = {
        start: true,
        position: "top center",
        width: 2000,
        height: 2000,
        auxLine: true,
        afterDrop: false,
        whileDrag: false,
        zoom: 1,
      };
      this.freeLayoutData[this.getCurrentDeskId] = cardDatas;
    },
    // 更新自由布局数据
    renewFreeLayout() {
      // 如果自由布局数据存在进行切换
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        this.freeLayoutState[this.getCurrentDeskId].start =
          !this.freeLayoutState[this.getCurrentDeskId].start;
      } else {
        // 否者进行初始化
        this.initFreeLayout();
      }
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
