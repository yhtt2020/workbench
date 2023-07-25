import { defineStore } from "pinia";

// 工具箱主要的全局状态存储在这里
export const useMainStore = defineStore("main", {
  state: () => ({
    count: 0,
    useTool: "",
  }),
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
