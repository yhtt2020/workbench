<template>
 <teleport to='body' >
   <Modal v-model:visible="dealVisible" v-if="dealVisible" :blurFlag="true" style="z-index: 515;">
    <div class="xt-text" style="width: 500px;height: 537px;">
     <div class="w-full flex items-center justify-center py-4" style="position: relative;">
      <span class="xt-text xt-font font-16 font-400">协议说明</span>
      <div class="flex right-button">
        <xt-button w="32" h="32" style="border-radius: 8px !important;" @click="dealVisible = false">
          <div class="flex items-center justify-center">
            <DealIcon icon="fluent:dismiss-16-filled" class="xt-text-2" style="font-size: 1.2rem;" />
          </div>
        </xt-button>
      </div>
     </div>
    
     <div class="px-6 flex flex-col">
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


      <div class="flex xt-bg-2 items-center justify-center rounded-lg" style="height: 264px;">
        协议内容
      </div>
     </div>

     <div class="flex justify-end items-center p-4" style="height: 72px;">
      <xt-button w="64" h="40" class="mr-3" @click="dealVisible = false">取消</xt-button>
      <xt-button w="64" h="40" type="theme" @click="agreeRelevance">同意</xt-button>
      <!-- <div>123</div>
      <div>456</div> -->
     </div>
    </div>
   </Modal>
 </teleport>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { Icon as DealIcon } from '@iconify/vue'
import grab from "../grab";
import { message } from "ant-design-vue";
import { courierStore } from "../../../../store/courier";

import Modal from '../../../Modal.vue';

export default {
 props:['type'],

 components:{
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
      grab.tb.login((args) => {
        this.storeInfo.tb.nickname = args.data.nickname;
        this.dealVisible  = false
        message.loading({
          content: "已成功绑定淘宝账号：" +   args.data.nickname + "，正在为您获取订单信息，请稍候…",
          key: "loadingTip",
          duration: 0,
        });
        // grab.tb.getOrder((args) => {
        //   console.log('查看数据',args);
        //   if (args.status === 0) {
        //     if (args.code === 401) {
        //       message.error("获取订单失败，检测到登录信息过期，请重新登录。");
        //       this.storeInfo.tb.nickname = null;
        //       this.bindTb();
        //       return;
        //     }
        //     message.error("获取订单意外失败。");
        //     return;
        //   }
        //   message.success({
        //     content:  "更新订单成功!本次共更新：" +  args.data.orders.length + "条订单信息",
        //     key: "loadingTip",
        //     duration: 3,
        //   });
        //   this.getOrderDetail(args.data.orders)
        //   console.log(args);
        // });
      });
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
</style>