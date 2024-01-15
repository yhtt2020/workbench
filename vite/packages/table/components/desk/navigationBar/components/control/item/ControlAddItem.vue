<template>
 <Vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"  test="1" 
 :drag-enabled="false"   :get-item-height="getHeight"
>
<!-- :item-class="getMargin ? 'mr-0':'mr-2 mb-2'" -->
 <template #item="{ item }">
  <ControlAddDetail :control-index="item.id" :control-item="item"  @click="addControl(item)"/>
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

const vuuriList = ref(props.list);
const option = ref({
 layout:{horizontal:false},
})

// 计算间距
const getMargin = computed(() => {
  for (const i = 0; i < props.list.length; i++) {
    return i % 4 !== 0;
  }
})

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
}


// 添加设置
const addControl = (item) =>{
  const addIndex = control.value.addList.findIndex((find)=>{ return String(find.id) === String(item.id) });
  if(addIndex === -1){
    control.value.addList.push(item)
    const removeIndex = control.value.removeList.findIndex((find)=>{ return String(find.id) === String(item.id) });
    control.value.removeList.splice(removeIndex,1)
  }
}

onMounted(()=>{
  // console.log('222',props.list);
})
</script>

<style lang="scss" scoped>

</style>