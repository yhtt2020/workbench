<template>
 <xt-select :list="list" zIndex="1250" style="width: 140px;margin-right: 12px;text-align: center;" 
 :border="false" :borderClass="'rounded-md '" v-model="pickParams.setting.paperValue" @change="updateValue($event)">
 </xt-select>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { pickPaperStore } from '../../store/PickPaperStore';

const props = defineProps({
 list:{
  type:Array,
  default:()=>[]
 },
})

const pickStore = pickPaperStore()
const { pickParams } = storeToRefs(pickStore);

const emits = defineEmits(['update']);

const updateValue = (evt) =>{
 emits('update',evt);
}



</script>

<style lang="scss" scoped>
:deep(.ant-select-selector){
 height: 32px !important;
 & .ant-select-selection-item{
   line-height: 32px !important;
 }
}
</style>