<template>
    <div class="flex flex-wrap gap-3 mt-3">
        <template v-for="(item,index) in list" :key="index">
            <div class="relative">
               <img 
                    @click="open(item.url)"
                    :src="item.img" 
                    alt=""  
                    class="w-[444px] h-[259px] rounded-xl object-cover cursor-pointer"
                > 
                <!-- <div class="absolute max-w-[220px] h-[68px] rounded-xl xt-bg-2 flex flex-col bottom-4 left-4 p-2 justify-between pointer">
                    <div class="text-xl xt-text line-clamp-1 font">{{ item.tip }}</div>
                    <div class="text-xl xt-text-2 line-clamp-1 font">{{ item.desc }}</div>
                </div> -->
            </div>
        </template>
    </div>
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue'

import browser from "../../../../../../js/common/browser";

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const { list } = toRefs(props)

const open = (url: string) => {
    // window.open(url)
    browser.openInUserSelect(url)
}

</script>
<style lang='scss' scoped>
.font {
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
}
</style>