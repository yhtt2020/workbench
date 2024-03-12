<template>
    <IconList :list="systemAppList" info="系统图标"></IconList>
</template>

<script setup lang='ts'>
import { ref, onBeforeMount } from 'vue'
import IconList from '../IconList.vue';
import navigationData from '../../../../../js/data/tableData'
import { mergeData } from '../../../../../ui/hooks/useDataConversion';

const systemAppList = ref<string[]>([])

onBeforeMount( () => {
    systemAppList.value = navigationData.systemAppList
    systemAppList.value = systemAppList.value.map((item) => {
        return mergeData(item)
    })
})
</script>
<style lang='scss' scoped></style>