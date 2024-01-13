<template>
  <div class="flex flex-1" style="height:557px;">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <div>{{ control.addList }}</div>

      <a-divider style="height: 1px;margin: 16px 0;" />

      <div class="flex flex-col">
        <VuuriTemplate :list="centerSliceList" @remove="removeOldList"/>
      </div>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { controlStore } from '../../hook/controlStore';

import VuuriTemplate from './VuuriTemplate.vue';

const controls = controlStore();
const { control } = storeToRefs(controls)


// 计算属性判断添加的数据
const centerSliceList = computed(()=>{
  return control.value.removeList
})

// 移动原先数据
const removeOldList = (index) =>{
 console.log('测试',centerSliceList.value,index);
 centerSliceList.value.splice(index,1)
}


// const topSliceList = ref(control.list.slice(1,3));
// const centerSliceList = ref(control);
// const bottomSliceList = ref(control.list.slice(7))




</script>

<style lang="scss" scoped>
:deep(.grid){
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;
  margin: 1.5em;
 }
 
 :deep(.muuri-grid){
  background: transparent !important;
  height:120px !important;
 }
 
 :deep(.muuri-item-content){
  background: transparent !important;
 }

 :deep(.muuri-item){
  &:first-of-type{
    width: 252px !important;
  }
 }

</style>