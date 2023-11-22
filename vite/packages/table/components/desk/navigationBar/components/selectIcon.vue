<template>
    <div class="w-[188px] h-[188px] xt-bg-2 rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3 pointer">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <div style="width: 32px; height: 32px;border-radius: 8px;" v-if="item.type==='systemApp'"
                class="flex items-center justify-center rounded-lg s-item ">
                <navIcon :icon="item.icon" class="test" style="width:28px;height:28px;fill:var(--primary-text);"></navIcon>
            </div>
            <div v-else style="width: 45px; height: 45px" class="flex items-center justify-center">
                <!--  -->
                <a-avatar :size="32" shape="square" :src="renderIcon(item.icon)"></a-avatar>
                
            </div>
            <!-- {{ item }} -->
        </div>
        <div class="mt-3 mb-2 text-base xt-text">{{ item.name }}</div>
        <div class=" xt-text-2" style="font-size: 14px;">{{ props.recommendation.name }}</div>
        <div class="absolute top-3 right-3">
            <xt-button :w="24" :h="24" style="background: var(--active-bg) !important;">
                <div class="flex items-center justify-center"><xt-new-icon icon="fluent:add-16-regular" class="xt-text"
                        size="20" style="padding:2px;margin-left:2px;margin-top:2px"></xt-new-icon></div>
                <!-- <div class="flex items-center justify-center" ><xt-new-icon icon="fluent:checkmark-16-regular" class="xt-text " size="20" style="padding:2px"></xt-new-icon></div> -->
            </xt-button>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import {Icon as navIcon} from '@iconify/vue'
import {renderIcon} from '../../../../js/common/common'
const props=defineProps({
    item:{
        type:Object
    },
    recommendation:{
        type:String
    }
})
</script>
<style lang='scss' scoped></style>