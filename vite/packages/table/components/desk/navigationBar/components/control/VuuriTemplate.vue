<template>
  <vuuri v-model="vuuriList" group-id="id" item-key="id" :options="option"  :drag-enabled="true"
  :item-class="getMargin ? 'mr-0':'mx-1 mb-3'" :get-item-width="widthSize" :get-item-height="widthSize"
  >
    <template #item="{ item }" >
      <template v-if="item.id === 'audio'">
        <div  class="rounded-xl flex flex-col relative" style="height: 120px;" @click="controlsAdd(item)">
          <template v-for="listItem in item.list">
            <template v-if="listItem.id === 'music'">
              <div class="w-full xt-bg rounded-lg mb-3.5 flex items-center justify-between" style="height: 54px;padding: 0 22px;">
                <xt-new-icon v-for="icon in listItem.list" :icon="icon.icon" size="24" :color="icon.color"></xt-new-icon>
              </div>
            </template>

            <template v-else>
              <div class="w-full flex xt-bg justify-between pr-4 rounded-lg" style="height: 52px;">
                <div style="width: 129px; background: rgba(255,255,255,0.85);" class="rounded-tl-lg rounded-bl-lg"></div>
                <xt-new-icon :icon="listItem.icon" size="24"></xt-new-icon>
              </div>
            </template>
          </template>
          <div class="absolute" style="top: 7px;right:-4px;">
            <xt-button style="width: auto !important;" h="0">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
              </div>
            </xt-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div  class="xt-bg rounded-xl flex flex-col items-center justify-center relative" style="height: 120px;" @click="controlsAdd(item)">
          <div class="absolute" style="top: 7px;right:-4px;">
            <xt-button style="width: auto !important;" h="0">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
              </div>
            </xt-button>
          </div>
          <div class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3">
            <xt-new-icon :icon="item.icon" size="24"></xt-new-icon>
          </div>
          <span class="xt-text">{{item.name}}</span>
        </div> 
      </template>
    </template>
  </vuuri>
</template>

<script setup>
import { ref,computed } from'vue';
import { controlStore } from '../../hook/controlStore';
import { storeToRefs } from 'pinia';

import vuuri from "../../../../vuuri/Vuuri.vue";

const props = defineProps({
  list:{
    type:Array,
    default:()=>[]
  }
})

const controls = controlStore();
const { control } = storeToRefs(controls);
const emit  = defineEmits(['remove']);

const  vuuriList = ref(props.list);
const option = ref({
  layout:{ 
    horizontal:false 
  },
})

// 计算间距
const getMargin = computed(()=>{
  for(const i=0;i<props.list.length;i++){
   return i%4!==0
  }
})

const widthSize = () =>{
  return 120 + 'px' 
}

// 控制中心数据编辑添加
const controlsAdd = (item) =>{
  const index = control.value.addList.findIndex((find)=>{ return String(find.id) === String(item.id) });
  const findIdIndex = controlData.findIndex((find)=>{ return String(find.id) === String(item.id) })
  if(index === -1){
    control.value.addList.push(item)
  }
  emit('remove',findIdIndex);
}
</script>

<style lang="scss" scoped>



</style>