import { defineStore } from "pinia";

// @ts-ignore
export const useNavigationStore = defineStore("useNavigationStore", {
  state: () => {
    return {
      editToggle: false,
      // 用户中心，社区助手，任务中心
      bottomToggle: [true, true, true],
      iconSetting: {
        iconName: true,
        iconRounded: true,
        iconBackground: false,
      },
      // 等级显示
      levelVisible: false,
      selectNav: "",
      currentList: {},
      // 第一次进入，显示推荐
      introduceVisible: true,
      // 导航栏数据
      navObj: {},
      // 存储改变前的数据
      oldToggle: [],
      // 弹窗次数
      popVisible: true,
      // 编辑图标颜色自定义
      colorSwitch: true,
      // 导航栏颜色自定义
      navColorSwitch: true,
      // 图标编辑元素
      editItem: "",
      navAttribute: {
        // 导航栏尺寸
        navSize: 100,
        // 导航栏圆角
        navRadius: 18,
      },
      // 图标圆角
      iconRadius: 12,
      // 选择可见
      isDesk: false,
      // 目标桌面
      targetDesk: "",
      // 跳转桌面,
      jumpDesk: "",
      // 开启自动隐藏导航栏
      autoHideNav: {
        foot: {
          state: false,
        },
        left: {
          state: false,
        },
        right: {
          state: false,
        },
      },
      // 离开导航栏
      isLeaveBar: false,
      // 鼠标移动到屏幕边缘
      isEdge: false,
      bottomInit: false,
      // 社群导航
      communityNavVisible: false,
      // 当前导航栏格式
      currentNavFormat: "mac",
      // 当前导航栏位置
      currentNavPosition: "bottom",
      // 主导航栏高度
      currentMainH:{
        top:40,
        bottom:100,
      },
    };
  },
  actions: {
    toggleEdit() {
      this.editToggle = !this.editToggle;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // storage: dbStorage,
        path: ["communityNavVisible", "currentNavFormat", "currentNavPosition", 'currentMainH','navAttribute','iconRadius'],
        storage: localStorage,
      },
    ],
  },
});
