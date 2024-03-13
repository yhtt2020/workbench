<template>
    <div class="flex mb-3">
        <xt-button 
            w="80" 
            h="32" 
            radius="16" 
            class="p-1 mr-3 text-sm shaking-element" 
            @click="onClick(index)"
            :style="{ 
                'background': clickIndex === index ? 'var(--active-bg)' : 'transparent', 
                'color': clickIndex === index ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
            v-for="(item, index) in webMenus" :key="index">
            {{ item.name }}
        </xt-button>
    </div>
    <IconList :list="list" @clickItem="addIcon"></IconList>
</template>

<script setup lang='ts'>
import { ref, onMounted,computed } from 'vue'
import { getNavList } from '../../../../../page/app/addIcon/api/api'
import { webMenus } from '../../hook/defaultData'
import { useReplace } from '../../hook/useReplace';
import IconList from '../IconList.vue';

const emit = defineEmits(['addIcon'])

// 获取所有的图标
const webList = ref({})

// 索引
const clickIndex = ref(0)

// 当前图标的类型
const tag = computed(() => {
    return webMenus[clickIndex.value].tag
})

// 当前图标的列表
const list = computed(() => {
    const arr = webList.value[tag.value]
    if(arr) {
        const newArr = useReplace(arr)
        console.log(newArr)
        return newArr
    }
    return webList.value[tag.value]
})

// 切换
const onClick = (index: number) => {
    clickIndex.value = index
}

onMounted( async() => {
    webList.value = await getNavList()
})

// 添加图标
const addIcon = (item) => {
    emit('addIcon',item)
}

</script>
<style lang='scss' scoped></style>