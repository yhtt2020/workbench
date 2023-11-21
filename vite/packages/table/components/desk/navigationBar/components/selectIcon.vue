<template>
    <div class="w-[188px] h-[188px] xt-bg-2 rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <a-avatar shape="square" :size="32"> </a-avatar>
        </div>
        <div class="text-base xt-text mt-3 mb-2">麦当劳之歌</div>
        <div class=" xt-text-2" style="font-size: 14px;">麦当劳之歌</div>
        <div class="absolute top-4 right-4">
          <xt-button :w="16" :h="16" style="background: var(--active-bg) !important;">
            <div class="flex justify-center items-center"><xt-new-icon icon="fluent:add-16-regular" class="xt-text" size="16"></xt-new-icon></div>
            <!-- <div><xt-new-icon icon="fluent:checkmark-16-regular"></xt-new-icon></div> -->
          </xt-button>  
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>
<style lang='scss' scoped></style>