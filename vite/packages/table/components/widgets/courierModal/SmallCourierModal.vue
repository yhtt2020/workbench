<template>
  <template v-if="!seeShow">
    <div class="flex flex-col" style="width: 500px; height:600px;">
      <div class="flex items-center justify-center h-16" style="position: relative;">
        <TopDrop :navList="typeList" v-model:selectType="currentType"/> 
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
      
      <template v-if="filterList.length === 0">
        <div class="flex flex-col items-center h-full justify-center px-6">
          <SmallIcon icon="fluent-emoji:package" style="font-size: 3.5rem;"/>
          <div class="my-4 xt-bg-2 xt-text rounded-lg px-4 py-3">
            在桌面上时刻关注你的快递动态，支持批量添加快递单号，自定义修改快递名称和图标。
          </div>
          <xt-button w="95" type="theme" h="40" @click="addCourier">添加快递</xt-button>
        </div>
      </template>
    
      <template v-else>
        <div class="px-6 flex flex-col" style="height: 510px;">
          <vue-custom-scrollbar :settings="settingsScroller">
            <div v-for="item in filterList" :class="{'select':currentID === item.id}" class="xt-text flex pointer rounded-lg xt-bg-2 courier-item mb-3 p-3" @click="seeDetail(item)">
              <div class="rounded-lg w-14 flex items-center mr-4 justify-center  h-14" style="background: var(--mask-bg);">
                <SmallIcon :icon="item.icon" style="font-size: 2rem;"/>
              </div>
              <div class="flex flex-col" style="width: calc(100% - 84px);">
                <div class="flex items-center justify-between ">
                  <span class="xt-font font-16 font-600">
                    {{ item.goodName }}
                  </span>
                  <div class="flex">
                    <div class="xt-bg xt-text rounded-lg" style="padding: 2px 6px;">{{ item.shipWay }}</div>
                    <div :style="{background:`${getBgColor(item).color}`,padding:'2px 6px'}" class="rounded-lg xt-active-text ml-2">
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
      </template>
    
    </div>
    
    <AddCourierModal ref="addCourierRef"/>
  </template>
 
  <template v-else>
    <LogisticsDetail :orderNum="seeItem" @close="close" @back="seeShow = false"/>
  </template>

</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'
import { courierType } from './modalMock'

import TopDrop from './dropdown/index.vue';
import AddCourierModal from './AddCourierModal.vue';
import LogisticsDetail from './content/LogisticsDetail.vue';

export default {
 components:{
  SmallIcon,TopDrop,AddCourierModal,LogisticsDetail
 },

 props:['list'],
 
 data(){
  return{
  //  typeList:courierType,
   currentType:{title:`全部${this.list.length !== 0 ? `(${this.list.length})` : '' }`,name:'all'},

   // 滚动条配置
   settingsScroller: { 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },

   seeShow:false,
   seeItem:{},
   currentID:this.list[0].id
  }
 },

 computed:{
  filterList(){
     switch (this.currentType.name) {
      case 'all':
        return this.list;
      case 'collect':
        return  this.list.filter((item)=>{ return item.status === 'collect' });
      case 'enRoute':
        return this.list.filter((item)=>{ return item.status === 'enRoute' });
      case 'delivery':
        return this.list.filter((item)=>{ return item.status === 'delivery' });
      case 'signed':
      return this.list.filter((item)=>{ return item.status === 'signed' });
     }
  },
  typeList(){
    const allLength = this.list.length;
    const received = this.list.filter((item)=>{ return item.status === 'collect' })
    const hasSigned = this.list.filter((item)=>{ return item.status === 'signed' })
    const onWay = this.list.filter((item)=>{ return item.status === 'enRoute' })
    const outDelivery = this.list.filter((item)=>{ return item.status === 'delivery' })
    const list = [...courierType]
    const filterList = list.map((item)=>{ 
      switch (item.name) {
        case 'all':
          return {title:`${item.title}${allLength.length !== 0 ? `(${allLength})`:''}`,name:item.name,type:item.type}
        case 'collect':
          return {title:`${item.title}${received.length !== 0 ? `(${received.length})`:''}`,name:item.name,type:item.type}
        case 'enRoute':
          return {title:`${item.title}${onWay.length !== 0 ? `(${onWay.length})`:''}`,name:item.name,type:item.type}
        case 'delivery':
          return {title:`${item.title}${outDelivery.length !== 0 ? `(${outDelivery.length})` : ''}`,name:item.name,type:item.type}
        case 'signed':
          return {title:`${item.title}${hasSigned.length !== 0 ? `(${hasSigned.length})`:''}`,name:item.name,type:item.type}
      }
    })
    return filterList
  }
 },

 methods:{
  close(){
    this.$emit('close')
  },
  addCourier(){
    this.$refs.addCourierRef.openCourierModel()
  },

  // 根据不同标识进行背景色获取
  getBgColor(data){
    const findItem = courierType.find((item)=>{
      return item.name === data.status
    })
    return findItem
  },

  // 查看快递详情
  seeDetail(data){
    this.seeShow = true
    this.currentID = data.id
    this.seeItem = data
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

/**
:deep(.courier-item){
  &:hover{
    background: var(--active-secondary-bg) !important;
  }
}
**/

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