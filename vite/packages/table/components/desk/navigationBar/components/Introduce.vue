<template>
    <div class="w-full h-full">
        <div>
            <div class="flex justify-center"><xt-new-icon icon="fluent-emoji:rocket" size="50" /></div>
            <div class="flex justify-between xt-bg-2 p-2 rounded-lg mt-5">
                <div class="xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
                <div class="pointer" style="color:var(--active-bg)">全部添加</div>
            </div>

        </div>
        <div class="mt-3 flex flex-wrap">
            <selectIcon v-for="index in 12" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import selectIcon from './selectIcon.vue'
</script>
<style lang='scss' scoped></style>