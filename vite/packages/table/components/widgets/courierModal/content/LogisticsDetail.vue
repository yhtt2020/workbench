<template>
 <div class="flex flex-col" style="width: 500px;height: 600px;">
  <div class="flex items-center h-16 justify-center" style="position: relative;">
   <div class="left-back">
     <div class="flex items-center justify-center w-8 h-8 xt-bg-2 pointer rounded-lg category-button " @click="back">
      <SmallIcon icon="fluent:chevron-left-16-filled" class="xt-text-2" style="font-size:1.2rem;"/>
     </div>
   </div>

   <div class="xt-text category-16-400 ">物流详情</div>

   <div class="top-right flex">
    <div class="flex items-center px-2 py-1.5 justify-center category-button pointer rounded-lg xt-bg-2" @click="addCourier">
       <SmallIcon icon="fluent:add-16-filled" class="xt-text-2" style="font-size: 1.25rem;"/>
       <span class="xt-text-2">添加快递</span>
    </div>
    <div class="flex ml-3 items-center justify-center category-button pointer rounded-lg w-8 h-8 xt-bg-2" @click="close">
     <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/> 
    </div>
   </div>
  </div>

   <div class="px-6 ">
    <!-- 123 -->
    <!-- <a-timeline>
      <a-timeline-item color="gray" v-for="item in 10">
         <div class="">
           <span class="xt-text">测试</span>
         </div>
      </a-timeline-item>
    </a-timeline> -->
   </div>
 </div>
  
 <AddCourierModal ref="addCourierRef" />

</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'

import AddCourierModal from '../AddCourierModal.vue'

export default {
 props:['orderNum'],
 
 components:{
  SmallIcon,AddCourierModal
 },


 methods:{
  close(){
   this.$emit('close')
  },
  back(){
   this.$emit('back')
  },
  addCourier(){
   this.$refs.addCourierRef.openCourierModel()
  }
 }


}
</script>

<style lang="scss" scoped>
.top-right{
 position: absolute;
 top: 16px;
 right: 16px;
}

.left-back{
 position: absolute;
 top: 16px;
 left: 16px;
}

</style>