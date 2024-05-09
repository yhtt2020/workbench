<template>
    <div class="flex flex-wrap gap-3">
        <template v-for="(item,index) in list" :key="index">
            <xt-menu :menus="arr" @onMounted="getItem(item)">
                <Item 
                    :bg="bg"
                    :item="item" 
                    :size="100"
                    @clickItem="open"
                />
            </xt-menu>
        </template>
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAppCenterStore } from "../../../../../apps/appCenter/src/store";

import { startApp } from '../../../../../ui/hooks/useStartApp';
import { useMenus } from '../../../../../apps/appCenter/hooks/useMenus';

const appCenterStore = useAppCenterStore()
const { startMenu } = storeToRefs(appCenterStore)

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    bg: {
        type: String,
    },
    // 是否是开始菜单，用于右键菜单的取消固定
    isStartMenu: {
        type: Boolean,
        default: true
    }
    
})

const Item = defineAsyncComponent(() => import('./Item.vue'))

const router = useRouter()

// 当前选中的应用
const currentItem = ref('')

// 右键菜单数据
const arr = computed(() => {
    const list = [
        {
            label:'打开',
            id:"1",
            newIcon: "fluent:open-16-regular",
            callBack: () => {
                open(currentItem.value)
            }
        },
        {
            label:'取消固定',
            id:"2",
            disabled:!props.isStartMenu,
            newIcon: "fluent:grid-16-regular",
            callBack: () => {
                delStartMenu(currentItem.value)
            }
        }
    ]
    const menus = useMenus(3,currentItem.value)
    return [menus,...list].sort((a,b) => a.id - b.id)  
})

// 打开应用
const open = (item) => {
    item.lastUseTime = Date.now()
    startApp(item.type,item.value,router)
    console.log(item,'open item')
}

// 取消固定
const delStartMenu = (item) => {
    console.log(item,'取消固定')
    startMenu.value = startMenu.value.filter(i => i.id !== item.id)
}

// 获取当前应用
const getItem = (item) => {
    currentItem.value = item
}



</script>
<style lang='scss' scoped></style>