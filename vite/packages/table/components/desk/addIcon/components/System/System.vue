<template>
    <IconList :list="systemAppList" info="系统图标" @clickItem="addIcon"></IconList>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount,computed,toRefs } from 'vue'
import IconList from '../IconList.vue';
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
    console.log(systemAppList.value)
})

const list = computed(() => {
    const arr = useFilterList(systemAppList.value,value.value)
    console.log(arr)
    return arr
    
})

const addIcon = (item) => {
    emit('addIcon', item)
}

</script>
<style lang='scss' scoped></style>