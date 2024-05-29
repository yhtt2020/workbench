<template>
    <div :style="{width:iconSize + 'px',height:iconSize + 'px'}">
        <Avatar v-if="item?.icon !== ''" :item="item" :size="iconSize"></Avatar>
        <div class="flex flex-wrap items-center justify-center p-1" v-else
            :style="{ 
                borderRadius: navigationStore.iconRadius + 'px',
                width:iconSize + 'px',
                height:iconSize + 'px' 
                }" 
            style="border: 1px solid var(--divider);">
            <div class="relative flex flex-wrap items-center justify-center overflow-hidden" 
                v-for="(item, index) in list?.slice(0, 4)"
                :key="index"
                :style="{ 
                    marginRight: index == 3 || index == 1 ? '0px' : '4px',
                    borderRadius: (navigationStore.iconRadius / 4) + 'px',background: item.bg || '' 
                }">

                <a-avatar 
                    v-if="!checkIsIfyIcon(item.icon).value"
                    :size="size" 
                    shape="square" 
                    :src="item.icon"
                    :style="[item.color]">
                </a-avatar>
                <xt-new-icon
                    :size="size"
                    v-else-if="checkIsIfyIcon(item.icon).value"
                    :icon="item.icon"
                    :style="[item.color]">
                </xt-new-icon>
                <img 
                    v-if="checkIsIfyIcon(item.icon).value"
                    src="/public/icons/tag.png" 
                    alt="" 
                    class="absolute w-[8px]" 
                    style="top:-1px;right:-1px"
                >
                
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed,toRefs } from 'vue'
import { useNavigationStore } from '../../navigationStore';
import Avatar from '../Avatar.vue';
import { checkIsIfyIcon } from '../../../../card/hooks/addCardToNav'
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
