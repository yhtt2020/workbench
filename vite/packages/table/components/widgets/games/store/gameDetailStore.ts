import { defineStore } from "pinia";

// @ts-ignore
export const gameDetailStore = defineStore("gameDetail", {
  state: () => ({
    // 当前游戏详情,小尺寸
    smallGameDetail: {},
    // 当前游戏详情,大尺寸
    largeGameDetail: {},
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: ["smallGameDetail", "largeGameDetail"],
        storage: localStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
