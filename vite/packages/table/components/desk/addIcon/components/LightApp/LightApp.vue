<template>
    <IconList :list="list" info="轻应用" @clickItem="addIcon"></IconList>
    <Empty v-if="list.length === 0"></Empty>
</template>

<script setup lang='ts'>
import { ref, onMounted,computed } from 'vue'
import Empty from '../Empty.vue';
import {usePlat} from '../../../../../ui/hooks/usePlat'
import IconList from '../IconList.vue';
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import { useReplace } from '../../hook/useReplace';
import { useFilterList } from '../../hook/useFilterList';

let appModel
if(usePlat('client')){
  appModel = window.$models.appModel
}
const lightApp = ref<string[]>([])

const emit = defineEmits(['addIcon'])

const props = defineProps({
    value: String
})

onMounted( async() => {
    if (usePlat('client')) {
      lightApp.value =await appModel.getAllApps()
    } else {
      lightApp.value = []
    }
    // 添加图标类型
    addType(lightApp.value)
    // 替换图标数据字段
    lightApp.value = useReplace(lightApp.value)
    // 替换统一图标数据字段
    lightApp.value = lightApp.value.map((item) => {
        return mergeData(item)
    })
})

const addType = (list:string[]) => {
    list.forEach((item) => {
        if(item.icon) return
        item.type = 'lightApp'
        item.icon = item.logo
    })
}

const addIcon = (item) => {
    emit('addIcon', item)
}

const list = computed(() => {
    const arr = lightApp.value
    if(! arr) {
        return []
    }
    return useFilterList(arr,props.value)
})

</script>
<style lang='scss' scoped></style>
