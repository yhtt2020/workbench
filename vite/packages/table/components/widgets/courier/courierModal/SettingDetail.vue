<template>
  <div class="xt-text flex flex-col px-6">
    <div class="xt-bg-2 rounded-lg mb-3 p-4 w-full">
      <div class="mb-4 flex items-center justify-between h-8">
        <div class="flex items-center">
          <div class="xt-font font-19 font-500 w-8 h-8 rounded-lg flex items-enter justify-center" style="background:#E12419;line-height: 32px;color:var(--active-text);">JD</div>
          <span class="ml-3">{{ storeInfo.jd.nickname === null ? '京东': `京东（${storeInfo.jd.nickname}）`}}</span>
        </div>
        <xt-button w="32" v-if="storeInfo.jd.nickname === null" style="color: var(--active-bg);" @click="bindJd">关联</xt-button>
        <xt-button  w="63" v-else style="color:var(--error) !important;" @click="unbindJd">解除关联</xt-button>
      </div>

      <a-divider style="height: 1px; background-color: var(--divider-text); margin: 0; " />

      <div class="mt-4 flex items-center justify-between h-8">
        <div class="flex items-center">
          <div class="xt-font font-19 font-500 w-8 h-8 rounded-lg flex items-enter justify-center" style="background:#FA5000;line-height: 32px;color:var(--active-text);">淘</div>
          <span class="ml-3">{{ storeInfo.tb.nickname === null ? '淘宝': `淘宝（${storeInfo.tb.nickname}）`}}</span>
        </div>
        <xt-button w="32" v-if="storeInfo.tb.nickname === null" style="color: var(--active-bg);" @click="bindTb">关联</xt-button>
        <xt-button  w="63" v-else style="color:var(--error) !important;" @click="unbindTb">解除关联</xt-button>
      </div>

    </div>

    <div class="xt-bg-2 w-full flex items-enter mb-4 rounded-lg flex-col p-4">

      <div class="flex justify-between mb-4">
        <span>自动刷新电商平台订单数据</span>
        <a-switch v-model:checked="settings.courierRefresh.autoRefresh"></a-switch>
      </div>

      <a-select :bordered="false" class="xt-bg rounded-lg" v-model:value="settings.courierRefresh.autoTime"
       :options="autoRefreshTime"
      >
      </a-select>

      <span class="mt-4 xt-text-2 xt-font font-14 font-400">仅对电商平台快递订单有效。（自定义添加的快递订单默认会定期自动更新，不需要设置）</span>

    </div>

    <div class="xt-bg-2 w-full flex items-enter rounded-lg flex-col p-4">
      <div class="flex flex-col">
        <span class="xt-font xt-text mb-4 font-16 font-400">自动检测快递单号</span>
        <RadioTab class="xt-bg" :height="40" :navList="autoCourier" v-model:selectType="defaultAuto"></RadioTab>
        <span class="xt-text-2 mt-4 xt-font font-14 font-400">
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

        <a-select class="xt-bg rounded-lg"  :bordered="false" :options="statusSelect" v-model:value="settings.courierStatus.currentStatus"></a-select>
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

        <a-select class="xt-bg rounded-lg"  :bordered="false" :options="autoCancelTime" v-model:value="settings.courierSigned.courierTime"></a-select>

        <span class="xt-text-2 mt-2.5 xt-font font-14 font-400">已签收的订单到达以上时间后自动取消订阅该订单，并设置为隐藏。</span>
      </div>
    </div>
  </div>

  <DealModal ref="dealModalRef" :type="dealType"/>
  <Disassociation ref="disassociationRef" :type="dealType"/>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { courierStore } from "../../../../store/courier";
import { autoRefreshTime, autoCancelTime } from "./modalMock";
import { appStore } from "../../../../store";
import { message } from "ant-design-vue";

import RadioTab from "../../../RadioTab.vue";
import DealModal from "./DealModal.vue";
import Disassociation from "./Disassociation.vue";

export default {
  components: {
    RadioTab,DealModal,Disassociation
  },

  data() {
    return {
      autoCourier: [
        { title: "关闭", name: "close" },
        { title: "模糊匹配", name: "blurMatch" },
        { title: "精准匹配", name: "preciseMatch" },
      ],
      defaultAuto: { title: "模糊匹配", name: "blurMatch" },

      statusSelect: [{ value: "全部快递" }, { value: "特别关注（订阅物流）" }],
      autoRefreshTime,
      autoCancelTime,
      dealType:''
    };
  },

  computed: {
    ...mapWritableState(courierStore, ["storeInfo"]),
    ...mapWritableState(appStore, ["settings"]),
  },

  methods: {
    ...mapActions(courierStore,['getOrderDetail']),
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
          await this.getOrderDetail(data.orders);
          console.log(data);
        });
      }
    },

    // 关联淘宝
    bindTb() {
      if(!this.storeInfo.tb.nickname){
        this.dealType = 'tb'
        this.$refs.dealModalRef.openDealDetail()
      }else {
        message.loading({
          content:  "已绑定淘宝账号：" + this.storeInfo.tb.nickname + "，正在为您更新订单信息，请稍候…",
          key: "loadingTip",
          duration: 0,
        });
        grab.tb.getOrder((args) => {
          if (args.status === 0) {
            if (args.code === 401) {
              message.error("获取订单失败，检测到登录信息过期，请重新登录。");
              this.storeInfo.tb.nickname = null;
              this.bindTb();
              return;
            }
            message.error("获取订单意外失败。");
            return;
          }
          message.success({
            content:  "更新订单成功!本次共更新：" +  args.data.orders.length + "条订单信息",
            key: "loadingTip",
            duration: 3,
          });
          this.getOrderDetail(data.orders)
          console.log(args);
        });
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
};
</script>

<style lang="scss" scoped>
:deep(.nav-box) {
  border-radius: 8px !important;
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
