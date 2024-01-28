<template>
    <div class="w-[52px] h-[52px] ">
        <Avatar v-if="item.icon !== ''" :item="item"></Avatar>
        <div class="w-[52px] h-[52px] p-1 flex flex-wrap justify-center items-center" v-else
            :style="{ borderRadius: navigationStore.iconRadius + 'px' }" style="border: 1px solid var(--divider);">
            <div class=" w-[16px] h-[16px]   flex flex-wrap  justify-center items-center overflow-hidden" 
                v-for="(item, index) in list?.slice(0, 4)"
                :style="{ 
                    marginRight: index == 3 || index == 1 ? '0px' : '4px',
                    borderRadius: (navigationStore.iconRadius / 4) + 'px',background: item.bg || '' }">
                <xt-new-icon :icon="item.icon" size="16" v-if="item.linkIcon"></xt-new-icon>
                <a-avatar v-else :size="16" shape="square" :src="item.icon"
                    :style="[item.color]"></a-avatar>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed,toRefs } from 'vue'
import { useNavigationStore } from '../../navigationStore';
import Avatar from '../Avatar.vue';
const navigationStore = useNavigationStore()
const props = defineProps({
    iconList: Array,
    item: Object
})
const { item } = toRefs(props)
const list = computed(() => {
    // console.log(props.iconList)
    return props.iconList?.filter((item)=>item !== null )
})
</script>
<style lang='scss' scoped></style>
