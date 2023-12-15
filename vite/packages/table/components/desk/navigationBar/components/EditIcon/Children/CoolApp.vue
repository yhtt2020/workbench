<template>
    <div class="w-[452px]">
        <div class="w-full p-4 text-sm rounded-xl xt-text-2 xt-bg-2 h-[52px]" style="text-align: left;">当前图标为「酷应用」类型。</div>
        <div class="w-full p-4 mt-4 mb-4 rounded-xl xt-bg-2">
            <div class="text-base xt-text">应用模式</div>
            <div class="mt-2 mb-2 text-sm xt-text-2">选择应用打开方式，进入主应用或以窗口模式打开；部分应用在窗口模式下功能较为精简。</div>
            <RadioTab :navList="appModel" v-model:selectType="defaultModel" :bgColor="'xt-bg'" :height="40"/>
        </div>
        <EditName :editItem="props.editItem"></EditName>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import EditName from './EditName.vue'
import RadioTab from '../../../../../RadioTab.vue';
const appModel=ref([{title:"主应用模式",value:'main'},{title:'窗口模式',value:'window'}])
const defaultModel=ref({title:'主应用模式',value:'main'})
const props = defineProps({
    editItem: Object
})
</script>
<style lang='scss' scoped></style>