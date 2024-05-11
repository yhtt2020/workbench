<template>
    <div 
        class="
            w-full h-[64px]  
            flex items-center 
            justify-between p-3 relative" 
        style="
            border-top: 1px solid var(--divider);
            border-bottom: 1px solid var(--divider);
            background: rgba(26,26,26,0.65);
            backdrop-filter: blur(50px);"
        :style="{zoom: `${navAttribute.navSize / 100}`}"
        :class="radius">
        <!-- 用户头像以及控制中心 -->
        <User></User>
        <!-- 导航栏图标 -->
        <div class="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
           <Panel 
                v-model:folderVisible="folderVisible"
                @edit="edit" 
                id="bottomPanel" 
                @getDelIcon="getDelIcon" 
                @control="control">
            </Panel> 
        </div>
        
        <!-- 右侧时间天气和消息通知 -->
        <div class="flex">
            <Time></Time>
            <MessageBox :boxClass="'ml-3'" :mainClass="mainClass"></MessageBox>
            <Tip 
                :top="0"
                name="inform" 
                :check="status.show" 
                type='click' 
                :tipClass="'flex justify-center items-center'">
                <xt-new-icon 
                    @click="openRightDrawer" 
                    icon="fluent:alert-16-regular" 
                    size="24" 
                    class="flex items-center justify-center ml-3" />
            </Tip>
        </div>
    </div>
    <teleport to='body'>
        <TopPanelRightDrawer ref="rightDrawer"></TopPanelRightDrawer>
    </teleport>

</template>

<script setup lang='ts'>
import { ref, provide, watch, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import Tip from '../../ui/new/tip/src/Tip.vue';

import User from './User.vue';
import Time from './Time.vue';
import MessageBox from './MessageBox.vue';
import Panel from './Panel.vue';
import TopPanelRightDrawer from '../drawer/TopPanelRightDrawer.vue';

import { appStore } from '../../store';
import { useNavigationStore } from '../desk/navigationBar/navigationStore';

const useAppStore = appStore()
const { showGuide , status } = storeToRefs(useAppStore)

const useNav = useNavigationStore()
const { navAttribute, currentNavPosition } = storeToRefs(useNav)

const emit = defineEmits(['edit', 'getDelIcon', 'control', 'update:folderVisible'])

const props = defineProps({
    mainClass: {
        type: String,
        default: 'bottom-20 right-6'
    }
})

// 文件更新状态
const folderVisible = ref(false)

const rightDrawer = ref<InstanceType<typeof TopPanelRightDrawer> | null>(null)

provide('iconSize', 44)

// 打开右侧抽屉
const openRightDrawer = () => {
    if (!showGuide.value) {
        rightDrawer.value.openRightDrawer()
        useAppStore.hideNoticeEntry()
    } else {
        message.info('定制过程中无法操作')
    }
}

/**
 * 导航栏图标的回调函数 
 * @edit 编辑图标的回调
 * @getDelIcon 托起图标后传入的删除区域显示的回调
 * @control 导航栏控制中心的回调
 * @param value 
 */

const edit = (value) => {
    emit('edit', value)
}

const getDelIcon = (value) => {
    emit('getDelIcon', value)
}

const control = (value) => {
    emit('control', value)
}

// 更新文件夹打开状态
watch(
    () => folderVisible.value,
    (val) => {
        emit('update:folderVisible', val)
    }
)

// 边框圆角
const radius = computed(() => {
   return currentNavPosition.value === 'top' ? 'rounded-t-md' : 'rounded-b-md'
})
</script>
<style lang='scss' scoped></style>