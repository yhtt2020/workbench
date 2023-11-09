<template>
 <div class="flex flex-col" style="width: 500px;height: 600px;">
  <div class="flex items-center justify-center h-16" style="position: relative;">
   <div class="left-back">
    <a-tooltip placement="top">
      <template #title>
        <span class="xt-text-2">返回</span>
      </template>
      <xt-button w="32" h="32"  @click="back" style="border-radius: 8px !important;">
        <div class="flex items-center justify-center rounded-lg xt-bg-2 pointer category-button " >
          <SmallIcon icon="fluent:chevron-left-16-filled" class="xt-text-2" style="font-size:1.2rem;"/>
        </div>
      </xt-button>
    </a-tooltip>
   </div>

   <div class="xt-text font-16 font-400 ">物流详情</div>
    
   <div class="flex top-right">
    <DropIndex :navList="addList"/>

    <a-tooltip placement="top" title="关闭">
      <xt-button w="32" h="32"  @click="close" style="border-radius: 8px !important;">
        <div class="flex items-center justify-center rounded-lg category-button pointer xt-bg-2">
          <SmallIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;"/> 
        </div> 
      </xt-button>
    </a-tooltip>
   </div>
  </div>

   <div class="flex flex-col px-6">
    <UpdateIcon :orderData="orderNum"/>

    <div class="flex flex-col xt-bg-2 px-3 mb-4 py-2.5 rounded-md">
      <div class="flex justify-between w-full">
        <span class="summary xt-text font-14 font-400" style="max-width: 335px;">IKEA宜家弗瑞顿转角沙发床带储物坐卧两用客厅简约</span>
        <span class="xt-font font-16 font-600 xt-text">￥2810</span>
      </div>
      <div class="flex justify-between w-full my-1.5">
        <span class="xt-text-2 font-14 font-400">弗瑞顿 深灰色 惠力尔沙发 2米以上</span>
        <span class="xt-text-2 font-14 font-400">x1</span>
      </div>
      <template v-if="detailVisible">
        <div class="flex justify-between w-full my-1.5">
          <span class="xt-text-2 font-14 font-400">下单时间：2023-10-31 20:00:23</span>
          <span class="xt-text-2 font-14 font-400">xxxx(收)</span>
        </div>
        <div class="flex w-full mb-2">
          <span class="xt-text-2 font-14 font-400">
            订单编号：{{ orderNums }}
          </span>
          <div class="flex items-center pointer justify-center" @click="copyOrderNum">
            <DetailIcon icon="fluent:copy-16-regular" class="xt-text-2" style="font-size: 1.25rem;" />
          </div>
        </div>
    
        <div class="flex items-center justify-center w-full">
          <xt-button h="20" @click="detailVisible = false">
            <div class="flex items-center justify-center">
              <span class="xt-text-2">收起</span>
              <SmallIcon class="xt-text-2" icon="ri:arrow-up-s-line" style="font-size: 1.25rem;"/>
            </div>
          </xt-button>
        </div>
      </template>
  
      <template v-else>
        <div class="flex items-center justify-center w-full">
          <xt-button h="20" @click="detailVisible = true">
            <div class="flex items-center justify-center">
              <span class="xt-text-2">更多信息</span>
              <SmallIcon class="xt-text-2" icon="ri:arrow-down-s-line" style="font-size: 1.5rem;"/>
            </div>
          </xt-button>
        </div>
      </template>
    </div>

    <div class="px-4 rounded-lg xt-bg-2">
      <vue-custom-scrollbar :settings="settingsScroller" :style="detailVisible ? {height:'228px'} :{height:'291px'}">
        <div class="flex items-center justify-center">
          <div class="px-1.5 py-0.5 my-4 font-14 font-400 rounded-md xt-bg" style="color:var(--active-bg);">
            预计11月4日15:00-19:00到达
          </div>
        </div>
        <TimeLine :list="orderNum?.Traces"/>
      </vue-custom-scrollbar>
    </div>
   </div>
 </div>
  
 <AddCourierModal ref="addCourierRef" />

</template>

<script>
import { Icon as SmallIcon } from '@iconify/vue'
import useClipboard from 'vue-clipboard3';
import { message,Modal } from 'ant-design-vue'

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
    ],

    orderNums:'2325336804199588681',
    detailVisible:false,

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
  },
  // 复制订单号
  async copyOrderNum(){
    const { toClipboard } = useClipboard();
    const res = await toClipboard(this.orderNum);
    if(res.text !== ""){
      message.success('订单号复制成功');
    }
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