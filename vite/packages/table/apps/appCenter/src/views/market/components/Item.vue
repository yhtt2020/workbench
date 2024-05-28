<template>
    <div class="flex items-center justify-between gap-1 p-3 rounded-xl xt-bg-2" :class="[boxClass]" :style="{height: sizeStyle.h + 'px'}">
       <div class="flex items-center gap-4 ">
            <img :src="item.icon" alt="" class="rounded-xl" :style="{width: sizeStyle.size + 'px', height: sizeStyle.size + 'px'}">
            <div class="flex flex-col gap-1 pointer" @click="goDetail(item)">
                <div class="xt-text line-clamp-1" :style="{fontSize:sizeStyle.text + 'px'}">
                    {{ item.name }}
                </div>
                <div class="text-sm xt-text-2 line-clamp-2">{{ item.summary }}</div>
            </div>
        </div> 
        <div class="flex items-center gap-2">
            <!-- <template v-if="item.needInstall"> -->
                <xt-button 
                    v-if="!item.isInstalled"
                    w="100" 
                    h="32" 
                    radius="8" 
                    class="xt-bg" 
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                    @click = 'download(item)'
                >
                    <div class="flex items-center gap-1">
                        <xt-new-icon icon="fluent:arrow-download-16-regular" size="16"></xt-new-icon>
                        {{ tagTitle }}
                    </div>
                </xt-button>
                <template v-else>
                    <xt-button 
                        w="72" 
                        h="32" 
                        radius="8" 
                        :iconSize="'16'"
                        style="background-color: var(--primary-bg) ;"
                        @click = 'executeLocalApp(item)'
                    >
                        <div class="flex items-center gap-1">
                            <xt-new-icon icon="fluent:open-16-regular" size="16"></xt-new-icon>
                            打开
                        </div>
                    </xt-button>
                    <xt-menu :menus="menu" model="click">
                        <xt-button 
                            w="32"
                            h="32"
                            radius="8"
                            icon="fluent:add-16-regular"
                            :iconSize="'16'"
                            style="background-color: var(--primary-bg) ;"
                        />
                    </xt-menu>
                    
                </template>
                
            <!-- </template> -->
            
        </div>
    </div>
    
</template>

<script setup lang='ts'>
import { computed, toRefs, onMounted } from 'vue'

import { useMenus } from '../../../../hooks/useMenus';
import { usePlat } from '../../../../../../ui/hooks/usePlat';

let appModel
if(!usePlat('web')) {
    appModel = window.$models.appModel
}

// onMounted(() =>{
//     console.log(props.item,'<<<<<<<<<<')
// })

interface PropsType {
    item: {
        icon?: string,
        name?: string,
        summary?: string,
        isInstalled?: boolean,
        data?: any,
        downloading?: boolean,
        percent?: number,
    },
    boxClass: string,
    // 整体样式调整
    sizeStyle:{
        h:number | string,
        size:number | string,
        text:number | string,
    }
}

const emit = defineEmits(['download','open', 'goDetail'])

// 下载
const download = (app) => {
    emit('download', app)
}

const props = withDefaults(defineProps<PropsType>(), {
    item: () => ({}),
    boxClass:'w-[446px]',
    sizeStyle: () => ({
        h: 102,
        size: 70,
        text: 16
    })
});

const { item, sizeStyle } = toRefs(props)


// 打开本地应用
const executeLocalApp = (app) => {
    emit('open',app)
}

// 状态判断
const tagTitle = computed(() => {
    return '安装'
})

// 产品详情
const goDetail = (item) => {
    emit('goDetail',item)
}

// 右键菜单
const menu = computed(() => {
    const list = useMenus(1,item.value, cb)
    return list
})

const cb = async(item) => {
    if(usePlat('web')) return
    const list = await appModel.getAllApps()
    const target = list.find(app => app.appid === item.id)
    item.value = target
}

</script>
<style lang='scss' scoped></style>