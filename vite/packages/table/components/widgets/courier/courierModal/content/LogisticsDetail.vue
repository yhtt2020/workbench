<template>
 <div class="flex flex-col" style="width: 500px;height: 600px;">
  <div class="flex items-center justify-center h-16" style="position: relative;">
   <div class="left-back">
    <a-tooltip placement="top">
      <template #title>
        <span class="xt-text-2">返回</span>
      </template>
      <xt-button w="32" h="32"  @click="back" style="border-radius: 8px !important;">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg xt-bg-2 pointer category-button " >
          <SmallIcon icon="fluent:chevron-left-16-filled" class="xt-text-2" style="font-size:1.2rem;"/>
        </div>
      </xt-button>
    </a-tooltip>
   </div>

   <div class="xt-text font-16 font-400 ">物流详情</div>
    
   <div class="flex top-right">
    <DropIndex :navList="addList"/>

    <a-tooltip placement="top">
      <template #title>
        <span class="xt-text-2">关闭</span>
      </template>
      <xt-button w="32" h="32"  @click="close" style="border-radius: 8px !important;">
        <div class="flex items-center justify-center w-8 h-8 ml-3 rounded-lg category-button pointer xt-bg-2">
          <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/> 
        </div> 
      </xt-button>
    </a-tooltip>
   </div>
  </div>

   <div class="flex flex-col px-6">
    <UpdateIcon :orderData="orderNum"/>
    <div class="px-4 rounded-lg xt-bg-2">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;">
        <TimeLine :list="orderNum?.Traces"/>
      </vue-custom-scrollbar>
    </div>
   </div>
 </div>
  
 <AddCourierModal ref="addCourierRef" />

</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'

import AddCourierModal from '../AddCourierModal.vue'
import TimeLine from '../timeLine/index.vue'
import UpdateIcon from '../updateIcon/index.vue'
import DropIndex from '../dropdown/DropIndex.vue'

export default {
 props:['orderNum'],
 
 components:{
  SmallIcon,AddCourierModal,
  TimeLine,
  UpdateIcon,DropIndex
 },

 data(){
  return{
    settingsScroller: { 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
    },

    addList:[
      {
        title:'京东账号',name:'jd',
        callBack:()=>{}
      },
      {
        title:'淘宝账号',name:'tb',
        callBack:()=>{}
      },
      { 
        title:'自定义',
        icon:'fluent:add-16-filled',
        callBack:()=>{
          this.addCourier()
        }
      },
    ]

  }
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