<!--其他社群详情页 -->
<template>
  <a-row class="w-full h-full">
    <a-col  class="flex flex-col h-full find-left"  style=" border-right:1px solid var(--divider);">
      <CategoryFloat :no="currentNo"  />
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { chatCommunityStore } from "../../store/chatCommunity";

import CategoryFloat from "../../components/suspendMode/CategoryFloat.vue";

const route = useRoute();

const chatCommunity = chatCommunityStore();
const { currentCommunityNo } = storeToRefs(chatCommunity);

// 通过计算属性获取当前社群编号
const currentNo = computed(() => {
  // console.log('查看',currentCommunityNo.value === route.params.no);
  // 初始值是否为null,并且判断no是否与路由的no相同
  if (currentCommunityNo.value === route.params.no && currentCommunityNo.value) {
    return currentCommunityNo.value;
  } else {
    return route.params.no;
  }
});

onBeforeRouteUpdate((to, from, next) => {
  // console.log("更新当前路由", to.params.no, from);
  if (to.params?.no) {
    chatCommunity.setCurrentCommunityNo(to.params?.no);
  }
  next();
});
</script>

<style lang="scss" scoped>
</style>