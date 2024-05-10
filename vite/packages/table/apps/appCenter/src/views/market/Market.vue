<template>
    <div class="w-full h-full">
        <Header 
            title="应用市场"
            icon="fluent:building-shop-16-regular"
        >
            <template #right>
                <xt-button w="98" h="32" radius="8" icon="">我要上架</xt-button>
                <xt-button w="127" h="32" radius="8" type="theme">全部应用（{{ 98 }}）</xt-button>
            </template>
        </Header>
        <ImgList :list="list"></ImgList>
        <div class="my-4 text-sm xt-text">推荐应用</div>
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
            <div class="flex flex-wrap gap-2">
                <Item :item="item" v-for="(item, index) in lightApp" :key="index"/>
            </div>
        </xt-scrollbar>
    </div>

    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import Header from '../../component/Header.vue';
import { usePlat } from '../../../../../ui/hooks/usePlat';
import { useReplace } from '../../../../../components/desk/addIcon/hook/useReplace';
import { mergeData } from '../../../../../ui/hooks/useDataConversion';


const appModel = window.$models.appModel

const ImgList = defineAsyncComponent(() => import('./components/ImgList.vue'))
const Item = defineAsyncComponent(() => import('../apps/components/Item.vue'))

const list = ref([
    {
        img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        tip:'DropSpace',
        desc: 'NEW',
    },
    {
        img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        tip:'艺术创想-免费AI绘图软件',
        desc: 'NEW',
    },
])

const lightApp = ref([])

onMounted( async() => {
    if(!usePlat('web')){
      lightApp.value =await appModel.getAllApps() 
    } else {
      lightApp.value = []
    }
    // 添加图标类型
    addType(lightApp.value)
    // 替换图标数据字段
    lightApp.value = useReplace(lightApp.value)
    // 替换统一图标数据字段
    lightApp.value = lightApp.value.map((item) => {
        return mergeData(item)
    })
})

const addType = (list:string[]) => {
    list.forEach((item) => {
        if(item.icon) return
        item.type = 'lightApp'
        item.icon = item.logo
    })
}

</script>
<style lang='scss' scoped></style>