<template>
  <div class="flex flex-col px-6 xt-text">
    <div class="w-full p-4 mb-3 rounded-lg xt-bg-2">
      <div class="flex items-center justify-between h-8 mb-4">
        <div class="flex items-center">
          <div class="flex justify-center w-8 h-8 rounded-lg xt-font font-19 font-500 items-enter" style="background:#E12419;line-height: 32px;color:var(--active-text);">JD</div>
          <span class="ml-3">{{ storeInfo.jd.nickname === null ? '京东': `京东（${storeInfo.jd.nickname}）`}}</span>
        </div>
        <xt-button w="32" v-if="storeInfo.jd.nickname === null" style="color: var(--active-bg) !important;" @click="bindJd">关联</xt-button>
        <xt-button  w="63" v-else style="color:var(--error) !important;" @click="unbindJd">解除关联</xt-button>
      </div>

      <a-divider style="height: 1px; background-color: var(--divider-text); margin: 0; " />

      <div class="flex items-center justify-between h-8 mt-4">
        <div class="flex items-center">
          <div class="flex justify-center w-8 h-8 rounded-lg xt-font font-19 font-500 items-enter" style="background:#FA5000;line-height: 32px;color:var(--active-text);">淘</div>
          <span class="ml-3">{{ storeInfo.tb.nickname === null ? '淘宝': `淘宝（${storeInfo.tb.nickname}）`}}</span>
        </div>
        <xt-button w="32" v-if="storeInfo.tb.nickname === null" style="color: var(--active-bg) !important;" @click="bindTb">关联</xt-button>
        <xt-button  w="63" v-else style="color:var(--error) !important;" @click="unbindTb">解除关联</xt-button>
      </div>

    </div>

    <div class="flex flex-col w-full p-4 mb-4 rounded-lg xt-bg-2 items-enter">

      <div class="flex justify-between mb-4">
        <span>自动刷新电商平台订单数据</span>
        <a-switch v-model:checked="settings.courierRefresh.autoRefresh"></a-switch>
      </div>

      <a-select :bordered="false" class="rounded-lg xt-bg" v-model:value="settings.courierRefresh.autoTime"
       :options="autoRefreshTime"
      >
      </a-select>

      <span class="mt-4 xt-text-2 xt-font font-14 font-400">仅对电商平台快递订单有效。（自定义添加的快递订单默认会定期自动更新，不需要设置）</span>

      <xt-button @click="clear" :radius="6" type="error" size="mini"  :h="34"  class="mt-2 " style="width: 100%"> 清空全部数据</xt-button>
    </div>

    <div class="flex flex-col w-full p-4 rounded-lg xt-bg-2 items-enter">
      <div class="flex flex-col">
        <span class="mb-4 xt-font xt-text font-16 font-400">自动检测快递单号</span>
        <RadioTab class="xt-bg" :height="40" :navList="autoCourier" v-model:selectType="defaultAuto" ></RadioTab>
        <span class="mt-4 xt-text-2 xt-font font-14 font-400">
          由于各家快递公司的单号名称规则不同，选择模糊匹配可以识别到更多的快递单号。
        </span>
      </div>

      <a-divider style="height: 1px; background-color: var(--divider-text); margin: 16px 0; " />

      <div class="flex flex-col">
        <div class="flex justify-between mb-2.5">
          <span class="xt-font xt-text font-16 font-400">状态栏图标</span>
          <a-switch v-model:checked="settings.courierStatus.statusBar"></a-switch>
        </div>
        <span class="xt-text-2 mb-2.5 xt-font font-14 font-400">在顶部状态栏左侧显示当前快递包裹数量。</span>
        <!-- {{ settings.courierStatus.currentStatus }} -->
        <a-select class="rounded-lg xt-bg"  :bordered="false" :options="statusSelect" v-model:value="settings.courierStatus.currentStatus"></a-select>
      </div>

      <a-divider style="height: 1px; background-color: var(--divider-text); margin: 16px 0; " />

      <div class="flex flex-col">
        <div class="flex justify-between mb-2.5">
          <span class="xt-font xt-text font-16 font-400">显示隐藏的快递</span>
          <a-switch v-model:checked="settings.relevanceEnable"></a-switch>
         </div>
         <span class="xt-font xt-text-2 font-14 font-400">仅支持关联电商平台的快递。</span>
      </div>

      <a-divider style="height: 1px; background-color: var(--divider-text); margin: 16px 0; " />

      <div class="flex flex-col">
        <div class="flex justify-between mb-4">
          <span>到期自动取消关注并隐藏已签收订单</span>
          <a-switch v-model:checked="settings.courierSigned.blockSigned"></a-switch>
        </div>

        <a-select class="rounded-lg xt-bg"  :bordered="false" :options="autoCancelTime" v-model:value="settings.courierSigned.courierTime"></a-select>

        <span class="xt-text-2 mt-2.5 xt-font font-14 font-400">已签收的订单到达以上时间后自动取消关注该订单，并设置为隐藏。</span>
      </div>
    </div>
  </div>

  <DealModal ref="dealModalRef" :type="dealType"/>
  <Disassociation ref="disassociationRef" :type="dealType"/>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { courierStore } from "../../../../apps/ecommerce/courier";
