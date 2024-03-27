<template>
    <div 
        class="
            w-full h-[64px]  pointer 
            flex items-center 
            justify-between p-3 " 
        style="border: 1px solid var(--divider);background: rgba(26,26,26,0.65);;">
        <!-- 用户头像以及控制中心 -->
        <User></User>
        <!-- 导航栏图标 -->
        <Panel></Panel>
        <!-- 右侧时间天气和消息通知 -->
        <div class="flex">
            <Time @openRightDrawer="openRightDrawer"></Time>
            <MessageBox :boxClass="'ml-3'"></MessageBox>  
            <!-- <Tip name="inform" > -->
                <xt-new-icon 
                    @click="openRightDrawer"
                    icon="fluent:alert-16-regular" 
                    size="24" 
                    class="ml-3"/>
            <!-- </Tip>    -->
        </div>
        
    </div>
    <TopPanelRightDrawer ref="rightDrawer"></TopPanelRightDrawer>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import Tip from '../ui/new/tip/src/Tip.vue';

import User from './windowPanel/User.vue';
import Time from './windowPanel/Time.vue';
import MessageBox from './windowPanel/MessageBox.vue';
import Panel from './windowPanel/Panel.vue';
import TopPanelRightDrawer from './drawer/TopPanelRightDrawer.vue';

import { appStore } from '../store';

const useAppStore = appStore()
const { showGuide } = storeToRefs(useAppStore)

const rightDrawer = ref<InstanceType<typeof TopPanelRightDrawer> | null>(null)

// 打开右侧抽屉
const openRightDrawer = () => {
    if (!showGuide.value) {
        rightDrawer.value.openRightDrawer()
        useAppStore.hideNoticeEntry()
    } else {
        message.info('定制过程中无法操作')
    }
}

</script>
<style lang='scss' scoped></style>