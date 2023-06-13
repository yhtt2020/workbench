import { defineStore } from "pinia";
export const myIcons = defineStore(
    "myIcons", {
    state() {
        return {
            iconOption: {
                isRadius: false,
                radius: 0,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: "",
                init: true,
                src: ""
            },
            baseIconOption: {
                isRadius: false,
                radius: 0,
                isBackground: false,
                backgroundColor: null,
                titleValue: "",
                link: "",
                linkValue: ":",
                src: ""
            }
        }
    },
    actions: {}
})
