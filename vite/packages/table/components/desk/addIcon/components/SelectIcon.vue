<template>
    <div @click="clickRightListItem(item, index)"
        class="w-[168px] h-[168px] rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3 pointer"
        :style="checked">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <div style="width: 64px; height:64px;border-radius: 8px;" 
                class="flex items-center justify-center rounded-lg ">
                <a-avatar :size="64" shape="square" src="/logo/chat.svg"></a-avatar>
            </div>
            <!-- <div v-else style="width: 45px; height: 45px" class="flex items-center justify-center">
                <a-avatar :size="32" shape="square" :src="renderIcon(item.icon)"></a-avatar>
            </div> -->
        </div>
        <div class="pl-3 pr-3 mt-3 mb-2 text-base xt-text omit-1">系统功能</div>
        <div class="pl-3 pr-3 text-sm text-center xt-text-2 omit">系统功能</div>
        <div class="absolute top-2 right-2">
            <xt-button
                w="32"
                h="32"
                radius="8"
                class="xt-bg"
            >
              <a-checkbox v-model:checked="isCheck"></a-checkbox>  
            </xt-button>
            
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
const isCheck = ref(false)

const checked = computed(() => {
    if (isCheck.value) {
        return {
            border: '1px solid var(--active-bg)',
            background: 'var(--active-secondary-bg)',
        };
    } else {
        return {
            background:'var(--secondary-bg)'
        };
    }
});


</script>
<style lang='scss' scoped></style>