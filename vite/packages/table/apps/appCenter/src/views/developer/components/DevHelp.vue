<script setup lang="ts">
import browser from "../../../../../../js/common/browser";

const openDoc=()=>{
  browser.openInSystem('https://a.apps.vip/ttdoc/ttapp/')
}
const openTrial=()=>{
  browser.openInSystem('https://a.apps.vip/ttdoc/ttapp/l1.html')
}
const openRep=()=>{
  browser.openInSystem('https://gitee.com/tsbrowser/hi-lab')
}
</script>

<template>
  <div class="mb-2">
    <span style="font-size: 14px">不知道如何开发？</span>
  </div>
  <div class="mb-8 flex gap-4 " >
    <xt-button   @click="openDoc" class="ml-2 " size="small" :w="110" :h="40">
      <div class="flex"><xt-new-icon icon="fluent:book-number-24-regular" class="mr-2"></xt-new-icon> 文档站</div>
    </xt-button>
    <xt-button   @click="openTrial" class="ml-2 " size="small" :w="110" :h="40">
      <div class="flex"><xt-new-icon icon="fluent:book-question-mark-24-regular" class="mr-2"></xt-new-icon> 开发教程</div>
    </xt-button>
    <xt-button   @click="openRep" class="ml-2 " size="small" :w="110" :h="40">
      <div class="flex"><xt-new-icon icon="fluent:book-star-24-regular" class="mr-2"></xt-new-icon> 开发示例</div>
    </xt-button>
  </div>
</template>

<style scoped lang="scss">

</style>
