<template>
    <IconList :list="list" info="系统图标" @clickItem="addIcon"></IconList>
    <Empty v-if="list.length === 0"></Empty>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount,computed,toRefs,watch } from 'vue'

import IconList from '../IconList.vue';
import Empty from '../Empty.vue'

import navigationData from '../../../../../js/data/tableData'
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import { useFilterList } from '../../hook/useFilterList';
import { useReplace } from '../../hook/useReplace';

const emit = defineEmits(['addIcon'])

const props = defineProps({
    value: String
})

const {value} = toRefs(props)

const systemAppList = ref<object[]>([])

onBeforeMount( () => {
    systemAppList.value = navigationData.systemAppList
    systemAppList.value = useReplace(systemAppList.value)
    systemAppList.value = systemAppList.value.map((item) => {
        return mergeData(item)
    })
})

const list = computed(() => {
    const arr = useFilterList(systemAppList.value,value.value)
    return arr
})

const addIcon = (item) => {
    emit('addIcon', item)
}

watch(
    () => value.value,
    () => {
        console.log('value change',value.value)
        const arr = useFilterList(systemAppList.value,value.value)
        console.log('arr',arr,list.value)
    }
)

</script>
<style lang='scss' scoped></style>