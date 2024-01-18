<template>
  <div class="flex  h-3/4">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <div class="flex flex-1 flex-col h-3/4">
        <div style="height: 12px;"></div>
        <ControlRemoveItem :list="removeList" ref="removeRef" />
      </div>
      
      <a-divider style="height: 1px;margin:8px 0 16px 0;" v-if="addList.length !== 0 " />

      <div class="flex flex-1 flex-col h-3/4" v-if="addList.length !== 0">
        <ControlAddItem :list="addList"/>
      </div>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref,computed,onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { controlStore } from '../../hook/controlStore';

import ControlAddItem from './item/ControlAddItem.vue';
import ControlRemoveItem from './item/ControlRemoveItem.vue';

const controls = controlStore();
const { control } = storeToRefs(controls)

const removeRef = ref(null);

const removeList = computed(()=>{
  return control.value.oldList;
})

const addList = computed(()=>{
  return control.value.newList;
})

defineExpose({
  removeRef
})

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
  //  height:120px !important;
}
 
:deep(.muuri-item-content){
  background: transparent !important;
}

:deep(.muuri-item){
  width: auto !important;
  margin: 0 12px 12px 0 !important;
 
}
</style>