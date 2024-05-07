<template>
    <div>
        <Header icon="fluent:building-shop-16-regular" title="我的应用">
            <template #right>
                <DropDown 
                    :list="dropList"
                    v-model:defaultTitle="defaultData"
                />
                <xt-button 
                    w="32" 
                    h="32" 
                    radius="8" 
                    icon="fluent:search-16-regular"
                />
            </template>
        </Header>
        <div class="flex flex-wrap gap-2 mt-4" v-if="list.length > 0">
            <template v-for="(item, index) in list" :key="index">
                <xt-menu :menus="menus">
                    <Item :size="140" :isApp="true" :item="item" :info="getInfo(item)"/> 
                </xt-menu>
            </template>
        </div>
        <Empty v-else />
        
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useAppCenterStore } from "../../store";

import { dropList, appsList } from './data'
import { useMenus } from '../../../hooks/useMenus';

const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))
const Item = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/SelectIcon.vue'))
const Empty = defineAsyncComponent( () => import('../../../../../components/desk/addIcon/components/Empty.vue'))

const store = useAppCenterStore()
const { myApps } = storeToRefs(store)

// 右键菜单
const arr = ref([
    {
        label:'打开',
        id:"1",
        newIcon: "fluent:open-16-regular",
        callBack: () => {
            console.log('打开')
        }
    },
    {
        label:'固定到开始菜单',
        id:"2",
        newIcon: "fluent:grid-16-regular",
        callBack: () => {
            console.log('固定到开始菜单')
        }
    },
    {
        label:'删除',
        id:"4",
        newIcon: "fluent:delete-16-regular",
        color: '#f56c6c',
        callBack: () => {
            console.log('删除')
        }
    }
])

// 右键菜单
const menus = computed(() => {
    const list = useMenus(3)
    const menu = [list, ...arr.value]
    return menu.sort((a, b) => a.id - b.id)
})

// 
const list = computed(() => {
    return [
        ...myApps.value,
        ...appsList
    ]
}) 

const defaultData = ref({
    id: "1",
    name:'系统应用',
    value:'systemApp'
})

const getInfo = (item) => {
    if(item.data?.type){
        return '系统应用'
    } else {
        return '酷应用'
    }
}

</script>
<style lang='scss' scoped></style>