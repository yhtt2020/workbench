<template>
  <div
    class="rounded-xl xt-bg-2 flex justify-between p-4 mt-4 items-center"
    style="height: 80px; z-index: 9999999999"
  >
    <div class="text-lg flex items-center">
      <div
        v-if="data.icon"
        class="flex justify-center items-center xt-active-bg-2 h-12 w-12 rounded-xl xt-text"
      >
        {{ data.icon }}
      </div>
      <div class="ml-4">
        <div>{{ data.value }}{{ data.tip }}</div>
        <div v-if="data.time" class="text-sm">不限时间</div>
      </div>
    </div>
    <div
      class="xt-active-btn text-xl"
      style="width: 120px; height: 48px"
      @click="buyClick()"
    >
      ￥ {{ data.price }}
    </div>
  </div>
  <XtView
    style="z-index: 9999999999"
    model="popup"
    :showFull="false"
    v-if="popupVisible"
    @close="close"
    title="收银台"
  >
    <pay :data="data"></pay>
  </XtView>
</template>

<script>
import Popup from "./Popup.vue";
import pay from "./pay.vue";
export default {
  components: {
    Popup,
    pay,
  },
  props: {
    data: {},
  },
  data() {
    return {
      popupVisible: false,
    };
  },
  methods: {
    buyClick() {
      this.popupVisible = true;
    },
    close() {
      this.popupVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
