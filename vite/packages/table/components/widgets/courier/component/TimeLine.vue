<template>
 <a-timeline>
  <a-timeline-item v-for="(item,index) in reversedList" class="item-time">
    <div class="flex">
      <div class="mr-4 font-16  xt-font" :class="TimeLine==0? 'xt-text font-600' :'xt-text-2 font-500'" v-if="deliveryStatus[TimeLine]">
        {{ deliveryStatus[TimeLine] }}</div>
      <div class="font-14 font-400 xt-font" :class="TimeLine==0? 'xt-text' :'xt-text-2'">{{ item.AcceptTime }}</div>
    </div>
    <div class="font-14 font-400 xt-text-2">{{ item.AcceptStation }}</div>
  </a-timeline-item>
  <div style="height: 10px;"></div>
 </a-timeline>
</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'
import {kdState} from '../lib/mock'
export default {
 props:['list'],
 components:{
  SmallIcon
 },
 computed:{
  deliveryStatus(){
    let deliveryList=this.reversedList.map((item)=>{
      // console.log(item.Action);
      return kdState(item.Action)
    })
    return deliveryList
  },
  reversedList() {
    return this.list?.slice()?.reverse();
  }
 }
}
</script>

<style lang="scss" scoped>
:deep(.ant-timeline-item-head){
 background: var(--secondary-text) !important;
 color: var(--secondary-text) !important;
}
:deep(.ant-timeline-item-head-blue){
 border: none !important;
}

:deep(.item-time){
  user-select: text;
  &:first-of-type{
   padding-top: 16px;
  }
}
</style>