import { autoRefreshTime, autoCancelTime } from "./modalMock";
import { appStore } from "../../../../store";
import { message, Modal } from 'ant-design-vue'

import RadioTab from "../../../RadioTab.vue";
import DealModal from "./DealModal.vue";
import Disassociation from "./Disassociation.vue";
import ui from '../lib/courierUI'

export default {
  components: {
    RadioTab,DealModal,Disassociation
  },

  data() {
    return {
      autoCourier: [
        { title: "关闭", name: "close" },
        // { title: "模糊匹配", name: "blurMatch" },
        { title: "精准匹配", name: "preciseMatch" },
      ],
      defaultAuto: { title: "精准匹配", name: "preciseMatch" },

      statusSelect: [{ value: "unFinished" ,label:'未完成订单'}, { value: "followed",label:'关注的订单' }],
      autoRefreshTime,
      autoCancelTime,
      dealType:''
    };
  },

  computed: {
    ...mapWritableState(courierStore, ["storeInfo",'settings']),
  },

  methods: {
    ...mapActions(courierStore,['clearDb']),
    clear(){
      Modal.confirm({
        centered:true,
        content:'是否清空全部的数据？此操作不可恢复。清空后仍可通过刷新重新获取订单。',
        onOk:async () => {
          let rs = await this.clearDb()
          if (rs) {
            message.success('清空数据成功。')
          } else {
            message.error('清空失败。')
          }
        }
      })
    },
    // 关联京东
    bindJd() {
      if (!this.storeInfo.jd.nickname){
        this.dealType = 'jd'
        this.$refs.dealModalRef.openDealDetail()
      }
      else {
        message.loading({
          content:"已绑定账号：" + this.storeInfo.jd.nickname + "，正在为您更新订单信息，请稍候…",
          key: "loadingTip",
          duration: 0,
        });
        grab.jd.getOrder(async ({ data }) => {
          message.success({
            content:  "更新订单成功!本次共更新：" + data.orders.length + "条订单信息",
            key: "loadingTip",
            duration: 3,
          });
          this.storeInfo.jd.order = data;
          await ui.getJdOrderDetail(data.orders);
        });
      }
    },

    // 关联淘宝
    bindTb() {
      if(!this.storeInfo.tb.nickname){
        this.dealType = 'tb'
        this.$refs.dealModalRef.openDealDetail()
      }else {
        ui.getTbOrders()
      }
    },

    // 解除淘宝关联
    unbindTb() {
      this.dealType = 'tb'
      this.$refs.disassociationRef.openDisassociation()

    },
    unbindJd(){
      this.dealType = 'jd'
      this.$refs.disassociationRef.openDisassociation()
    }
  },
  watch: {
    defaultAuto(){
      this.settings.courierMatch=this.defaultAuto.name
      // console.log(this.defaultAuto)
    }
  },
  mounted() {
    this.defaultAuto=this.autoCourier.filter(item=>item.name===this.settings.courierMatch)[0]
    // console.log(temp)
  },
}
</script>

<style lang="scss" scoped>
:deep(.nav-box) {
  border-radius: 8px !important;
}
:deep( .xt-active-btn span){
  color: rgba(255,255,255,0.85) !important;
}

:deep(.ant-select-selector){
  border-radius: 8px !important;
  display: flex;
  align-items: center;
  height: 40px !important;
}

:deep(.ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder){
  color: var(--secondary-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.ant-select-selection-search){
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}
</style>
