<template>
    <div class="w-full h-full">
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
                <xt-input 
                    v-else 
                    v-model:modelValue="inputValue" 
                    placeholder="搜索应用" 
                    @blur="closeSearch"
                    @enter="search">
                </xt-input> 
                
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
import { ref, computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

import { useAppCenterStore } from "../../store";

import { dropList, appsList } from './data'
import { useTransform } from './hooks/useTransform'
import { useMenus } from '../../../hooks/useMenus';
import { startApp } from '../../../../../ui/hooks/useStartApp';

// 导入组件
const Header = defineAsyncComponent(() => import('../../component/Header.vue'))
const DropDown = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/DropDown.vue'))
const Item = defineAsyncComponent(() => import('../../../../../components/desk/addIcon/components/SelectIcon.vue'))
const Empty = defineAsyncComponent( () => import('../../../../../components/desk/addIcon/components/Empty.vue'))

// 路由
const router = useRouter()

// 应用中心pinia数据
const store = useAppCenterStore()
const { myApps, startMenu, visible } = storeToRefs(store)

// 搜索相关
const isSearch = ref(false)
const inputValue = ref('')

// 当前选中
const currentItem = ref('')
// 应用列表
const appList = ref([])
// 分类后或者搜索后的数据
const list = ref([])

// 获取当前应用
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
        callBack: () => {
            addStartMenu(currentItem.value)
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

// 下拉默认数据
const defaultData = ref({
    id: "1",
    name:'酷应用',
    value:'coolApp'
})

// 监听下拉
watch(
    () => defaultData.value.value,
    (val) => {
        list.value = appList.value.filter((item) => item.type === val)
    },
    { immediate: true }
)

// 区分酷应用，轻应用，本地应用
const getInfo = (item) => {
    const { type } = item
    switch (type) {
        case 'localApp':
            return '本地应用'
        case 'coolApp':
            return '酷应用'
        case 'lightApp':
            return '轻应用'
        default:
            return '酷应用'
    }
}

// 初始化全部数据
onMounted(() => {
    appList.value = [...myApps.value,...appsList].map((item) => {
        return useTransform(item)
    })
    list.value = appList.value
})

// 打开搜索框
const openSearch = () => {
    isSearch.value = true
}

// 关闭搜索
const closeSearch = () => {
    isSearch.value = false
}

// 搜索
const search = () => {
    console.log(inputValue.value)
    list.value = appList.value.filter((item) => item.name.includes(inputValue.value) && item.type === defaultData.value.value)
}

// 删除
const delItem = (item) => {
    const index = appsList.findIndex((ele) => ele.name === item.name)
    // console.log(index,'index',item,appsList)
    if(index !== -1) {
        message.info(`${item.name}不能删除`)
    } else {
        myApps.value = myApps.value.filter((ele) => ele.name !== item.name)
        message.success(`${item.name}删除成功`)
    }
}

// 添加到开始菜单
const addStartMenu = (item) => {
    const index = startMenu.value.findIndex((ele) => ele.name === item.name)
    // console.log(index,'index',item,startMenu.value)
    if(index !== -1) {
        message.info(`${item.name}已经固定到开始菜单`)
    } else {
        startMenu.value.unshift(item)
        message.success(`${item.name}成功固定到开始菜单`)
    }
}

</script>
<style lang='scss' scoped></style>