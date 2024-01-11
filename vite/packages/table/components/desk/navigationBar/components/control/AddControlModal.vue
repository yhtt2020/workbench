<template>
 <xt-modal v-model="addVisible" full title="添加" :mask="false">
  <div style="width: 564px;height: 472px;" class="px-1">
   <XtScrollbar  :y="true" style="height: 100%;width: 100%;" class="flex">
    <div class="flex flex-col w-full">
 
     <a-row :gutter="[16, 16]" id="pick-images" ref="pickRef">
      <a-col class="image-wrapper" v-for="item in list.slice(4)" :span="6" style="width: 120px;">
       <div class="xt-bg-2 rounded-xl flex items-center flex-col justify-center relative" style="height: 120px;">
        <div class="w-14 h-14 xt-bg rounded-full flex items-center justify-center mb-3">
          <xt-new-icon :icon="item.icon" size="24"></xt-new-icon>
        </div>
        <span class="xt-font xt-text font-14">{{ item.name }}</span>
        <div class="absolute" style="top:-2px;right: -2.5px;">
         <xt-new-icon icon="fluent:add-circle-12-filled" size="20" :color="'var(--link)'"></xt-new-icon>
         <!-- <xt-new-icon icon="fluent:checkmark-circle-16-filled" size="20" :color="'var(--link)'"></xt-new-icon> -->
        </div>
       </div>
      </a-col>
     </a-row>
    </div>
   </XtScrollbar>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref } from 'vue';
import control from '../../hook/controlList';


const addVisible = ref(false);
const list = ref(control.list);

const openAddModal = () =>{
 addVisible.value = true;
}

defineExpose({
 openAddModal
})

</script>

<style lang="scss" scoped>
.item-add{
 &:first-of-type{
  margin-right: 12px;
 }
}

.items-add{
 &:first-of-type{
  margin-bottom: 14px;
 }
}
</style>