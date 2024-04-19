<!-- 根据当前社群号判断页面是否存在 -->
<template>
  <div class="w-full h-full flex items-center justify-center xt-bg">
    <div class="flex items-center flex-col justify-center">
      <span class="xt-text font-24 xt-font mb-4">404,页面不存在</span>
      <xt-button w="180" h="40" type="theme" @click="prev"> 返回 </xt-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
/**返回上一个页面 后期再做调整**/
const prev = () => {
  console.log('测试',router);
  router.go(-1);
};
</script>

<style lang="scss" scoped>
</style>