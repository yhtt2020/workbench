<template>
 <Vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"  test="1"
 :drag-enabled="true"   :get-item-height="getHeight" ref="testRef"
>
<!-- :item-class="getMargin ? 'mr-0':'mr-2 mb-2'" -->
 <template #item="{ item }">
    <!-- <div
      class="w-full cursor-not-allowed absolute"
      style="z-index:900;height: 120px;"
    >
  </div> -->
  <ControlAddDetail :control-index="item.id" :control-item="item"
    @click="addControl(item,$event)"
    />
 </template>
</Vuuri>
</template>

<script setup>
import { ref,computed,onMounted} from "vue";
import { storeToRefs } from 'pinia';
import { controlStore } from '../../../hook/controlStore';
import { appStore } from '../../../../../../store';
import { teamStore } from '../../../../../../store/team';

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
const app = appStore()
const { userInfo,userCardUserInfo } = storeToRefs(app);
const team = teamStore();

const vuuriList = ref(props.list);
const option = ref({
 layout:{horizontal:false},
})
const testRef = ref(null);
const isClick = ref(false);

// 获取高度
const getHeight = () =>{
 return 120 + 'px'
}


// 添加设置
const addControl = (item,evt) =>{
  if(isClick.value){
    console.log('查看数据',control.value.addList);
    // const addIndex = control.value.addList.findIndex((find)=>{ return String(find.id) === String(item.id) });
    // if(addIndex === -1){
    //  control.value.addList.push(item)
    //  const removeIndex = control.value.removeList.findIndex((find)=>{ return String(find.id) === String(item.id) });
    //  control.value.removeList.splice(removeIndex,1)
    // }
  }
  else {
    evt.preventDefault();
  }
}

onMounted(()=>{
  testRef.value.muuri.on('dragEnd',(item,event)=>{
    if(event.distance<40){
      isClick.value = true;
    }else{
      isClick.value = false;
    }
  })
})
</script>

<style lang="scss" scoped>

</style>
