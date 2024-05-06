<template>
    <div class="w-[446px] h-[102px] rounded-xl p-3 xt-bg-2 flex justify-between items-center gap-1">
       <div class="flex items-center gap-4 ">
            <img :src="item.icon" alt="" class="w-[70px] h-[70px] rounded-xl">
            <div class="flex flex-col gap-1">
                <div class="text-base xt-text line-clamp-1">
                    {{ item.name }}
                    <a-tag color="#ff5500cc" style="border-radius: 8px !important;" v-if="item.data.type === 'system'">系统</a-tag>
                    <a-tag color="#87d068cc" style="border-radius: 8px !important;" v-else-if="item.needInstall">软件</a-tag>
                    <a-tag color="black" style="border-radius: 8px !important;" v-else-if="item.data.type === 'game'">游戏</a-tag>
                    <a-tag color="#108ee9cc" style="border-radius: 8px !important;" v-else>网页</a-tag>
                </div>
                <div class="text-sm xt-text-2 line-clamp-2">{{ item.summary }}</div>
            </div>
        </div> 
        <div class="flex items-center gap-2">
            <xt-button 
                w="100" 
                h="32" 
                radius="8" 
                class="xt-bg" 
                icon="fluent:arrow-download-16-regular"
                :iconSize="'16'"
                style="background-color: var(--primary-bg) ;"
                @click = 'download'
            >
                下载安装
            </xt-button>
            <xt-button 
                w="72" 
                h="32" 
                radius="8" 
                icon="fluent:open-16-regular"
                :iconSize="'16'"
                style="background-color: var(--primary-bg) ;"
                @click = 'download'
            >打开
            </xt-button>
            <xt-button 
                w="32"
                h="32"
                radius="8"
                icon="fluent:add-16-regular"
                :iconSize="'16'"
                style="background-color: var(--primary-bg) ;"
            />
        </div>
    </div>
    
</template>

<script setup lang='ts'>
import { emit } from 'process';
import { ref, reactive } from 'vue'

const emit = defineEmits(['download'])

interface PropsType {
    item: {
        icon?: string,
        name?: string,
        summary?: string,
        needInstall?: boolean,
        data?: any
    }
}

const props = withDefaults(defineProps<PropsType>(), {
    item: () => ({})
});

const download = () => {
    console.log('下载')
    emit('download',props.item)
}

</script>
<style lang='scss' scoped></style>