<template>
    <div class="w-[452px] xt-bg-2 rounded-xl p-4 ">
        <div class="flex justify-start">
            <div class="text-base xt-text">图标名称</div>
            <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" class="ml-1" @click="reset"></xt-new-icon>
        </div>
        <div class="mt-2 text-base xt-text-2">
            修改当前引用图标名称
        </div>
        <a-input allow-clear v-model:value="props.editItem.name" placeholder="请输入图标名称" class="h-[40px]  w-full mt-3 input"
            style="border-radius: 12px; border: 1px solid var(--divider);background: var(--main-bg);"></a-input>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import { navStore } from '../../../../../../store/nav';
const useNavStore = navStore()
const props = defineProps({
    editItem: Object
})
const reset = () => {
    const target = navigationList.value.find(item => item.value === props.editItem.value)
    props.editItem.name = target?.name
}
const navigationList = computed(() => {
    return [...useNavStore.footNavigationList,...useNavStore.sideNavigationList,...useNavStore.rightNavigationList]
})
</script>
<style lang='scss' scoped>
.input{
    border-radius: 10px;
    border: 1px solid var(--divider);
    // background: var(--secondary-bg);
    font-size: 14px;
}
:deep(.ant-input){
    color: var(--primary-text) !important;
    & ::placeholder{
        color: var(--secondary-text);
    }
}
:deep(.ant-input-suffix){
    color: var(--primary-text) !important;
}
</style>