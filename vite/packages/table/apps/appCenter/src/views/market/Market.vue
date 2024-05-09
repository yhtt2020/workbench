<template>
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
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'
import Header from '../../component/Header.vue';

const ImgList = defineAsyncComponent(() => import('./components/ImgList.vue'))

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


</script>
<style lang='scss' scoped></style>