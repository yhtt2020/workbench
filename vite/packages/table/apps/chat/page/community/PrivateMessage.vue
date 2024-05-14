<!-- 私信群聊 -->
<template>
  <div class="flex-1 h-0">
    <div class="xt-text xt-font font-14 pb-3">私信&群聊</div>
    <TUIConversation @handleSwitchConversation="handleSwitch" />
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

//导入pinia缓存将当前会话进行存储
import { storeToRefs } from "pinia";
import { contactStore } from "../../store/contactStore";

// 解构store缓存数据
const contact = contactStore();
const { currentContact } = storeToRefs(contact);

// 触发当前的群聊会话
const handleSwitch = (data) => {
  currentContact.value = {
    type: "group",
    groupID: data,
  };
};
</script>

<style lang="scss" scoped>
</style>