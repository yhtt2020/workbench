<template>
    <div 
        @click.stop.prevent="openMain"
        class="w-[40px] h-[40px] xt-main-bg rounded-lg flex flex-wrap relative"
        :class="[list.length === 1 ? 'items-center justify-center' : '']" 
        style="gap: 4px;padding: 6px">
        <template v-for="(item,index) in list.slice(0,3)" :key="index" >
            <xt-new-icon :icon="item.icon" size="12" v-if="item.icon"></xt-new-icon>
            <a-avatar :size="12" :src="item.avatar" v-else-if="item.avatar"></a-avatar>
        </template>
        <xt-new-icon 
            icon="fluent:more-horizontal-16-regular" 
            size="12" 
            v-if="list.length > 3">
        </xt-new-icon>
        
    </div>
    <Teleport to="body">
        <div 
            ref="message"
            :class="mainClass"
            v-if="mainVisible"
            style="border: 1px solid var(--divider);gap: 12px;z-index: 500;"
            class="absolute h-[52px] xt-bg flex p-3 rounded-lg message-box">
            <Item v-for="item in list" :key="item.name" :item="item"></Item>
        </div>
    </Teleport>
</template>

<script setup lang='ts'>
import { ref, watch , nextTick, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

import Item from './Item.vue'

const emit = defineEmits(['closeAll'])

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
    ],
    mainClass:''
})


const mainVisible = ref(false)
const pos = ref({})
const message = ref(null)

const openMain = (e) => {
    mainVisible.value = !mainVisible.value
}

watch(() => mainVisible.value, (val) => {
    if(!val) {
        emit('closeAll')
    }
})

// 点击外部关闭
// onMounted(() => {
//     onClickOutside(message, () => {
//         mainVisible.value = false
//     })
// })
</script>
<style lang='scss' scoped></style>