<template>
    <IconList :list="coolAppList" info="酷应用" @clickItem="addIcon"></IconList>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import IconList from '../IconList.vue';
import navigationData from '../../../../../js/data/tableData'
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import { useReplace } from '../../hook/useReplace';

const coolAppList = ref<string[]>([])

const emit = defineEmits(['addIcon'])

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


</script>
<style lang='scss' scoped></style>