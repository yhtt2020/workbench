<template>
    <IconList :list="lightApp" info="轻应用" @clickItem="addIcon"></IconList>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import {useEnv} from '../../../../../ui/hooks/useEnv'
import IconList from '../IconList.vue';
import { mergeData } from '../../../../../ui/hooks/useDataConversion';
import { useReplace } from '../../hook/useReplace';

const appModel = window.$models.appModel

const lightApp = ref<string[]>([])

const emit = defineEmits(['addIcon'])

onMounted( async() => {
    if(!useEnv('web')){
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

</script>
<style lang='scss' scoped></style>