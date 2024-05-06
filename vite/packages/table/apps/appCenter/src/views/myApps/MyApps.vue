<template>
    <div>
        <Header icon="fluent:building-shop-16-regular" title="我的应用">
            <template #right>
                <DropDown 
                    :list="dropList"
                    :defaultTitle="defaultData"
                />
                <xt-button 
                    w="32" 
                    h="32" 
                    radius="8" 
                    icon="fluent:search-16-regular"
                />
            </template>
        </Header>
        <Item :size="140" :isApp="true" :item="item"/>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, defineAsyncComponent } from 'vue'

import { dropList, defaultData } from './data'

const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))
const Item = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/SelectIcon.vue'))

const item = ref({
    type:'app',
    name:'测试应用',
    icon:'/logo.png',
    value:'team'
})

</script>
<style lang='scss' scoped></style>