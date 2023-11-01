<template>
 <div class="flex flex-col" style="width: 976px;height: 600px;">
  <div class="flex items-center justify-center w-full py-4" style="position: relative;">
   <HorizontalPanel :navList="flowType" v-model:selectType="defaultFlow"/>

   <div class="flex right-button">
    <div class="flex items-center px-2 py-1.5 justify-center category-button pointer rounded-lg xt-bg-2" @click="addCourier">
     <SmallIcon icon="fluent:add-16-filled" class="xt-text-2" style="font-size: 1.25rem;"/>
    </div>

    <div class="flex items-center px-2 py-1.5 ml-3 justify-center category-button pointer rounded-lg xt-bg-2" @click="openSetting">
     <SmallIcon icon="fluent:settings-16-regular" class="xt-text-2" style="font-size: 1.25rem;"/>
    </div>


    <div class="flex items-center justify-center w-8 h-8 ml-3 rounded-lg category-button pointer xt-bg-2" @click="close">
     <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/> 
    </div>
   </div>
  </div>

  <template v-if="largeList?.length === 0">
   <div class="flex flex-col items-center justify-center h-full px-6">
     <SmallIcon icon="fluent-emoji:package" style="font-size: 3.5rem;"/>
     <div class="px-4 py-3 my-4 rounded-lg xt-bg-2 xt-text">
       在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标。
     </div>
     <xt-button w="95" type="theme" h="40" @click="addCourier">添加快递</xt-button>
   </div>
  </template>

  <template v-else>
   <div class="flex justify-between px-6">

    <SortList v-if="allVisible" :list="filterList"  @rightSelect="getRightItem"/>

    <div style="width: 452px;" v-else class="flex flex-col">
     <vue-custom-scrollbar :settings="settingsScroller" style="height:500px;">
      <div v-for="item in otherList" :class="{'select':currentID === item.id}" class="flex p-3 mb-3 rounded-lg xt-text pointer xt-bg-2 courier-item" @click="seeDetail(item)">
       <div class="flex items-center justify-center mr-4 rounded-lg w-14 h-14" style="background: var(--mask-bg);">
        <SmallIcon :icon="item.icon" style="font-size: 2rem;"/>
       </div>

       <div class="flex flex-col" style="width: calc(100% - 84px);">
        <div class="flex items-center justify-between ">
         <span class="xt-font font-16 font-600">
          {{ item.goodName }}
         </span>

         <div class="flex">
          <div class="rounded-lg xt-bg xt-text" style="padding: 2px 6px;">{{ item.shipWay }}</div>
          <div :style="{background:`${getBgColor(item).color}`,padding:'2px 6px'}" class="ml-2 rounded-lg xt-active-text">
           {{ getBgColor(item).title }}
          </div>
         </div>
        </div>

        <div class="my-2">{{ item.time }}</div>
        <div class="summary">
         {{ item.summary }}
        </div>
       </div>
      </div>
     </vue-custom-scrollbar>
    </div>

    <div style="width: 452px;">
     <UpdateIcon :orderData="rightList"/>
     <div class="px-4 rounded-lg xt-bg-2">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;">
       <TimeLine :list="rightList?.flowDetail"/>
      </vue-custom-scrollbar>
     </div>
    </div>
   </div>
  </template>

 </div>

 <AddCourierModal ref="addCourierRef"/>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierDetailList, courierType} from '../modalMock'

import HorizontalPanel from '../../../../HorizontalPanel.vue'
import TimeLine from '../timeLine/index.vue'
import AddCourierModal from '../AddCourierModal.vue'
import UpdateIcon from '../updateIcon/index.vue'
import SortList from '../dropdown/SortList.vue'

export default {
 props:[''],

 components:{
  SmallIcon,HorizontalPanel,TimeLine,AddCourierModal,UpdateIcon,SortList
 },

 data(){
  return{
   largeList:courierDetailList,
   
   settingsScroller: { 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },

   defaultFlow:{title:`全部${courierDetailList.length !== 0 ? `(${courierDetailList.length})` : '' } `,name:'all'},
  
   currentID:courierDetailList[0].id,

   rightList:courierDetailList[0], // 接收选中的详情
  }
 },

 computed:{
  ...mapWritableState(courierModalStore,['sortList']),
  flowType(){
   const allLength = this.largeList.length;
   const received = courierDetailList.filter((item)=>{ return item.status === 'collect' })
   const hasSigned = courierDetailList.filter((item)=>{ return item.status === 'signed' })
   const onWay = courierDetailList.filter((item)=>{ return item.status === 'enRoute' })
   const outDelivery = courierDetailList.filter((item)=>{ return item.status === 'delivery' })
   const list = [...courierType]
   const filterList = list.map((item)=>{ 
    switch (item.name) {
     case 'all':
      return {title:`${item.title}${allLength.length !== 0 ? `(${allLength})` : ''}`,name:item.name,type:item.type}
     case 'collect':
      return {title:`${item.title}${received.length !== 0 ? `(${received.length})`:''}`,name:item.name,type:item.type}
     case 'enRoute':
      return {title:`${item.title}${onWay.length !== 0 ? `(${onWay.length})`:''}`,name:item.name,type:item.type}
     case 'delivery':
      return {title:`${item.title}${outDelivery.length !== 0 ? `(${outDelivery.length})`:''}`,name:item.name,type:item.type}
     case 'signed':
      return {title:`${item.title}${hasSigned.length !== 0 ? `(${hasSigned.length})`:''}`,name:item.name,type:item.type}
    }
   })

   return filterList
   
  },

  filterList(){
    if(this.allVisible){
     if(this.sortList.length !== 0){
      return this.sortList
     }else{
      return courierDetailList
     }
    }
  },

  otherList(){
   switch (this.defaultFlow.name){
    case 'collect':
     const colList = courierDetailList.filter((item)=>{ return item.status === 'collect' });
     return colList ;
    case 'delivery':
     const deliList = courierDetailList.filter((item)=>{ return item.status === 'delivery' });
     return deliList;
    case 'enRoute':
     const wayList = courierDetailList.filter((item)=>{ return item.status === 'enRoute' });
     return wayList;
    case 'signed':
     const signList = courierDetailList.filter((item)=>{ return item.status === 'signed' });
     return signList;
   }
  },

  allVisible(){
   return this.defaultFlow.name === 'all'
  },
  
 },

 methods:{
  // 添加快递入口
  addCourier(){
   this.$refs.addCourierRef.openCourierModel()
  },

  // 打开设置
  openSetting(){},

  // 关闭按钮
  close(){
   this.$emit('close')
  },

  seeDetail(data){
   this.currentID = data.id
   this.rightList = data
  },

  // 根据不同标识进行背景色获取
  getBgColor(data){
   const findItem = courierType.find((item)=>{
    return item.name === data.status
   })
   return findItem
  },


  getRightItem(data){
   this.rightList = data
  }
 }

};
</script>

<style lang="scss" scoped>
.right-button{
 position: absolute;
 top: 16px;
 right: 16px;
}

:deep(.nav-item){
 width: 96px;
 height: 24px !important;
 border-radius: 8px !important;
}

:deep(.state-bg){
  height: 32px !important;
}

.summary{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  font-size: 14px;
  color: var(--primary-text);
  font-weight: 400;
}
.select{
  background: var(--active-secondary-bg) !important;
}

</style>