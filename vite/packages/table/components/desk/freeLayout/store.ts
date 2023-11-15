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
      // 未划分
      start: true,
      afterDrop: false, // 鼠标落下吸附网格
      whileDrag: false,
      // 系统数据
      system: {
        // 是否使用自由布局
        isFreeLayout: true,
        // 是否使用悬浮菜单
        isFloatMenu: true,
        floatMenu: {
          top: 0,
          left: 0,
        },
      },

      margin: 6,
      // 辅助线数据
      line: {
        isAuxLine: false, // 是否显示辅助线
        isCenterLine: false, // 是否显示中心线
        isBorderLine: false, // 是否显示边框线

        centerLine: {
          x: 1000,
          y: 1000,
        },
      },
      // 画布数据
      canvas: {
        isInfinite: false, // 是否无限衍生
        zoom: 1, // 缩放比例
        width: 2000, // 宽
        height: 2000, // 高
      },
    },
    // 当前环境状态
    freeLayoutEnv: {
      loading: false, // 当前自由布局加载状态
      scrollTop: 0, // 当前滚动条Y轴
      scrollLeft: 0, // 当前滚动条X轴
      scrollWidth: 0, // 当前滚动条宽度
      scrollHeight: 0, // 当前滚动条高度
      updatePosition: false, // 修改位置
    },
    // 默认环境状态
    defaultFreeLayoutEnv: {
      loading: false,
      scrollTop: 0,
      scrollLeft: 0,
      scrollWidth: 0,
      scrollHeight: 0,
      updatePosition: false,
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
        return this.freeLayoutState[this.getCurrentDeskId].system.isFreeLayout;
      }
    },
    // 获取当前自由布局边距状态
    getFreeLayoutMargin() {
      return this.getFreeLayoutState?.afterDrop
        ? this.getFreeLayoutState?.margin
        : 0;
    },
    // 获取当前状态
    isFreeLayoutExist() {
      return this.getFreeLayoutState;
    },
  },
  actions: {
    // 吸附网格
    snapToGrid(x: number, y: number): [number, number] {
      /**
       * @author 杨南南
       * @date 2023-11-09
       * @description 将输入的坐标对齐到网格的交点
       *
       * 核心算法
       * 网格宽度：基础宽度 - 修正宽度 + 边距 * 2
       * 网格高度：基础高度 - 修正高度 + 边距 * 2
       * 对齐后的X坐标 = Math.round(视窗内的X坐标 / 网格宽度) * 网格宽度
       * 对齐后的Y坐标 = Math.round(视窗内的Y坐标 / 网格高度) * 网格高度
       *
       */
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
        this.freeLayoutState[this.getCurrentDeskId].system.isFreeLayout =
          !this.freeLayoutState[this.getCurrentDeskId].system.isFreeLayout;
      } else {
        // 否则进行初始化
        this.initFreeLayout();
      }
    },
    // 清空自由布局组件数据
    clearFreeLayoutData() {
      if (this.getFreeLayoutData) {
        this.freeLayoutData[this.getCurrentDeskId] = {};
      }
    },
    // 删除自由布局组件数据
    clearFreeLayoutState() {
      this.getFreeLayoutState = {};
    },
    // 删除当前自由布局数据
    clearFreeLayout() {
      console.log("2222 :>> ", 2222);
      delete this.freeLayoutData[this.getCurrentDeskId];
      delete this.freeLayoutState[this.getCurrentDeskId];
      console.log("object :>> ", this.freeLayoutState);
    },
    // 清除所有自由布局数据
    clearAllFreeLayout() {
      this.freeLayoutData = {};
      this.freeLayoutState = {};
    },
    // 初始化当前环境
    initFreeLayoutEnv() {
      this.freeLayoutEnv = this.defaultFreeLayoutEnv;
      console.log("初始化当前环境成功 :>> ", this.freeLayoutEnv);
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
