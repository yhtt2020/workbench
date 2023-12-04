import { defineStore, storeToRefs } from "pinia";
import { cardStore } from "../../../store/card";
import { homeStore } from "../../../store/home";
import _ from "lodash";

import dbStorage from "../../../store/dbStorage";
// @ts-ignore
export const useFreeLayoutStore = defineStore("useFreeLayoutStore", {
  state: () => ({
    // 自由布局数据
    freeLayoutData: {},
    // 自由布局状态
    freeLayoutState: {},
    // 拖拽时的数据
    dragData: {},
    // 临时数据
    tempData: {},
    isSelectAll: false,
    // 默认状态数据
    defaultState: {
      // 系统数据
      system: {
        // 是否使用自由布局
        isFreeLayout: true,
        // 隐藏组件
        hide: false,
      },
      option: {
        afterDragging: false,
        whileDragging: false,
        collision: false,
        margin: 6, // 没用目前 可能会直接删
        magnet: false,
      },

      // 辅助线数据
      line: {
        isAuxLine: false, // 是否显示辅助线
        isBorderLine: false, // 是否显示边框线
        isCenterLine: false, // 是否显示中心线
        centerLine: {
          x: 2500,
          y: 2500,
        },
        centerPosition: {
          x: "center",
          y: "top",
        },
      },
      // 画布数据
      canvas: {
        isInfinite: false, // 是否无限衍生
        zoom: 1, // 缩放比例
        width: 5000, // 宽
        height: 5000, // 高
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
      const { desks } = storeToRefs(card);
console.log('card,desks :>> ', card,desks);
      const desk = desks.value?.filter(
        (item) => item.id === this.getCurrentDeskId
      );
      return desk[0];
    },
    // 获取当前桌面Id
    getCurrentDeskId() {
      const card: any = homeStore();
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
      console.log("开始加载自由布局:>>\n 当前桌面id ", this.getCurrentDeskId);
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        return this.freeLayoutState[this.getCurrentDeskId].system?.isFreeLayout;
      }
    },
    // 获取当前自由布局边距状态
    getFreeLayoutMargin() {
      // return this.getFreeLayoutState?.option.afterDragging ||
      //   this.getFreeLayoutState?.option.whileDragging
      //   ? this.getFreeLayoutState?.margin
      //   : 0;
      return 6;
    },
  },
  actions: {
    deepMerge(target, source) {
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          if (typeof source[key] === "object" && source[key] !== null) {
            if (!target.hasOwnProperty(key)) {
              Object.assign(target, { [key]: {} });
            }
            this.deepMerge(target[key], source[key]);
          } else {
            if (!target.hasOwnProperty(key)) {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }
      }
    },
    // 初始化自由布局状态数据
    initFreeLayoutState() {
      this.deepMerge(this.getFreeLayoutState, this.defaultState);
      console.log("自由布局状态初始化成功 :>> ", this.getFreeLayoutState);
    },
    // 更新自由布局数据
    renewFreeLayout() {
      // 如果自由布局数据存在进行切换
      console.log(
        "自由布局状态开始创建 :>> \n当前自由布局ID  :>> ",
        this.getCurrentDeskId
      );
      if (this.freeLayoutState.hasOwnProperty(this.getCurrentDeskId)) {
        this.freeLayoutState[this.getCurrentDeskId].system.isFreeLayout =
          !this.freeLayoutState[this.getCurrentDeskId]?.system?.isFreeLayout;
        console.log("自由布局执行激活 :>> ");
      } else {
        // 否则进行初始化
        this.freeLayoutState[this.getCurrentDeskId] = this.defaultState;
        this.freeLayoutData[this.getCurrentDeskId] = {};
        console.log("自由布局执行初始化 :>> ");
      }
      this.initFreeLayoutState();
    },
    // 清空自由布局组件数据
    clearFreeLayoutData() {
      if (this.getFreeLayoutData) {
        this.freeLayoutData[this.getCurrentDeskId] = {};
      }
      console.log("    this.getCurrentDesk :>> ", this.getCurrentDesk);
      this.getCurrentDesk.cards = [];
    },
    // 删除自由布局组件数据
    clearFreeLayoutState() {
      this.getFreeLayoutState = {};
    },
    // 删除当前自由布局数据
    clearFreeLayout(id) {
      console.log("id :>> ", id);

      delete this.freeLayoutData[id];
      delete this.freeLayoutState[id];
      console.log("删除数据成功 :>> ", this.freeLayoutState);
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
    // 拷贝原数据
    copyData() {
      this.tempData = _.cloneDeep(this.getFreeLayoutData);
    },
    // 更新坐标
    updatePositionX(num) {
      for (const key in this.getFreeLayoutData) {
        this.getFreeLayoutData[key].left = this.tempData[key].left + num;
      }
    },
    updatePositionY(num) {
      for (const key in this.getFreeLayoutData) {
        this.getFreeLayoutData[key].top = this.tempData[key].top + num;
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["freeLayoutData", "freeLayoutState", "test"],
        // storage: localStorage,
        storage: dbStorage,
      },
    ],
  },
});
