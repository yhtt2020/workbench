import { defineStore } from "pinia";
// @ts-ignore
export const myIcons = defineStore("myIcons", {
  state: () => ({
    // 添加卡片的数据
    iconOption: {
      /**
       * mini 1*1
       * small 2*2
       * default 2*4
       * long 4*2
       * big 4*4
       * infinite 无限
       */
      size: "mini", // 组件大小
      link: "", // 选择类型
      linkValue: "", // 旧版打开
      open: {
        // 新版打开
        value: "", // 具体参数
        type: "internal", // 打开类型
      },
      isTitle: true, // 图标名称状态
      titleValue: "", // 图标名称
      src: "", // 图标路径
      isRadius: true, // 圆角开关
      radius: 5, // 圆角弧度
      imgState: "cover", // 图片显示状态
      imgShape: "square", // 图片形状
      isBackground: false, // 背景开关
      backgroundColor: "", // 背景颜色
      backgroundIndex: 0, // 背景下标
      // 新增默认图标
      defaultIcon:""
    },
    edit: {},
    iconSelect: false, // 图标多选情况
    isCopy: false, // 复制状态
    isDrag: false, // 拖拽状态
    isClose: false, // 全屏离开状态
    isPaste: false, // 粘贴状态
    iconState: true, // 图标组件状态
    iconsRefs: [], // 多图标组件ref
    iconList: [], // 多图标组件数据
    temporaryIcon: [],
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["temporaryIcon"],
        storage: localStorage,
      },
    ],
  },
});
