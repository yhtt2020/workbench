<template>
    <div class="w-[188px] h-[188px] xt-bg-2 rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <div style="width: 32px; height: 32px;border-radius: 8px;" v-if="true"
                class="flex items-center justify-center rounded-lg s-item xt-bg-2">
                <!-- <navIcon :icon="item.icon" class="test" style="width:28px;height:28px;fill:var(--primary-text);"></navIcon> -->
            </div>
            <div v-else style="width: 45px; height: 45px" class="flex items-center justify-center">
                <!-- :src="renderIcon(item.icon)" -->
                <a-avatar :size="32" shape="square" ></a-avatar>
            </div>
        </div>
        <div class="text-base xt-text mt-3 mb-2">麦当劳之歌</div>
        <div class=" xt-text-2" style="font-size: 14px;">麦当劳之歌</div>
        <div class="absolute top-3 right-3">
            <xt-button :w="24" :h="24" style="background: var(--active-bg) !important;">
                <div class="flex justify-center items-center"><xt-new-icon icon="fluent:add-16-regular" class="xt-text"
                        size="20" style="padding:2px;margin-left:2px;margin-top:2px"></xt-new-icon></div>
                <!-- <div class="flex justify-center items-center" ><xt-new-icon icon="fluent:checkmark-16-regular" class="xt-text " size="20" style="padding:2px"></xt-new-icon></div> -->
            </xt-button>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const props=defineProps({
    
})
</script>
<style lang='scss' scoped></style>