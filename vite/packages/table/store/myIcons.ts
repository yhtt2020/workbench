import { defineStore } from "pinia";
export const myIcons = defineStore(
    "myIcons", {
    state() {
        return {
            // 添加卡片的数据
            iconOption: {
                isRadius: false,
                radius: 0,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: "",
                init: true,
                src: "",
                backgroundIndex: 1,
            },
            // 储存初始化的数据
            baseIconOption: {
                isRadius: false,
                radius: 0,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: "",
                src: "",
                backgroundIndex: 1,
            },
            // 储存复制过来的数据
            copyIconOption: {
                isRadius: false,
                radius: 0,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: "",
                src: "",
                backgroundIndex: 1,
            },
            copyIconIndex: 0,
            iconRef: null, // 替代全局事件总线来处理回调
            isCopy: false, // 是否打开复制状态
            iconList: []

        }
    },
    actions: {}
})
