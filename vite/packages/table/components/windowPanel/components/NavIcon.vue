<template>
    <!-- 工作台图标 -->
    <div
        v-if="isIfyIcon"
        :style="{
            width:size + 'px',
            height:size + 'px',
            borderRadius: navigationBar.iconRadius + 'px', 
            background: item?.bg || ''}"
        class="relative flex items-center justify-center overflow-hidden">
        <xt-new-icon :icon="item.icon" :size="32"></xt-new-icon>
    </div>
    <!-- 文件夹图标 -->
    <Folder 
        v-else-if="item.type === 'folder'"
        :iconSize="size"
        :iconList="item.children"
        :item='item'>
    </Folder>
    <!-- 社区图标 -->
    <Team
        v-else-if="item.value === 'commun'"
        :item="item"
        :placement="community.placement"
        :x="community.x"
        :y="community.y"
        :size="size"
        :visible="community.visible">
    </Team>
    <!-- 通用图标 -->
    <a-avatar 
        v-else-if="!item.isBg"
        :src="item.icon"
        shape="square"
        :size="size"
        :style="{ borderRadius: navigationBar.iconRadius + 'px' }"
        >
    </a-avatar>

    <!-- 自定义图标 :style="{ borderRadius: navigationBar.iconRadius + 'px', background: item?.bg || '',width:size + 'px',height:size + 'px' }"-->
    <div
        v-else-if="item.isBg"
        :style="{
            width:size + 'px',
            height:size + 'px',
            borderRadius: navigationBar.iconRadius + 'px', 
            background: item?.bg || ''}"
        class="relative flex items-center justify-center overflow-hidden">
        <a-avatar
            :size="32"
            shape="square"
            :src="renderIcon(item.icon)"
            :style="[{ borderRadius: navigationBar.iconRadius + 'px' }, item?.color]">
        </a-avatar>
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs, computed } from 'vue'
import { storeToRefs } from 'pinia';

import { renderIcon } from '../../../js/common/common';

import Folder from '../../desk/navigationBar/components/folder/Folder.vue';
import Team from '../../bottomPanel/Team.vue';

import { useNavigationStore } from '../../desk/navigationBar/navigationStore';

const navigationBar = useNavigationStore();
const { iconRadius, navSize } = storeToRefs(navigationBar);

type AvatarType = {
    // 图标大小
    size?: number,
    // 图标的详细数据
    item: object,
    // 社区中心图标的相关配置
    community: object
}

const props = withDefaults(defineProps<AvatarType>(), {
    size: 52,
    item: {},
    community: {}
});
const { size , item , community } = toRefs(props)

// 用于判断是不是工作台图标
const isIfyIcon = computed(() => {
    const regex = /^[a-z]+:[a-z]+(?:-\d+)?(?:-[a-z\d]+)?.*$/
    return regex.test(item.value.icon)
})

</script>
<style lang='scss' scoped></style>