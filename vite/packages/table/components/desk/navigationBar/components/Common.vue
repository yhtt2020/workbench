<template>
    <div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed, watch, toRef } from 'vue'
import { useNavigationStore } from '../navigationStore'
import { appStore } from '../../../../store';
import { navStore } from '../../../../store/nav'
import {storeToRefs} from 'pinia'
import { nanoid } from 'nanoid';
const useNavStore = navStore()
const navigationStore = useNavigationStore()
const useAppStore = appStore()
const iconList = ref([
    {
        value: 'commun',
        name: '社区中心',
        icon: '/logo/commun.svg',
        bg: '',
        isBg: false,
        mode: 'app',
        type: 'systemApp',
        id: nanoid(6)
    },
    {
        value: 'task',
        name: '任务中心',
        icon: '/logo/task.svg',
        bg: '',
        isBg: false,
        mode: 'app',
        type: 'systemApp',
        id: nanoid(6)

    }
])
watch(() => navigationStore.bottomToggle[0], (newV,oldV) => {
    newV ? useAppStore.settings.enableChat = true : useAppStore.settings.enableChat = false
})
/**
 * 社区和任务的监听函数
 * @param target 目标值
 * @param value 
 * @param item 
 */
const findItem = (target, value, item) => {
    if (target) {
        const hasTargetItem = useNavStore.copyFootNav.some(item => {
            if (item.type === 'folder') {
                return item.children.some(child => child.value === value);
            }
            return item.value === value
        });
        if (hasTargetItem) {
            return true;
        }
        useNavStore.setFootNavigationList(item);
    } else {
        const index = useNavStore.copyFootNav.findIndex(item => {
            if (item.type === 'folder') {
                return item.children.some(child => child.value === value);
            }
            return item.value === value
        });
        if (index !== -1) {
            useNavStore.removeFootNavigationList(index);
        }
    }
}
/**
 * 社区中心和任务中心
 */
watch(() => navigationStore.bottomToggle[1], (newValue, oldValue) => {
    findItem(newValue, 'commun', iconList.value[0])
}, { deep: true, immediate: true });

watch(() => navigationStore.bottomToggle[2], (newValue, oldValue) => {
    findItem(newValue, 'task', iconList.value[1])
}, { deep: true, immediate: true });
</script>
<style lang='scss' scoped></style>