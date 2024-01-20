<template>
  <div class="flex grow" style="height: 400px;">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <div class="flex flex-1 flex-col  overflow-hidden">
        <div style="height: 12px;"></div>
        <ControlRemoveItem  />
      </div>

      <div class="mb-2 mt-4" v-if="control.newList.length !== 0 ">
        <div style="width: 516px;" class="xt-bb mx-auto"></div>
      </div>

      <div class="flex flex-1 flex-col  overflow-hidden" v-if="control.newList.length !== 0">
        <div style="height: 8px;"></div>
        <ControlAddItem />
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

:deep(.ps__rail-y){
  display: none !important;
}
</style>