<template>
  <Vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"
  :drag-enabled="true" :item-class="getMargin ? 'mr-0':'mr-2 mb-2'"  :get-item-height="getHeight"
  >
    <template #item="{ item }">
      <ControlRemoveDetail :control-index="item.id" :control-item="item" :status="'null'"/>
    </template>
  </Vuuri>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { controlStore } from '../../hook/controlStore';

import Vuuri from '../../../../vuuriHome/Vuuri.vue';
import ControlRemoveDetail from './item/ControlRemoveDetail.vue';

const controls = controlStore();
const { control } = storeToRefs(controls);

const vuuriList = ref(control.value.addList);
const option = ref({
 layout:{horizontal:false},
})

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
}

// 计算间距
const getMargin = computed(() => {
  for (const i = 0; i < vuuriList.length; i++) {
    return i % 4 !== 0;
  }
})


</script>

<style lang="scss" scoped>

</style>