<template>
 <teleport to='body' >
   <xt-modal :footer="false" v-model="dealVisible" v-if="dealVisible" title="协议说明" :blurFlag="true" :index="1002">
     <template #footer>
       <div class="flex justify-end items-center p-4" style="height: 72px;">
         <xt-button w="64" h="40" class="mr-3" @click="dealVisible = false">取消</xt-button>
         <xt-button w="64" h="40" type="theme" @click="agreeRelevance">同意</xt-button>
       </div>
     </template>
    <div class="xt-text h-full" style="width: 500px;height: 537px;">


     <div class="px-6 flex flex-col  h-full">
      <div class="flex xt-bg-2 px-4 py-3 flex-col rounded-lg mb-3">
        <span class="xt-text-2 font-400 font-14 ">
          请阅读以下协议说明内容，同意后将打开对应的登录网页，完成登录操作即可。
        </span>
        <span class="xt-text-2 font-400 font-14 my-2">查看以下视频，了解此功能的详细说明</span>
        <xt-button w="100%" h="22" style="justify-content: start !important;" @click="toDealLink">
          <div class="flex items-center w-full">
            <DealIcon icon="ri:bilibili-line" style="font-size: 1.2rem;color:rgba(0,174,236,1);"/>
            <span style="color:rgba(0,174,236,1);" class="ml-2 font-16 font-400">想天工作台「我的快递」小组件技术解析</span>
          </div>
        </xt-button>
      </div>


      <div class="flex xt-bg-2 items-center justify-center rounded-lg p-4" style="height:100%">
       <Article style="line-height: 1.2" contentStyle="content-style" :showTitle="false" art-name="courier_bind_protocol"></Article>
      </div>
     </div>


    </div>
   </xt-modal>
 </teleport>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { Icon as DealIcon } from '@iconify/vue'
import grab from "../lib/grab";
import { message } from "ant-design-vue";
import { courierStore } from "../../../../apps/ecommerce/courier";

import Modal from '../../../Modal.vue';
import ui from '../lib/courierUI'
import Article from '../../../Article.vue'

export default {
 props:['type'],

 components:{
   Article,
  Modal,DealIcon
 },

 data(){
  return{
   dealVisible:false,
  }
 },

 computed:{
  ...mapWritableState(courierStore, ["storeInfo"]),
 },

 methods:{
  openDealDetail(){
   this.dealVisible = true
  },

  // 查看协议说明详情
  toDealLink(){},


  // 同意关联
  agreeRelevance(){
    if(this.type === 'tb'){
      ui.bindTb(()=>{
        this.dealVisible=false
      })
    }else{
      grab.jd.login(({ data }) => {
        this.storeInfo.jd.nickname = data.nickname;
        this.dealVisible  = false
        message.loading({
          content:"已成功绑定账号：" + data.nickname + "，正在为您获取订单信息，请稍候…",
          key: "loadingTip",
          duration: 0,
        });
        grab.jd.getOrder(async ({ data }) => {
          // console.log(data)
          message.success({
            content:
              "更新订单成功!本次共更新：" +
              data.orders.length +
              "条订单信息",
            key: "loadingTip",
            duration: 3,
          });
          this.storeInfo.jd.order = data;
          await this.getOrderDetail(data.orders);
          // console.log(data);
        });
      });
    }
  }


 }
};
</script>

<style lang="scss" scoped>
.right-button {
 position: absolute;
 top: 16px;
 right: 16px;
}
.content-style{
  line-height: 1.5;
}
</style>
