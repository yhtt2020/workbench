<template>
    <div class="w-[452px]">
        <div class="w-full p-4 text-sm rounded-xl xt-text-2 xt-bg-2 h-[52px] mb-4" style="text-align: left;">当前图标为「自定义」类型</div>
        <EditName :editItem="props.editItem"></EditName>
        <div class="w-full h-[323px] rounded-xl xt-bg-2 mt-4 p-4">
            <div class="text-base xt-text">图标链接</div>
            <div class="mt-2 mb-2 text-sm xt-text-2">自定义图标打开链接，支持网站地址或本地文件快捷方式类型。</div>
            <RadioTab :navList="iconLink" v-model:selectType="defaultLink" :bgColor="'xt-bg'" :height="40"/>
            <a-input allow-clear v-model:value="linkValue" placeholder="请输入网址" class="h-[40px]  w-full mt-3 input"></a-input>
            <!-- <hr class="mt-4 h-[1px] mb-4" style="background-color: var(--divider);"> -->
            <div class="w-full h-[1px] mt-4 mb-4" style="background: var(--divider);"></div>
            <div class="text-base xt-text">打开方式</div>
            <div class="mt-2 mb-2 text-sm xt-text-2">选择链接打开方式。</div>
            <RadioTab :navList="openWay" v-model:selectType="defaultWay" :bgColor="'xt-bg'" :height="40"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,onMounted } from 'vue'
import RadioTab from '../../../../../RadioTab.vue';
import EditName from './EditName.vue';
const iconLink=ref([{title:'网站链接',value:'link'},{title:'系统程序或文件',value:'system'}])
const openWay = ref([{title:'内置浏览器',value:"inner"},{title:"默认浏览器",value:"default"},{title:'想天浏览器',value:"xt"}])
const defaultLink=ref({title:'网站链接',value:"link"})
const defaultWay=ref({title:'默认浏览器',value:"default"})
const linkValue=ref('')
const props=defineProps({
    editItem:Object
})
onMounted(()=>{
    linkValue.value=props.editItem.url
})
</script>
<style lang='scss' scoped>
.input{
    border-radius: 10px;
    border: 1px solid var(--divider);
    color: var(--secondary-text) !important;
    background: var(--primary-bg);
    & ::placeholder{
        color: var(--secondary-text);
    }
}
:deep(.ant-input-suffix){
    color: var(--secondary-text) !important;
}
</style>