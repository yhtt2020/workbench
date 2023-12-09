<template>
    <div class="w-[452px]">
        <div class="flex w-full p-4 mb-4 xt-bg-2 rounded-xl">
            <!-- :defaultIcon="" :menus="['goods']" -->
            <xt-selectIcon :defaultIcon="'fluent:music-note-2-16-regular'" v-model="modelValue"  ></xt-selectIcon>
            <div class="flex flex-col justify-start ml-5">
                <div>点击图标选择合适的icon、emoji，或上传自定义图片。</div>
                <div class="flex justify-start mt-1">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" class="reset" ></xt-new-icon>
                    <div class="ml-2 text-base reset">重置图标</div>
                </div>
            </div>
        </div>
        <!-- {{ navigationStore.colorSwitch }} -->
        <CustomIconBg :colorSwitch="navigationStore.colorSwitch" @update:colorSwitch="navigationStore.colorSwitch=!navigationStore.colorSwitch"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import {useNavigationStore} from '../../../navigationStore'
import SelectIcon from '../../../../../../ui/components/SelectIcon/index.vue'
import CustomIconBg from './CustomIconBg.vue'
const navigationStore=useNavigationStore()
const modelValue=ref(false)
</script>
<style lang='scss' scoped>
.reset{
    color: var(--active-bg);
}

</style>