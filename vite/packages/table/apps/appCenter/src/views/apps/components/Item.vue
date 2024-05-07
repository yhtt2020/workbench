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
                    icon="fluent:arrow-download-16-regular"
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                    @click = 'download(item)'
                >
                    {{ tagTitle }}
                </xt-button>
                <template v-else>
                <xt-button 
                    w="72" 
                    h="32" 
                    radius="8" 
                    icon="fluent:open-16-regular"
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                    @click = 'executeLocalApp(item)'
                >
                    打开
                </xt-button>
                <xt-button 
                    w="32"
                    h="32"
                    radius="8"
                    icon="fluent:add-16-regular"
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                />
            </template>
                
            </template>
            
            <template v-else>
                <xt-button 
                    w="72" 
                    h="32" 
                    radius="8" 
                    icon="fluent:open-16-regular"
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                    @click = 'executeApp(item.data)'
                >
                    打开
                </xt-button>
                <xt-button 
                    w="32"
                    h="32"
                    radius="8"
                    icon="fluent:add-16-regular"
                    :iconSize="'16'"
                    style="background-color: var(--primary-bg) ;"
                />
            </template>
            
        </div>
    </div>
    
</template>

<script setup lang='ts'>
import { ref, onMounted, computed, watch, toRefs } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import { appsStore } from '../../../../../../store/apps';

import { runExec } from '../../../../../../js/common/exec';
import { usePlat } from '../../../../../../ui/hooks/usePlat';
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
const download = (app) => {
    emit('download', app)
}

const props = withDefaults(defineProps<PropsType>(), {
    item: () => ({})
});

const { item } = toRefs(props)

const store = appsStore()

const executeApp = (app) => {
    store.openApp(app)
}

// 检查是否已经安装
const checkInstalled = (app) => {
    console.log('检查是否安装',fs.existsSync(app.installPath))
    if(fs.existsSync(app.installPath)){
        return true
    }
}

const executeLocalApp = (app) => {
    runExec('"' + app.installPath + '"')
}

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

</script>
<style lang='scss' scoped></style>