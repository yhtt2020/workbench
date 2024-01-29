<template>
  <div class="flex mt-3" style="height: auto;">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <Vuuri v-model="control.oldList" group-id="id" item-key="id" :options="option"
       :drag-enabled="false"   :get-item-height="getHeight"
      >
        <template #item="{ item }">
          <ControlRemoveDetail :control-index="item.id" :control-item="item" :status="'null'" />
        </template>
      </Vuuri>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { controlStore } from '../../hook/controlStore';

import Vuuri from '../../../../vuuriHome/Vuuri.vue';
import ControlRemoveDetail from './item/ControlRemoveDetail.vue';

const controls = controlStore();
const { control } = storeToRefs(controls);

const option = ref({
 layout:{horizontal:false},
})

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
}

</script>

<style lang="scss" scoped>

:deep(.grid){
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;

}

:deep(.muuri-grid){
  background: transparent !important;
}

:deep(.muuri-item-content){
  background: transparent !important;
}

:deep(.muuri-item){
  width: auto !important;
  margin: 0 12px 12px 0 !important;
  
}

</style>