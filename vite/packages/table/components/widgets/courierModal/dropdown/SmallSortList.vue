<template>
 <div class="flex flex-col px-6">
  <div  class="h-11 xt-bg-2 mb-3 rounded-lg flex items-center justify-between  px-4 py-3">
   <span class="xt-text-2 font-14 font-400">「全部」分类下支持拖拽排序。</span>
   <!-- <div class="flex items-center justify-center">
   </div> -->
  </div>
  <vue-custom-scrollbar :settings="settingsScroller">
  <div style="height:480px;" ref="dropRef">
   <div v-for="item in list"  :class="{'select':currentID === item.id}" class="xt-text flex pointer rounded-lg xt-bg-2 courier-item mb-3 p-3" @click="seeDetail(item)">
    <div class="rounded-lg w-14 flex items-center mr-4 justify-center w-14 h-14" style="background: var(--mask-bg);">
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

     <div class="my-1.5 font-14 font-400 xt-text-2">{{ item.time }}</div>
     <div class="summary">
      {{ item.summary }}
     </div>
    </div>
   </div>
   <div style="height: 12px;"></div>
  </div>
  </vue-custom-scrollbar>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { Icon as SmallIcon } from '@iconify/vue'
import { courierType } from '../modalMock'
import Sortable from 'sortablejs'

export default {
 props: ["list"],

 components:{
  SmallIcon
 },

 data(){
  return {
   settingsScroller: { 
    useBothWheelAxes: true,
    swipeEasing: true,
    suppressScrollY: false,
    suppressScrollX: true,
    wheelPropagation: true
   },
   
   currentID:this.list[0].id,
   
  }
 },

 computed:{
  
 },
 

 mounted(){
  this.$nextTick(()=>{
   const el = this.$refs.dropRef
   new Sortable(el,{
    group: 'sortableGroup',
    onEnd: this.onSortEnd // 拖拽结束时触发的回调函数
   })
  })
 },

 methods:{
  ...mapActions(courierModalStore,['updateSmallSortList']),
  onSortEnd(evt){
   let newIndex = evt.newIndex , oldIndex = evt.oldIndex
   let newItem = this.$refs.dropRef.children[newIndex]
   let oldItem = this.$refs.dropRef.children[oldIndex]
   // 先删除移动的节点
   this.$refs.dropRef.removeChild(newItem)
   // 再插入移动的节点到原有节点，还原了移动的操作
   if (newIndex > oldIndex) {
    this.$refs.dropRef.insertBefore(newItem, oldItem)
   } else {
    this.$refs.dropRef.insertBefore(newItem, oldItem.nextSibling)
   }

   // 将数组进行排序
   let cloneTemp = [...this.list]  // 将父组件传入的数据进行克隆
   let temp = cloneTemp[evt.oldIndex]  // 获取旧的下标
   cloneTemp.splice(evt.oldIndex, 1)   // 移除旧的下标
   cloneTemp.splice(evt.newIndex, 0, temp) // 将旧的下标进行替换
   // this.detailList = cloneTemp
   this.updateSmallSortList(cloneTemp)
  },

  seeDetail(data){
   this.currentID = data.id
   this.$emit('rightSelect',data)
  },

  // 根据不同标识进行背景色获取
  getBgColor(data){
    const findItem = courierType.find((item)=>{
      return item.name === data.status
    })
    return findItem
  },

 },

};
</script>

<style lang="scss" scoped>

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