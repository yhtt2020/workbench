<template>
    <div class="w-[452px]">
        <div class="flex w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <SelectIcon @isIconShow="iconVisible = false" :goodVisible="true" :windowHeight="innerHeight" @getAvatar="getAvatar" v-show="iconVisible" :isCustom="isCustom" :customTitle="customTitle"></SelectIcon>
            <div class="flex flex-col justify-start ml-5">
                <div>点击图标选择合适的icon、emoji，或上传自定义图片。</div>
                <div class="flex justify-start mt-1">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" class="reset" ></xt-new-icon>
                    <div class="ml-2 text-base reset">重置图标</div>
                </div>
            </div>
        </div>
        <CustomIconBg />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import CustomIconBg from './CustomIconBg.vue'
const iconVisible=ref(false)

const getAvatar=ref('')
const isCustom=ref(false)
const customTitle=ref('')
</script>
<style lang='scss' scoped>
.reset{
    color: var(--active-bg);
}

</style>