<template>
    <div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watch, toRef } from 'vue'
import { useNavigationStore } from '../navigationStore'
import { appStore } from '../../../../store';
const navigationStore = useNavigationStore()
const useAppStore = appStore()
const childrenMenu = computed(() => {
    return [
        {
            id: 1,
            name: navigationStore.bottomToggle[0] ? '隐藏用户中心' : '显示用户中心',
            newIcon: "fluent:person-16-regular",
            fn: () => { navigationStore.bottomToggle[0] = !navigationStore.bottomToggle[0] }
        },
        {
            id: 2,
            name: navigationStore.bottomToggle[1] ? '隐藏社区助手' : '显示社区助手',
            newIcon: "fluent:people-community-16-regular",
            fn: () => { navigationStore.bottomToggle[1] = !navigationStore.bottomToggle[1] }
        },
        {
            id: 3,
            name: navigationStore.bottomToggle[2] ? '隐藏任务中心' : '显示任务中心',
            newIcon: "fluent:task-list-square-16-regular",
            fn: () => { navigationStore.bottomToggle[2] = !navigationStore.bottomToggle[2] }
        },
        {
            id: 4,
            name: useAppStore.settings.enableChat ? '隐藏社群沟通' : '显示社群沟通',
            newIcon: "fluent:chat-16-regular",
            fn: () => { useAppStore.settings.enableChat = !useAppStore.settings.enableChat }
        },
    ]
})
watch(() => navigationStore.bottomToggle[0], () => {
    useAppStore.settings.enableChat = !useAppStore.settings.enableChat
})
</script>
<style lang='scss' scoped></style>