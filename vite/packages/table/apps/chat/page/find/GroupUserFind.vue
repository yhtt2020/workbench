<!-- 群聊用户发现页 -->
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="find-container h-full">
      <template v-if="isLoading">
        <a-spin />
      </template>
      
      <xt-scrollbar :y="true" class="w-full h-full" v-else>
        <div class="flex flex-col">
          <span class="xt-font xt-text font-16 mb-4">推荐用户</span>
          <UserFindDeatil :userList="recommendData.users" />
        </div>
        <div class="flex flex-col">
          <span class="xt-font xt-text font-16 mb-4">推荐群聊</span>
          <GroupFindDetail :groupList="recommendData.groups" />
        </div>
      </xt-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { chatStore } from "../../../../store/chat";

import GroupFindDetail from "./components/GroupFindDetail.vue";
import UserFindDeatil from "./components/UserFindDetail.vue";

const chat = chatStore();
const { users, group, recommendData, isLoading } = storeToRefs(chat);

onMounted(() => {
  chat.getReferData();
});
</script>

<style lang="scss" scoped>
.find-container {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>