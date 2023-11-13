<template>
 <a-dropdown :trigger="['hover']" placement="bottomRight">
  <a-tooltip placement="top" :class="mClass" title="添加">
   <xt-button w="32" h="32" class="rounded-md" :style="{background:`${dropStyle}`}" style="border-radius: 8px !important;" @click="openAddModal">
     <div class="flex items-center justify-center">
      <DropIcon icon="fluent:add-16-filled" class="xt-text-2" style="font-size: 1.25rem;" />
     </div>
   </xt-button>
  </a-tooltip>

  <template #overlay>
   <a-menu class="flex flex-col xt-bg-2" style="width: 200px;border-radius: 8px; padding: 8px;">
    <a-menu-item v-for="item in navList" class="flex flex-col w-full rounded-lg xt-text nav-item"
     @click.prevent="item.callBack"
    >
     <div class="flex " v-if="item.name === 'tb'">
      <div class="flex justify-center w-5 h-5 rounded-md xt-font font-14 font-500 items-enter" style="background:#FA5000;line-height: 20px;color:var(--active-text);">淘</div>
      <span class="ml-3"  :style="storeInfo.tb.nickname !== null ? {color:'var(--secondary-text) !important'} : {color:'var(--primary-text) !important'} ">{{ item.title }}</span>
      <span class="ml-4" v-if="storeInfo.tb.nickname !== null" style="color:var(--secondary-text) !important;">已关联</span>
      <span class="ml-4" v-else style="color:var(--active-bg) !important;" @click="toTbRelevance">未关联</span>
     </div>
     <div class="flex " v-if="item.name === 'jd'">
      <div class="flex justify-center w-5 h-5 rounded-md xt-font font-14 font-500 items-enter" style="background:#E12419;line-height: 20px;color:var(--active-text);">JD</div>
      <span class="ml-3" :style="storeInfo.jd.nickname !== null ? {color:'var(--secondary-text) !important'} : {color:'var(--primary-text) !important'} ">{{ item.title }}</span>
      <span class="ml-4" v-if="storeInfo.jd.nickname !== null" style="color:var(--secondary-text) !important;">已关联</span>
      <span class="ml-4" v-else style="color:var(--active-bg) !important;" @click="toJdRelevance">未关联</span>
     </div>

     <div v-if="item.icon" class="flex items-center">
      <DropIcon :icon="item.icon" class="xt-text-2" style="font-size: 1.25rem;" />
      <span class="ml-3">{{ item.title }}</span>
     </div>
    </a-menu-item>
   </a-menu>
  </template>
 </a-dropdown>

 <DealModal :type="dropType" ref="dropModalRef"/>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import { Icon as DropIcon } from '@iconify/vue'
import { courierStore } from '../../../../../apps/ecommerce/courier';

import DealModal from '../DealModal.vue';

export default {
 props:{
   //列表
   navList: {
      type: Array,
      default: () => []
    },
    // 当前选中的内容
    selectType: {
      type: Object,
      default: () => {}
    },
   dropStyle:{
    type:String,
    default:''
   },
   mClass:{
    type:String,
    default:'mr-3'
   }
 },

 components:{
  DropIcon,DealModal
 },

 data(){
  return{
   dropType:''
  }
 },

 computed:{
  ...mapWritableState(courierStore,['storeInfo']),
 },



 methods:{
  toJdRelevance(){
   this.dropType = 'jd'
   this.$refs.dropModalRef.openDealDetail()
  },
  toTbRelevance(){
   this.dropType = 'tb'
   this.$refs.dropModalRef.openDealDetail()
  },
  openAddModal(){
    this.$emit('open')
  }
 }
}
</script>

<style lang="scss" scoped>
:deep(.nav-item){
  &:hover{
   background: var(--active-secondary-bg) !important;
  }
}

:deep(.ant-dropdown-menu-item){
  align-items: start !important;
}
</style>
