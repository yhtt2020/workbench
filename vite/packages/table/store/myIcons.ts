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
            isCopy: false, // 是否打开复制状态
            iconList: []

        }
    },
    actions: {}
})
