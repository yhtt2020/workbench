<template>
  <div class="flex flex-1" style="height:557px;">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <div class="flex flex-1 flex-col h-3/4">
        <div style="height: 12px;"></div>
        <!-- <ControlGrid :list="control.addList" :controls="controls" :status="'del'"/> -->
      </div>
      
      <a-divider style="height: 1px;margin: 16px 0;" />

      <div class="flex flex-1 flex-col h-3/4">
        <!-- <ControlGrid2 :list="[...control.removeList]" :status="'add'"/> -->
        <!-- <ControlGrid :list="[...control.removeList]" :status="'add'"/> -->
      </div>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref,computed,onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { controlStore } from '../../hook/controlStore';

// import ControlGrid from './ControlGrid.vue';
// import ControlGrid2 from './ControlGrid2.vue';

const controls = controlStore();
const { control } = storeToRefs(controls)


// 计算属性判断添加的数据
const centerSliceList = computed(()=>{
  return control.value.removeList
})

onMounted(()=>{
  // console.log('111',props.list);
  console.log('44444',controls);
  // console.log('555',control.value); //0
  console.log('555',control.value.removeList.length); //0
  setTimeout(()=>{
    console.log('666',control.value.removeList.length); //0

  },2000)
})

// const topSliceList = ref(control.list.slice(1,3));
// const centerSliceList = ref(control);
// const bottomSliceList = ref(control.list.slice(7))




</script>

<style lang="scss" scoped>
:deep(.grid){
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;
  margin: 1.5em;
}
 
:deep(.muuri-grid){
  background: transparent !important;
  height:120px !important;
}
 
:deep(.muuri-item-content){
  background: transparent !important;
}

:deep(.muuri-item){
  width: auto !important;
}

</style>
<!-- 


 -->