<template>
    <div @click="clickRightListItem(item, index)"
        class="w-[168px] h-[168px] rounded-xl flex justify-center items-center flex-col relative pointer"
        :style="checked">
        <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
            <div style="width: 64px; height:64px;border-radius: 8px;" 
                class="flex items-center justify-center rounded-lg ">
                <a-avatar :size="64" shape="square" :src="item.icon"></a-avatar>
            </div>
        </div>
        <div class="pl-3 pr-3 mt-3 mb-2 text-base xt-text omit-1">{{ item.name }}</div>
        <div class="pl-3 pr-3 text-sm text-center xt-text-2 omit">{{ info }}</div>
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
import { ref, computed,toRefs } from 'vue'

const props = defineProps({
    item: Object,  // 图标对象
    info: String,  // 图标提示  
})
const { item, info } = toRefs(props)

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
<style lang='scss' scoped>
.omit-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: block;
    /* 使用块级元素 */
    max-width: 150px;
    /* 设置适当的最大宽度 */
    white-space: nowrap;
}
</style>