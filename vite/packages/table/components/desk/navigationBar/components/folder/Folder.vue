<template>
    <div :style="{width:iconSize + 'px',height:iconSize + 'px'}">
        <Avatar v-if="item?.icon !== ''" :item="item"></Avatar>
        <div class="flex flex-wrap items-center justify-center p-1" v-else
            :style="{ borderRadius: navigationStore.iconRadius + 'px',width:iconSize + 'px',height:iconSize + 'px' }" 
            style="border: 1px solid var(--divider);">
            <div class="flex flex-wrap items-center justify-center overflow-hidden " 
                v-for="(item, index) in list?.slice(0, 4)"
                :key="index"
                :style="{ 
                    marginRight: index == 3 || index == 1 ? '0px' : '4px',
                    borderRadius: (navigationStore.iconRadius / 4) + 'px',background: item.bg || '' }">
                <a-avatar :size="size" shape="square" :src="item.icon"
                    :style="[item.color]"></a-avatar>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed,toRefs } from 'vue'
import { useNavigationStore } from '../../navigationStore';
import Avatar from '../Avatar.vue';
const navigationStore = useNavigationStore()
const props = defineProps({
    iconList: Array,
    item: Object,
    iconSize:{
        type:Number,
        default:52
    }
})
const { item , iconSize } = toRefs(props)
const list = computed(() => {
    // console.log(props.iconList)
    return props.iconList?.filter((item)=>item !== null )
})

const size = computed(() => {
    return iconSize.value / 3
})
</script>
<style lang='scss' scoped></style>
