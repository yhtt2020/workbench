<template>
  <div style="width: 480px" class="p-5">
    <div
      class="xt-bg-2 rounded-xl flex flex-col justify-center pl-4 mb-4"
      style="height: 98px"
    >
      <div class="text-base xt-text my-1">月卡</div>
      <div class="xt-text-2 text-sm my-1">Ai助手订阅</div>
    </div>
    <xt-tab
      class="h-12"
      boxClass="p-1 xt-bg-2"
      v-model:data="selectTab"
      :list="tabList"
    ></xt-tab>
    <div>api预留 {{ data.price }}</div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    data: {},
  },
  data() {
    return {
      selectTab: "weChat",
      tabList: [
        {
          name: "微信",
          value: "weChat",
        },
        {
          name: "支付宝",
          value: "Alipay",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
