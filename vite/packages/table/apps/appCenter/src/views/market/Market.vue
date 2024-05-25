<template>
    <div class="w-full h-full">
        <Header 
            title="应用市场"
            icon="fluent:building-shop-16-regular"
        >
            <template #right>
                <xt-button w="98" h="32" radius="8" icon="" @click="putaway">我要上架</xt-button>
                <xt-button w="127" h="32" radius="8" type="theme">全部应用（{{ recommendList.length }}）</xt-button>
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
                    @download="download" 
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
import { install } from './hooks/install';
import { updateValue } from './hooks/useUpdateValue'

import { useMarketStore } from './store/store';
import { useAppCenterStore } from '../../store';
import { message } from 'ant-design-vue';

import { appData } from '../developer/hooks/data';

import { usePlat } from '../../../../../ui/hooks/usePlat';
import { checkStatus } from '../apps/checkStatus';
const putaway = () => {
  ipc.send("executeApp", { app: JSON.parse(JSON.stringify(appData)) });
};

const appModel = window.$models.appModel

const store = useMarketStore()
const { recommendList, adList } = storeToRefs(store)

const appCenterStore = useAppCenterStore()
const { myApps } = storeToRefs(appCenterStore)

const ImgList = defineAsyncComponent(() => import('./components/ImgList.vue'))
const Item = defineAsyncComponent(() => import('./components/Item.vue'))

const target = ref(null)

onMounted( async() => {
    await store.getRecommendList()
    await store.getAd()
    check(recommendList.value)
})
// 检查是否已经安装
const check = async(list) => {
    for(const item of list) {
        if( !usePlat('web')) {
            const allList = await appModel.getAllApps()
            item.isInstalled = allList.find(app => app.appid === item.id)
        } else {
            item.isInstalled = false
        }
    }
}

// onUnmounted(() => {
//     recommendList.value = []
//     adList.value = []
// })

// 下载安装
const download = (item) => {
    if(!checkStatus()) return
    message.info('正在安装，请勿重复点击')
    tsbApi.app.installAppConfirm(install(item.value.version.app.version).appJson,async(data) => {
        if(data.status) {
            store.downloadCount({appNanoid:item.id})
            check(recommendList.value)
            message.success('安装成功')
            setTimeout(async() => {
                const target = await updateValue(item)
                myApps.value.unshift(target)
            }, 50);
        } else {
            message.error('安装失败')
        }
    })
}

// 打开
const open = async(val) => {
    if(!checkStatus()) return
    const list = await appModel.getAllApps()
    const app = list.find(app => app.appid === val.id)
    tsbApi.app.run(app.nanoid,false,app)
}

</script>
<style lang='scss' scoped></style>