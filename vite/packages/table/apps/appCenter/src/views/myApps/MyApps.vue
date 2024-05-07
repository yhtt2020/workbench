<template>
    <div>
        <Header icon="fluent:building-shop-16-regular" title="我的应用">
            <template #right>
                <DropDown 
                    :list="dropList"
                    v-model:defaultTitle="defaultData"
                />
                <xt-button 
                    v-if="!isSearch"
                    w="32" 
                    h="32" 
                    radius="8" 
                    icon="fluent:search-16-regular"
                    @click="openSearch"
                />
                <xt-input v-else v-model:value="inputValue"></xt-input> 
                
            </template>
        </Header>
        <div class="flex flex-wrap gap-2 mt-4" v-if="list.length > 0">
            <template v-for="(item, index) in list" :key="index">
                <xt-menu :menus="menus" @onMounted="getItem(item)">
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
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { useAppCenterStore } from "../../store";

import { dropList, appsList } from './data'
import { useTransform } from './hooks/useTransform'
import { useMenus } from '../../../hooks/useMenus';
import { startApp } from '../../../../../ui/hooks/useStartApp';

const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))
const Item = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/SelectIcon.vue'))
const Empty = defineAsyncComponent( () => import('../../../../../components/desk/addIcon/components/Empty.vue'))

const router = useRouter()

const store = useAppCenterStore()
const { myApps, startMenu, visible } = storeToRefs(store)

const isSearch = ref(false)
const inputValue = ref('')

const currentItem = ref('')

const getItem = (item) => {
    currentItem.value = item
}

// 右键菜单
const arr = ref([
    {
        label:'打开',
        id:"1",
        newIcon: "fluent:open-16-regular",
        callBack: () => {
            const { type , value } = currentItem.value
            startApp(type, value, router)
            visible.value = false
        }
    },
    {
        label:'固定到开始菜单',
        id:"2",
        newIcon: "fluent:grid-16-regular",
        callBack: (item) => {
            // console.log('固定到开始菜单',currentItem.value)
            startMenu.value.unshift(currentItem.value)
        }
    },
    {
        label:'删除',
        id:"4",
        newIcon: "fluent:delete-16-regular",
        color: '#f56c6c',
        callBack: () => {
            // console.log('删除')
            delItem(currentItem.value)
        }
    }
])

// 右键菜单
const menus = computed(() => {
    const list = useMenus(3,currentItem.value)
    const menu = [list, ...arr.value]
    return menu.sort((a, b) => a.id - b.id)
})

// 我的应用数据
const list = computed(() => {
    const arr = [...myApps.value,...appsList].map((item) => {
        return useTransform(item)
    })
    console.log(arr,'transform arr')
    return arr
    
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

const openSearch = () => {
    isSearch.value = true
}

// 删除
const delItem = (item) => {
    const index = appsList.findIndex((ele) => ele.name === item.name)
    console.log(index,'index',item,appsList)
    if(index !== -1) {
        message.info(`${item.name}不能删除`)
    } else {
        myApps.value = myApps.value.filter((ele) => ele.name !== item.name)
        message.success(`${item.name}删除成功`)
    }
}

</script>
<style lang='scss' scoped></style>