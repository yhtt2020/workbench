<!-- 群聊主应用页面接收 -->
<template>
  <div class="w-full h-full">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted } from "vue";
import { chatStore } from "../../../../store/chat";
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";

const { proxy } = getCurrentInstance();
const chatServer = window.$chat.chat;

onMounted(() => {
  chatServer?.on(TUIChatEngine.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, (e) => {
    proxy.$bus.emit("getChatUnread", e?.data);
  });
});
</script>

<style lang="scss" scoped>
</style>