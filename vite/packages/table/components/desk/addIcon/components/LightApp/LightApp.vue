<template>
    <IconList :list="lightApp" info="轻应用"></IconList>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import {useEnv} from '../../../../../ui/hooks/useEnv'
import IconList from '../IconList.vue';
import { mergeData } from '../../../../../ui/hooks/useDataConversion';

const appModel = window.$models.appModel

const lightApp = ref<string[]>([])

onMounted( async() => {
    if(!useEnv('web')){
      lightApp.value =await appModel.getAllApps() 
    } else {
      lightApp.value = []
    }
    addType(lightApp.value)
    lightApp.value = lightApp.value.map((item) => {
        return mergeData(item)
    })
})

const addType = (list:string[]) => {
    list.forEach((item) => {
        if(item.icon) return
        item.type = 'lightApp'
        item.icon = item.logo
        item.value = item
    })
}

</script>
<style lang='scss' scoped></style>