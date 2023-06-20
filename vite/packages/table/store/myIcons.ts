import { defineStore } from "pinia";
export const myIcons = defineStore(
    "myIcons", {
    state() {
        return {
            // 添加卡片的数据
            iconOption: {
                isRadius: true,
                radius: 5,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: "",
                init: true,
                src: "",
                backgroundIndex: 1,
            },
            isHover: false,
            isCopy: false, // 复制状态
            isDrag: false, // 拖拽状态
            isClose: false, // 全屏离开状态
            isPaste: false, // 粘贴状态
            iconState: true, // 图标组件状态
            iconsRefs: [], // 多图标组件ref
            iconList: []
        }
    },
    actions: {}
})
