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
            v-for="(item, index) in localFiles" :key="index">
            {{ item.name }}
        </xt-button>
    </div>
    <IconList :list="list" info="桌面图标" @clickItem="addIcon"></IconList>
    <Empty v-if="list.length === 0"></Empty>
</template>

<script setup lang='ts'>
import { ref, onMounted,computed } from 'vue'
import IconList from '../IconList.vue';
import Empty from '../Empty.vue';
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import {localFiles,doc,apps} from '../../hook/defaultData'
import { useReplace } from '../../hook/useReplace';
import { useFilterList } from '../../hook/useFilterList';

const tableApp = ref<string[]>([])

const emit = defineEmits(['addIcon'])

const props = defineProps({
    value: String
})

// 索引
const clickIndex = ref(0)

// 获取桌面图标,统一图标格式
onMounted(async () => {
    tableApp.value = await ipc.sendSync('getDeskApps')
    await addType(tableApp.value)
    tableApp.value = useReplace(tableApp.value)
    tableApp.value = tableApp.value.map((item) => {
        return mergeData(item)
    })
})

// 遍历图标数组，添加type属性
const addType = (list: string[]) => {
    list.forEach((item) => {
        // 防止重复遍历
        if (item.type === 'tableApp') return
        item.type = 'tableApp'
    })
}

// 修改索引
const onClick = (index: number) => {
    clickIndex.value = index
}

// 筛选图标列表
const filterList = computed( () => {
    const tag = localFiles[clickIndex.value].tag
    switch (tag) {
        case 'all':
            return tableApp.value
            break;
        case 'app':
            return tableApp.value.filter((item) => apps.includes(item.ext))
            break;
        case 'docx':
            return tableApp.value.filter((item) => doc.includes(item.ext))
            break;
        case 'other':
            return tableApp.value.filter((item) => !apps.includes(item.ext) && !doc.includes(item.ext))
            break;
        default:
            return tableApp.value
            break;
    }
})

// 添加图标
const addIcon = (item) => {
    emit('addIcon',item)
}

// 搜索后列表
const list = computed(() => {
    return useFilterList(filterList.value,props.value)
})


</script>
<style lang='scss' scoped></style>