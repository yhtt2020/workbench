<template>
  <!-- <div>
    <div style="width: 572px; border: 1px solid">
      <div
        class="flex rounded-xl xt-bg justify-center items-center xt-text mb-3 h-[80px]"
      >
        <div class="flex-1 flex justify-center items-center flex-col">
          <div class="text-base">api预留</div>
          <div class="xt-text-2 text-sm">订阅到期时间</div>
        </div>
        <div style="border-right: 1px solid var(--divider); height: 60%"></div>
        <div class="flex-1 flex justify-center items-center flex-col">
          <div class="text-base">api预留</div>
          <div class="xt-text-2 text-sm">剩余次数</div>
        </div>
      </div>
      <Store tabWidth="320px"></Store>
    </div>
  </div> -->
  <Set></Set>
</template>

<script>
import Store from "./Store.vue";
import Set from "./set.vue";
export default {
  components: {
    Store,
    Set,
  },
};
</script>

<style lang="scss" scoped></style>
