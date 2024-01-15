<template>
 <Vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"  
 :drag-enabled="true" :item-class="getMargin ? 'mr-0':'mr-2 mb-2'"  :get-item-height="getHeight"
>
 <template #item="{ item }">
  <ControlRemoveDetail :control-index="item.id" :control-item="item" :status="'del'"  @click="removeControl(item,$event)"/>
 </template>
</Vuuri>
</template>

<script setup>
import { ref,computed,onMounted} from "vue";
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

const controls = controlStore();
const { control } = storeToRefs(controls);

const vuuriList = ref(props.list);
const option = ref({
 layout:{horizontal:false},
});

// 计算间距
const getMargin = computed(() => {
  for (const i = 0; i < props.list.length; i++) {
    return i % 4 !== 0;
  }
});

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
};


// 移除设置
const removeControl = (item,evt) =>{
 console.log('111',item);
 const index = control.value.addList.findIndex((find)=>{ return String(find.id) === String(item.id) });
 if(control.value.addList.length !== 1){
  control.value.addList.splice(index,1);
  const removeIndex  = control.value.addList.findIndex((find)=>{ return String(find.id) === String(item.id) });
  if(removeIndex === -1){
   control.value.removeList.push(item)
  }
 }

 else {
  evt.preventDefault();
 }
};


</script>

<style lang="scss" scoped>

</style>