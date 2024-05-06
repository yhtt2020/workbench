<template>
    <div class="flex flex-col w-full h-full">
        <Header 
            icon="fluent:desktop-16-regular"
            title="实用软件"
        >
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
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
            <div class="flex flex-wrap gap-2 mt-4">
                <Item :item="item" v-for="item in appsList"/>
            </div>
        </xt-scrollbar>
    </div>
    
    
</template>

<script setup lang='ts'>
import { ref, reactive, defineAsyncComponent } from 'vue'
import { appsList } from './data'
import { dropList, defaultData } from '../myApps/data'

const Item = defineAsyncComponent(() => import('./components/Item.vue'))
const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))

</script>
<style lang='scss' scoped></style>