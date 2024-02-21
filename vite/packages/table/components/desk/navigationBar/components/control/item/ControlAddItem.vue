<template>
 <Vuuri v-model="control.newList" group-id="id" item-key="id" :options="option"  test="1"
 :drag-enabled="false"   :get-item-height="getHeight" ref="testRef"
>
 <template #item="{ item }">

  <ControlAddDetail :control-index="item.id" :control-item="item" />
 </template>
</Vuuri>
</template>

<script setup>
import { ref,computed,onMounted} from "vue";
import { storeToRefs } from 'pinia';
import { controlStore } from '../../../hook/controlStore';

import Vuuri from "../../../../../vuuri/Vuuri.vue";
import ControlAddDetail from "./ControlAddDetail.vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const controls = controlStore();
const { control } = storeToRefs(controls);


const option = ref({
 layout:{horizontal:false},
})
const testRef = ref(null);


// 获取高度
const getHeight = () =>{
 return 120 + 'px'
}

onMounted(()=>{
  // testRef.value.muuri.on('dragEnd',(item,event)=>{
  //   if(event.distance<40){
  //     isClick.value = true;
  //   }else{
  //     isClick.value = false;
  //   }
  // })
})
</script>

<style lang="scss" scoped>

</style>
