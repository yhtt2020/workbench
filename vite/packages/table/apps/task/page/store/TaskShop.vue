<template>
  <div class="flex w-full h-full flex-col">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <xt-ify-icon
          icon="fluent:building-shop-16-filled"
          class="mr-2 xt-text"
          size="16"
        ></xt-ify-icon>
        <span class="xt-text xt-font font-14">扫一扫</span>
      </div>
      <Exit />
    </div>
    <div class="flex grow flex-col items-center justify-center">
      <div style="width: 200px;height: 200px;" class="mb-3">
        <img src="/img/taskShop.png" class="w-full h-full rounded-md object-cover" alt="">
      </div>      
      <span class="xt-text-2  font-16 xt-font">微信扫一扫</span>
      <span class="xt-text-2  font-16 xt-font">在元社区积分商城中选择你想要兑换的礼品</span>
    </div>
  </div>
</template>

<script setup>
import Exit from "../../components/Exit.vue";


</script>

<style lang="scss" scoped>
</style>