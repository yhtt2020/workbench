<template>
    <IconList :list="list" info="酷应用" @clickItem="addIcon"></IconList>
    <Empty v-if="list.length === 0"></Empty>
</template>

<script setup lang='ts'>
import { ref, onMounted,computed } from 'vue'
import IconList from '../IconList.vue';
import navigationData from '../../../../../js/data/tableData'
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import { useReplace } from '../../hook/useReplace';
import { useFilterList } from '../../hook/useFilterList';
import Empty from '../Empty.vue';

const coolAppList = ref<string[]>([])

const emit = defineEmits(['addIcon'])

const props = defineProps({
    value: String
})

onMounted( () => {
    coolAppList.value = navigationData.coolAppList
    coolAppList.value = useReplace(coolAppList.value)
    coolAppList.value = coolAppList.value.map((item) => {
        return mergeData(item)
    })
})

const addIcon = (item) => {
    emit('addIcon', item)
}

const list = computed(() => {
    const arr = coolAppList.value
    if(! arr) {
        return []
    }
    return useFilterList(arr,props.value)
})

</script>
<style lang='scss' scoped></style>