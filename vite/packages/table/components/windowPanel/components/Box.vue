<template>
    <div 
        @click="openMain"
        class="w-[40px] h-[40px] xt-bg rounded-lg flex flex-wrap relative" 
        style="gap: 4px;padding: 6px">
        <template v-for="(item,index) in list.slice(0,3)" :key="index" >
            <xt-new-icon :icon="item.icon" size="12" v-if="item.icon"></xt-new-icon>
            <a-avatar :size="12" :src="item.avatar" v-else-if="item.avatar"></a-avatar>
        </template>
        <xt-new-icon icon="fluent:more-horizontal-16-regular" size="12"></xt-new-icon>
        
    </div>
    <div 
        :class="mainClass"
        v-if="mainVisible"
        style="border: 1px solid var(--divider);gap: 12px;"
        class="absolute h-[52px] xt-bg flex p-3 rounded-lg">
        <Item v-for="item in list" :key="item.name" :item="item"></Item>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

import Item from './Item.vue'

type propsType = {
    list: Array<any>,
    mainClass:string
}

const props = withDefaults(defineProps<propsType>(), {
    list: [
        {
            icon:'fluent:box-16-regular',
            tip:'',
            name:'快递',
            w:60,
            fn:() => {
                console.log('快递')
            }
        },
        {
            icon:'fluent:box-16-regular',
            tip:'音乐播放中，点击进入应用，右键查看全部',
            name:'音乐',
            w:60,
            rightFn:() => {
                console.log('音乐')
            }
        },
        {
            icon:'fluent:box-16-regular',
            tip:'视频播放中，点击进入应用，右键查看全部',
            name:'视频',
            w:60,
            rightFn:() => {
                console.log('视频')
            }
        }
    ],
    mainClass:''
})


const mainVisible = ref(false)
const openMain = () => {
    console.log('openMain')
    mainVisible.value = !mainVisible.value
}

</script>
<style lang='scss' scoped></style>