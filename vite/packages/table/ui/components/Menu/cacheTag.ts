import { defineStore } from 'pinia';

export const cacheStore = defineStore('cacheStore', {
    state: () => ({
        // 桌面和导航栏右键菜单额外菜单，点击关闭右键菜单标识
        isHide: false
    }),
    actions: {}
})