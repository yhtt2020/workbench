<template>
    <div class="w-[452px]">
        <div class="w-full p-4 text-sm rounded-xl xt-text-2 xt-bg-2 h-[52px] mb-4" style="text-align: left;">当前图标为「自定义」类型
        </div>
        <!-- <EditName :editItem="props.editItem"></EditName> -->
        <div class="w-full h-[323px] rounded-xl xt-bg-2 mt-4 p-4">
            <div class="text-base xt-text">图标链接</div>
            <div class="mt-2 mb-2 text-sm xt-text-2">自定义图标打开链接，支持网站地址或本地文件快捷方式类型。</div>
            <RadioTab :navList="iconLink" v-model:selectType="defaultLink" :bgColor="'xt-bg'" :height="40" />
            <a-input spellcheck="false" allow-clear v-model:value="linkValue" placeholder="请输入网址"
                class="h-[40px]  w-full mt-3 input"></a-input>
            <!-- <hr class="mt-4 h-[1px] mb-4" style="background-color: var(--divider);"> -->
            <div class="w-full" v-if="editItem.type !== 'tableApp'">
                <div class="w-full h-[1px] mt-4 mb-4" style="background: var(--divider);"></div>
                <div class="text-base xt-text">打开方式</div>
                <div class="mt-2 mb-2 text-sm xt-text-2">选择链接打开方式。</div>
                <!-- <RadioTab :navList="openWay" v-model:selectType="defaultWay" :bgColor="'xt-bg'" :height="60" /> -->
                <dropDown :list="data" v-model:mode="defaultWay"></dropDown>
            </div>

        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
// import RadioTab from '../../../../../RadioTab.vue';
// import EditName from './EditName.vue';
const dropDown = defineAsyncComponent(() => import('../../dropDown/DropDown.vue'))
import {data} from '../../dropDown/Data'
const iconLink = ref([{ title: '网站链接', name: 'link' }, { title: '系统程序或文件', name: 'tableApp' }, { title: '快捷指令', name: 'action' }])
const openWay = ref([
  { title: "系统默认", name: "default" },
  { title: '工作台内', name: "internal" },
  { title: '想天浏览器', name: "thinksky" },
  {
    title:'手机模式',name:'mob'
  }])
const defaultLink = ref({ title: '网站链接', name: "link" })
const defaultWay = ref("default")
const linkValue = ref('')
const props = defineProps({
    editItem: Object
})
onMounted(() => {
    linkValue.value = props.editItem.value
    defaultWay.value = data.find((item) => item.value === props.editItem.type)?.value || defaultWay.value
    defaultLink.value = iconLink.value.find((item) => item.name === props.editItem.type) || defaultLink.value

})
watch(() => defaultWay.value, () => {
    if (props.editItem.type === 'tableApp') {
        return
    }
    props.editItem.type = defaultWay.value
})
watch(() => linkValue.value, () => {
    if (props.editItem.type === 'tableApp') {
        return
    }
    props.editItem.value = linkValue.value
})
</script>
<style lang='scss' scoped>
.input {
    border-radius: 10px;
    border: 1px solid var(--divider);
    // background: var(--secondary-bg);
    font-size: 14px;
}

:deep(.ant-input) {
    color: var(--primary-text) !important;

    & ::placeholder {
        color: var(--secondary-text);
    }
}

:deep(.ant-input-suffix) {
    color: var(--primary-text) !important;
}</style>
