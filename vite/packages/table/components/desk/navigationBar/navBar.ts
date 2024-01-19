import { defineStore } from "pinia";

export const useNavBarStore = defineStore("useNavBarStore", {
  state: () => ({
    navBarId:'', // 导航栏id 
    navBarItem:'', // 导航栏元素
  }),
});
