<template>
 <Vuuri v-model="controlList" group-id="id" item-key="id" :options="option"  ref="testRef"
 :drag-enabled="true"   :get-item-height="getHeight"
>

 <template #item="{ item }">
  <ControlRemoveDetail :control-index="item.id" :control-item="item" :isClick="isClick" :status="'del'" />
 </template>
</Vuuri>
</template>

<script setup>
import { ref,computed,onMounted, } from "vue";
import { storeToRefs } from 'pinia';
import { controlStore } from '../../../hook/controlStore';

import Vuuri from "../../../../../vuuri/Vuuri.vue";
import ControlRemoveDetail from "./ControlRemoveDetail.vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const option = ref({
 layout:{horizontal:false},
});
const testRef = ref(null);
const isClick = ref(true);

const controls = controlStore();
const { control,updateList } = storeToRefs(controls);

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
};

const controlList = computed(()=>{
  if (!window.$useEnv()) return control.value.oldList;
  const arr = ["window-control", "assist-mode", "audio",'energy-save-mode','shake'];
  let filterList = control.value.oldList.filter(item => !arr.includes(item.id));
  return filterList;
})

onMounted(()=>{
  // 拖拽移动中事件
  testRef.value.muuri.on('dragMove',(item,event) =>{
    isClick.value = false;
  });

  // 拖拽排序结束后
  testRef.value.muuri.on('dragEnd',()=>{
    const updateItem = testRef.value.muuri.getItems().map((mapItem)=>{
      return {
        id:mapItem.getElement().dataset.itemKey,
      }
    });
    updateList.value = [...updateItem];
  })

  // 拖拽结束后释放拖拽事件
  testRef.value.muuri.on('dragReleaseEnd',(item,event)=>{
    isClick.value = true;
  });

})

</script>

<style lang="scss" scoped>

</style>