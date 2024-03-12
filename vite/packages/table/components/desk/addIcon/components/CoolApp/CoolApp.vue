<template>
    <IconList :list="coolAppList" info="酷应用"></IconList>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import IconList from '../IconList.vue';
import navigationData from '../../../../../js/data/tableData'
import { mergeData } from '../../../../../ui/hooks/useDataConversion';

const coolAppList = ref<string[]>([])

onMounted( () => {
    coolAppList.value = navigationData.coolAppList
    coolAppList.value = coolAppList.value.map((item) => {
        return mergeData(item)
    })
})


</script>
<style lang='scss' scoped></style>