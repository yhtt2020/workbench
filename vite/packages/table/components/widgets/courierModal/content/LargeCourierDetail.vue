<template>
 <div class="flex flex-col" style="width: 976px;height: 600px;">
  <div class="w-full py-4 flex items-center justify-center" style="position: relative;">
    <HorizontalPanel :navList="flowType" v-model:selectType="defaultFlow"/>
    <div class="right-button flex">
     <div class="flex items-center px-2 py-1.5 justify-center category-button pointer rounded-lg xt-bg-2" @click="addCourier">
      <SmallIcon icon="fluent:add-16-filled" class="xt-text-2" style="font-size: 1.25rem;"/>
      <span class="xt-text-2">添加快递</span>
     </div>
     <div class="flex ml-3 items-center justify-center category-button pointer rounded-lg w-8 h-8 xt-bg-2" @click="close">
      <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/> 
     </div>
    </div>
  </div>
  
  <div class="px-6 flex justify-between">
    <div style="width: 452px;">
      <vue-custom-scrollbar :settings="settingsScroller" style="height:500px;">
        <div v-for="item in detailList" :class="{'select':currentID === item.id}" class="xt-text flex pointer rounded-lg xt-bg-2 courier-item mb-3 p-3" @click="seeDetail(item)">
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
              {{ item.goodDescription }}
            </div>
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
    <div style="width: 452px;">
      <UpdateIcon :orderData="rightList"/>
      <div class="xt-bg-2 px-4 rounded-lg">
        <vue-custom-scrollbar :settings="settingsScroller" style="height:426px;">
          <TimeLine :list="rightList?.flowDetail"/>
        </vue-custom-scrollbar>
      </div>
    </div>
  </div>

 </div>
 <AddCourierModal ref="addCourierRef" />
</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'
import { courierDetailList, courierType} from '../modalMock'

import HorizontalPanel from '../../../HorizontalPanel.vue'
import TimeLine from '../timeLine/index.vue'
import AddCourierModal from '../AddCourierModal.vue'
import UpdateIcon from '../updateIcon/index.vue'

export default {
 components:{
  SmallIcon,HorizontalPanel,TimeLine, AddCourierModal,UpdateIcon
 },

 data(){
  return{
    defaultFlow:{title:`全部${courierDetailList.length !== 0 ? `(${courierDetailList.length})` : '' } `,name:'all'},
    rightList:courierDetailList[0], // 接收选中的详情

    settingsScroller: { 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
    },

    currentID:courierDetailList[0].id
  }
 },

 computed:{
  flowType(){
    const allLength = courierDetailList.length;
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
  detailList(){
    switch (this.defaultFlow.name) {
      case 'all':
        return courierDetailList;
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
  }
  
 },

 methods:{
  close(){
   this.$emit('close')
  },

  // 根据不同标识进行背景色获取
  getBgColor(data){
    const findItem = courierType.find((item)=>{
      return item.name === data.status
    })
    return findItem
  },

  seeDetail(data){
    this.currentID = data.id
    this.rightList = data
  },

  addCourier(){
    this.$refs.addCourierRef.openCourierModel()
  }
 },

}
</script>

<style lang="scss" scoped>
.right-button{
 position: absolute;
 top: 16px;
 right: 16px;
}

:deep(.nav-item){
  width: 96px;
  border-radius: 8px !important;
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