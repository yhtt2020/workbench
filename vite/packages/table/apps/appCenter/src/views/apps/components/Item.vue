<template>
    <div class="w-[446px] h-[102px] rounded-xl p-3 xt-bg-2 flex justify-between items-center gap-1">
       <div class="flex items-center gap-4 ">
            <img :src="item.icon" alt="" class="w-[70px] h-[70px] rounded-xl">
            <div class="flex flex-col gap-1">
                <div class="text-base xt-text line-clamp-1">
                    {{ item.name }}
                </div>
                <div class="text-sm xt-text-2 line-clamp-2">{{ item.summary }}</div>
            </div>
        </div> 
        <div class="flex items-center gap-2">
            <template v-if="item.needInstall">
                <xt-button 
                    v-if="!checkInstalled(item)"
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
                
            </template>
            
        </div>
    </div>
    
</template>

<script setup lang='ts'>
import { computed, toRefs } from 'vue'
import { message } from 'ant-design-vue'

import { appsStore } from '../../../../../../store/apps';

import { runExec } from '../../../../../../js/common/exec';
import { usePlat } from '../../../../../../ui/hooks/usePlat';
import { useMenus } from '../../../../hooks/useMenus';

let fs
if (!usePlat('web') ) {
    fs= window.$models.fs
}

interface PropsType {
    item: {
        icon?: string,
        name?: string,
        summary?: string,
        needInstall?: boolean,
        data?: any,
        downloading?: boolean,
        percent?: number,
    }
}

const emit = defineEmits(['download'])

// 下载
const download = (app) => {
    emit('download', app)
}

const props = withDefaults(defineProps<PropsType>(), {
    item: () => ({})
});

const { item } = toRefs(props)

const store = appsStore()

// 打开酷应用
const executeApp = (app) => {
    store.openApp(app)
}

// 检查是否已经安装
const checkInstalled = (app) => {
    // 
    const path = app.installPath
    // console.log('检查是否安装',fs.existsSync(path),app,path)
    if(fs.existsSync(path)){
        return true
    }
}

// 打开本地应用
const executeLocalApp = (app) => {
    message.info(`正在打开${app.name}, 请稍后...`)
    runExec('"' + app.installPath + '"')
}

// 状态判断
const tagTitle = computed(() => {
    if(item.value.needInstall){
        if(item.value.downloading){
            return item.value.percent + '%'
        } else if(item.value.installing){
            return '正在安装'
        } else{
            return '下载运行'
        }
    }
})

const menu = computed(() => {
    const list = useMenus(1,item.value)
    return [list]
})

</script>
<style lang='scss' scoped></style>