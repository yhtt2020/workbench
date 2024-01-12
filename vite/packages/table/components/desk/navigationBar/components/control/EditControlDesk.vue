<template>
 <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
  <div class="w-full h-full">
    <!-- <template v-for="item in 20">
      <Vuuri :options="{ layout:{  horizontal: false } }" v-model="item"  class="grid w-full"></Vuuri>
    </template> -->
  </div>
  <!--  v-show="grid.children.length !== 0 || editing" :style="{ width: getVuuriWidth(grid.cols) }"
                     :key="key"
                     :drag-enabled="editing" group-id="grid.id" :ref="'grid' + grid.id" style="min-height: 3em"
                     item-key="id"
                     class="grid s-bg" :get-item-width="getIconSize" :get-item-height="getIconSize"
                     v-model="grid.children" -->
  <!-- <Vuuri :options="{ layout:{  horizontal: false } }" :key="key" class="grid w-full"
    style="height: 100%;"
  >
   <Template #item="{item}">
     123
   </Template>
    编辑中的控制中心
  </Vuuri> -->
 </XtScrollbar>
</template>

<script setup>
import { ref } from 'vue';
import Vuuri from "../../../../vuuri/Vuuri.vue";
import Template from '../../../../../../user/pages/Template.vue';

const key = ref(Date.now());

const updateLog = ref([
 {name:'测试'},
 {name:'测试'},
 {name:'测试'},
 {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
 // {name:'测试'},
])

</script>

<style lang="scss" scoped>
:deep(.xt-bg){
 background: transparent !important;
}

:deep(.muuri-item){
 padding-bottom: 12px !important;
 padding-right: 12px !important;
}
</style>