<template>
    <div class="w-full h-full">
        <Header 
            title="应用市场"
            icon="fluent:building-shop-16-regular"
        >
            <template #right>
                <xt-button w="98" h="32" radius="8" icon="">我要上架</xt-button>
                <xt-button w="127" h="32" radius="8" type="theme">全部应用（{{ recommendList.length }}）</xt-button>
            </template>
        </Header>
        <ImgList :list="adList"></ImgList>
        <div class="my-4 text-sm xt-text">推荐应用</div>
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
            <div class="flex flex-wrap gap-2">
                <Item :item="item" v-for="(item, index) in recommendList" :key="index" @download="download" @open="open"/>
            </div>
        </xt-scrollbar>
    </div>

    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia';

import Header from '../../component/Header.vue';
import { install } from './hooks/install';

import { useMarketStore } from './store/store';
import { message } from 'ant-design-vue';
import { appHelper } from './hooks/appHelper';

const appModel = window.$models.appModel

const store = useMarketStore()
const { recommendList, adList } = storeToRefs(store)

const ImgList = defineAsyncComponent(() => import('./components/ImgList.vue'))
const Item = defineAsyncComponent(() => import('./components/Item.vue'))

onMounted( async() => {
    await store.getRecommendList()
    await store.getAd()
    // setTimeout(() => {
    // }, 200);
    check(recommendList.value)
})

// 检查是否已经安装
const check = async(list) => {
    for(const item of list) {
        // item.isInstalled = await appModel.isInstalled(item.id)
        const allList = await appModel.getAllApps()
        item.isInstalled = allList.some(app => app.appid === item.id) 
        // console.log(item.isInstalled,'<<<')
    }
}

// 下载安装
const download = (item) => {
    // console.log(item,'<<<<<<')
    tsbApi.app.installAppConfirm(install(item.value.version.app.version).appJson,async(data) => {
        console.log(data)
        if(data.status) {
            store.downloadCount({appNanoid:item.id})
            // appModel.isInstalled(item.id).then(res => {
            //     console.log(res,'<<<')
            // })
            // appModel.getAllApps().then(res => {
            //     console.log(res,'<<<')
            // })
            message.success('安装成功')
        } else {
            message.error('安装失败')
        }
    })
}

// 打开
const open = async(val) => {
    console.log(val)
    const list = await appModel.getAllApps()
    const app = list.find(app => app.appid === val.id)
    tsbApi.app.run(app.nanoid,false,app)
}

</script>
<style lang='scss' scoped></style>