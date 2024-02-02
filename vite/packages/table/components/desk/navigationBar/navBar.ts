import { defineStore } from "pinia";

export const useNavBarStore = defineStore("useNavBarStore", {
  state: () => ({
    navBarId:'', // 导航栏id 
    navBarItem:'', // 导航栏元素
    isLeaveBar:false, // 是否离开导航栏
    isEnterDesk:false, // 是否进入桌面
  }),
});
