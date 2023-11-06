<template>
 <div class="flex justify-between mb-3">

  <div class="flex">
   <div class="flex items-center justify-center rounded-lg w-14 h-14 pointer category-button xt-bg-2" @click="onUpdateImg">
    <a-avatar :size="32" :src="detailAvatar"></a-avatar>
   </div>
   <div class="flex flex-col ml-3">
    <div class="flex ">
      <span class="mr-1 xt-font font-16 font-600 xt-text">{{ orderData?.LogisticCode }}</span>
      <SmallIcon icon="akar-icons:edit" class="xt-text pointer" style="font-size: 1.5rem;" @click="editCourier"/>
    </div>

    <div class="px-1.5 py-0.5">
     <span class="xt-font xt-text-2 font-14 font-400">{{ switchCompany }}</span>
     <span class="ml-1 xt-font xt-text-2 font-14 font-400">{{ orderData?.LogisticCode }}</span>
    </div>

   </div>
  </div>

  <GoodIcon v-show="goodIconVisible" :goodVisible="false" :windowHeight="innerHeight" @getAvatar="getAvatar" />

  <div class="flex items-center justify-center w-8 h-8 rounded-lg category-button pointer xt-bg-2" @click="removeItem()">
   <SmallIcon icon="akar-icons:trash-can" style="font-size: 1rem;"/>
  </div>

 </div>   
</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'

import GoodIcon from '../../../../../../selectIcon/page/index.vue'
import {kdCompany} from '../../mock'
export default {
 props:['orderData'],
 components:{
  SmallIcon,
  GoodIcon
 },
 data(){
  return{
  //  avatar:`https://a.apps.vip/icons/goodSelect/${this.orderData.icon.split(':')[1]}.svg`,
   goodIconVisible:false,
   innerHeight:100,
   defaultIcon:'fluent-emoji:package',
  }
 },

 computed:{
  detailAvatar(){
    return `https://a.apps.vip/icons/goodSelect/${this.defaultIcon.split(':')[1]}.svg`;
  },
  switchCompany(){
    return kdCompany(this.orderData.ShipperCode)
  }
 },

 methods:{
  editCourier(){},
  onUpdateImg(){
   this.goodIconVisible = !this.goodIconVisible
  },

  removeItem(){
    
  }
  // 获取头像
  // getAvatar(avatar){
  //   if(avatar.indexOf('color=') >= 0){
  //     let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
  //     this.bgColor = color
  //   }else{
  //     this.bgColor = ''
  //   }
  //   this.detailAvatar = avatar
  //  },
 }
}
</script>

<style lang="scss" scoped>
:deep(.float-icon){
  top:125px !important;
}
</style>