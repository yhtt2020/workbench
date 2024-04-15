<template>
    <div class="flex">
        <!-- 团队导航 -->
        <CommunityNav 
            v-if="communityNavVisible" 
            :gap="16"
            :size="44" 
            :isWindow="true" 
            boxClass=""/>
        <a-divider
          v-if="communityNavVisible"
          type="vertical"
          style="
            height: 32px;
            margin-top: 16px;
            margin-left:14px;
            margin-right: 14px;
            border-top: 1px solid var(--divider) !important;"
        />
        <!-- 导航栏 -->
        <Dock
            :boxStyle="'border:none;'"
            v-model:isOpen="folderVisible"
            :iconSize="44"
            :customClass="'h-[64px]'"
            :gap="16"
            @edit="editIcon"
            @getDelIcon="getDelIcon"
            @control="control">
        </Dock>   
    </div>

    <Teleport to="body">
        <!-- 团队导航弹窗 -->
        <div 
          v-if="teamNavVisible" 
          class="absolute tuanduidaohang" 
          :style="{
            left: `${teamPos.x}px`,
            top: `${teamPos.y}px`,
          }" 
          style="z-index: 800">
          <TeamNav @close="teamNavVisible = false" @openSet="settingModal" ref="team"/>
        </div>

        <!-- 加入的社群搜索 -->
        <div 
          v-if="comSearchVisible" 
          class="absolute" 
          :style="{
            left: `${comSearchPos.x}px`,
            top: `${(comSearchPos.y)}px`,
          }" 
          style="z-index: 600">
          <ComNavSearch @close="comSearchVisible = false" ref="search"/>
        </div>

        <!-- 应用模式弹窗 -->
        <AppModal />
  
        <!-- 应用模式中设置弹窗 -->
        <Setting ref="modeSetRef" />
  
        <!-- 桌面、导航、分支数据分类弹窗 -->
        <DeskAppModal ref="deskAppModalRef" />
    </Teleport>
    
    
</template>

<script setup lang='ts'>
import { 
    ref, 
    watch, 
    defineAsyncComponent, 
    onMounted,
    getCurrentInstance 
} from 'vue'
import { storeToRefs } from 'pinia';

import Dock from '../bottomPanel/Dock.vue';

import { useNavigationStore } from '../../components/desk/navigationBar/navigationStore';

import { usePosition } from './hook/usePosition';

const CommunityNav = defineAsyncComponent(() => import('../bottomPanel/community/CommunityNav.vue'))
const TeamNav = defineAsyncComponent(() => import('../bottomPanel/community/TeamNav.vue'))
const AppModal = defineAsyncComponent(() => import('../bottomPanel/community/AppModal.vue'))
const Setting = defineAsyncComponent( () => import ("../bottomPanel/setting/CommunitySetting.vue"))
const ComNavSearch = defineAsyncComponent(() => import("../bottomPanel/search/ComNavSearch.vue"))
const DeskAppModal = defineAsyncComponent(() => import("../bottomPanel/desk/DeskAppList.vue"))

const emit = defineEmits(['edit','getDelIcon','update:folderVisible'])

// 团队导航状态
const useNav = useNavigationStore()
const { communityNavVisible } = storeToRefs(useNav)

const folderVisible = ref(false)

const { proxy } = getCurrentInstance();
const teamNavVisible = ref(false);
const comSearchVisible = ref(false);
const teamPos = ref({
    x: 0,
    y: 0
});
const comSearchPos = ref({
    x: 0,
    y: 0
});
const modeSetRef = ref(null);
const deskAppModalRef = ref(null);

const settingModal = () => {
  modeSetRef.value.openAppSetting()
}

const setupEvent = (eventName, visibilityRef, positionRef, itemDimensions) => {
  proxy.$bus.on(eventName, (event) => {
    // 关闭模态框，如果是打开社群搜索的事件
    if (eventName === 'openComSearch') {
      proxy.$bus.emit('closeModal');
    }

    // 切换可见性状态
    visibilityRef.value = !visibilityRef.value;

    // 解构事件中的鼠标位置
    const { clientX, clientY } = event;

    // 使用鼠标位置和项目尺寸计算新位置
    const pos = { x: clientX, y: clientY };
    const { x, y } = usePosition(pos, itemDimensions);

    // 更新位置状态
    positionRef.value = { x, y };
  });
}

onMounted(() => {
    setupEvent('openTeamNav', teamNavVisible, teamPos, { x: 572, y: 420 });
    setupEvent('openComSearch', comSearchVisible, comSearchPos, { x: 280, y: 320 });

    proxy.$bus.on('openDeskAppModal', () => {
        deskAppModalRef.value.openDeskApp()
    })
    // 
    proxy.$bus.on('openAppSetting', () => {
        modeSetRef.value.openAppSetting()
    })
})

// 编辑图标状态
const editIcon = (id) => {
    emit('edit',id)
}

// 更新删除状态
const getDelIcon = (val) => {
    emit('getDelIcon',val)
}

// 点击控制中心
const control = (val) => {
    emit('edit',val)
}

// 更新文件夹打开状态
watch(
    () => folderVisible.value, 
    (val) => {
        emit('update:folderVisible', val)
    }
)


</script>
<style lang='scss' scoped></style>