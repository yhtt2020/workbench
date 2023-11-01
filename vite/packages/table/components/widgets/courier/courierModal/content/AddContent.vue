<template>
 <div class="flex flex-col" style="width:500px;">
  <div class="w-full flex items-center justify-center py-5" style="position: relative;">
   <span class="xt-text xt-font font-16 font-400">添加快递</span>
   <div class="flex close-button pointer items-center justify-center p-2 category-button rounded-xl xt-bg-2" @click="close">
    <CourierIcon icon="fluent:dismiss-16-filled"  style="font-size: 1.25rem;color:var(--secondary-text);"/>
   </div>
  </div>
  
  <div class="px-6 flex flex-col py-4">
   <div class="xt-bg-2 xt-text xt-font rounded-xl category-14-400 px-4 py-3">
    支持批量添加快递单号，每行一个单号，按下回车换行。「顺丰快递」和「菜鸟橙运」需要填写额外信息。
   </div>

   <RadioTab class="my-4" :navList="courierType" v-model:selectType="currentCourier"/>

   <template v-if="currentCourier.name === 'ordinary'">
    <a-textarea v-model:value="trackNumber"  placeholder="每一行一个单号" :rows="9" style="border-radius: 10px; padding: 10px 11px; margin-bottom: 16px;" />
   </template>

   <template v-else-if="currentCourier.name === 'SF'">
     <div class="flex flex-col">
      <a-textarea v-model:value="trackNumber"  placeholder="每一行一个单号" :rows="6" style="border-radius: 10px; padding: 10px 11px; margin-bottom: 16px;" />
      <a-input placeholder="收件人或寄件人手机尾号4位，批量添加时需为同一个手机号" style="border-radius: 10px;margin-bottom: 16px;"></a-input>
     </div>
   </template>

   <template v-else-if="currentCourier.name === 'Orange'">
    <div class="flex flex-col">
     <a-textarea v-model:value="trackNumber"  placeholder="每一行一个单号" :rows="6" style="border-radius: 10px; padding: 10px 11px; margin-bottom: 16px;" />
     <a-input placeholder="货主编号，批量添加时需为同一个编号" style="border-radius: 10px;margin-bottom: 16px;"></a-input>
    </div>
   </template>

   <div class="flex w-full justify-end">
    <xt-button w="64" @click="close">取消</xt-button>
    <xt-button w="64" type="theme" class="ml-3" @click="queryCourier">确定</xt-button>
   </div> 
  </div>
  
 </div>
</template>

<script>
import { Icon as CourierIcon } from '@iconify/vue'

import RadioTab from '../../../RadioTab.vue'

export default {
 components:{
  CourierIcon,RadioTab
 },

 data(){
  return{
    courierType:[
     {title:'普通快递',name:'ordinary'},
     {title:'顺丰快递',name:'SF'},
     {title:'菜鸟橙运',name:'Orange'}
    ],
    currentCourier:{title:'普通快递',name:'ordinary'},
    trackNumber:'', // 接收快递单号
  }
 },

 watch:{
  'currentCourier':{
    handler(newVal){
      this.currentCourier = newVal
    },
    immediate:true,
  }
 },

 methods:{
  // 关闭弹窗
  close(){
   this.$emit('close')
  },

  // 查询快递
  queryCourier(){

  },
 },


}
</script>

<style lang="scss" scoped>
.close-button{
 position: absolute;
 top:16px;
 right: 16px;
}

:deep(.xt-active-btn){
 border-radius: 8px !important;
}

:deep(.ant-input){
 color: var(--secondary-text) !important;
 font-size: 14px;
 font-weight: 400;
 &::placeholder{
  color: var(--secondary-text) !important;
 }
}
</style>