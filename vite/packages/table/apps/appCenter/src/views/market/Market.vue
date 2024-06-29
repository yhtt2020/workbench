<template>
    <div class="w-full h-full">
        <Header 
            title="应用市场"
            icon="fluent:building-shop-16-regular"
        >
            <template #right>
                <xt-button w="98" h="32" radius="8" icon="" @click="putaway" v-if="!usePlat('web')">我要上架</xt-button>
                <xt-button w="127" h="32" radius="8" type="theme" @click="putaway" v-if="!usePlat('web')">全部应用（{{ searchApps?.length }}）</xt-button>
            </template>
        </Header>
        <ImgList :list="adList"></ImgList>
        <div class="my-4 text-sm xt-text">推荐应用</div>
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
            <div class="flex flex-wrap gap-2">
                <Item 
                    ref="target"
                    :item="item" 
                    v-for="(item, index) in recommendList" 
                    :key="index" 
                    @download="getDown" 
                    @open="open"
                    @goDetail="putaway"
                />
            </div>
        </xt-scrollbar>
    </div>

    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia';

import Header from '../../component/Header.vue';

import { useMarketStore } from './store/store';

import { appData } from '../developer/hooks/data';

import { usePlat } from '../../../../../ui/hooks/usePlat';
import { open, download } from './hooks/lightApp'
const putaway = () => {
  ipc.send("executeApp", { app: JSON.parse(JSON.stringify(appData)) });
};

let appModel
if(!usePlat('web')) {
    appModel = window.$models.appModel
}

const store = useMarketStore()
const { recommendList, adList, searchApps } = storeToRefs(store)

const ImgList = defineAsyncComponent(() => import('./components/ImgList.vue'))
const Item = defineAsyncComponent(() => import('./components/Item.vue'))

const target = ref(null)

onMounted( async() => {
    // 获取应用列表
    await store.getRecommendList()
    // 获取广告图片
    await store.getAd()
    // 通过搜索接口去获取全部应用
    await store.searchApp('')
    // 检查是否已经安装
    check(recommendList.value)
})
// 检查是否已经安装
const check = async(list) => {
    const allList = await appModel.getAllApps()
    for(const item of list) {
        if( !usePlat('web')) {
            console.log('allList>>>>:',allList)
            item.isInstalled = allList.find(app => app.appid === item.id)
        } else {
            item.isInstalled = false
        }
    }
}

// 用于测试
// onUnmounted(() => {
//     recommendList.value = []
//     adList.value = []
// })

// 下载安装
const getDown = (item) => {
    download(item, item.value.version.app.version, () => check(recommendList.value))
}

</script>
<style lang='scss' scoped></style>