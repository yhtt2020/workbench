<template>
  <div>
    <xt-text class="mb-3">活动任务</xt-text>
    <div class="p-3 xt-bg-2 rounded-xl">
      <xt-text class="mb-3">
        <xt-new-icon icon="fluent-emoji:rainbow" size="20" class="mr-3" />
        邀请
        <span
          class="flex justify-center items-center ml-2"
          style="
            background: #faad14;
            border-radius: 4px;
            font-size: 12px;
            width: 33px;
            height: 20px;
          "
          >长期</span
        >
        <template #right>
          <div class="text-sm">
            <span class="xt-text-2">已邀请</span>
            <span>???</span>
            <span class="xt-text-2">人</span>
          </div>
        </template>
      </xt-text>
      <xt-text type="2">
        <span>
          邀请新用户注册使用工作台，新用户注册使用并完成「<span class="xt-text"
            >主线第一章</span
          >」任务后，即可获得丰厚奖励。
        </span>
      </xt-text>
      <xt-button class="mt-3" style="width: 100%" type="theme" @click="go()"
        >前往推广中心</xt-button
      >
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { taskStore } from "../../store.ts";
import { ref } from "vue";
const flag = ref(true);
const store = taskStore();
const router = useRouter();
const go = () => {
  router.push({ name: "promotion" });
  store.isTaskDrawer = false;
};
</script>

<style lang="scss" scoped></style>
