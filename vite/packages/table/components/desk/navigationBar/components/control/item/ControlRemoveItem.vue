<template>
 <Vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"  ref="testRef"
 :drag-enabled="false"   :get-item-height="getHeight"
>
 <!-- :item-class="getMargin ? 'mr-0':'mr-2 mb-2'" -->
 <template #item="{ item }">
  <ControlRemoveDetail :control-index="item.id" :control-item="item" :status="'del'" />
 </template>
</Vuuri>
</template>

<script setup>
import { ref,computed,onMounted} from "vue";

import Vuuri from "../../../../../vuuri/Vuuri.vue";
import ControlRemoveDetail from "./ControlRemoveDetail.vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const vuuriList = ref(props.list);
const option = ref({
 layout:{horizontal:false},
});
const testRef = ref(null);

// 计算间距
// const getMargin = computed(() => {
//   for (const i = 0; i < props.list.length; i++) {
//     return i % 4 !== 0;
//   }
// });

// 获取高度
const getHeight = () =>{
 return 120 + 'px' 
};


onMounted(()=>{
  // testRef.value.muuri.on('dragMove', function (item, event) {
  //   console.log('111',item);
  //   console.log('222',event);
  // })
})
</script>

<style lang="scss" scoped>

</style>