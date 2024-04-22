<!-- 群聊详情页 -->
<template>
  <a-row class="w-full h-full">
    <a-col class="flex flex-col h-full">
      <div
        style="width: 280px; border-right: 1px solid var(--divider)"
        class="px-3 h-full flex flex-col"
      >
        <Contact />
        <PrivateMessage />
      </div>
    </a-col>
    <a-col flex=" 1 1 280px" class="flex flex-col h-full">
      <!-- 群聊会话 -->
      <template v-if="currentChatType === 'group'">
        <TUIChat>
          <h1>欢迎使用腾讯云即时通信IM</h1>
        </TUIChat>
      </template>

      <!-- 好友列表 -->
      <template v-if="currentChatType === 'contact-friend'">
        <Friend />
      </template>

      <!-- 群聊列表 -->
      <template v-if="currentChatType === 'contact-group'">
        <Group />
      </template>

      <!-- 通知列表 -->
      <template v-if="currentChatType === 'contact-notice'">
        <Notice />
      </template>
    </a-col>
  </a-row>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { contactStore } from "../../store/contactStore";
import {
  TUIStore,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import Contact from "../contact/Contact.vue";
import PrivateMessage from "./PrivateMessage.vue";
import Friend from "../contact/page/Friend.vue";
import Group from "../contact/page/Group.vue";
import Notice from "../contact/page/Notice.vue";

const contact = contactStore();
const { currentContact } = storeToRefs(contact);

const router = useRouter();

const currentChatType = computed(() => {
  console.log('计算属性判断',currentContact.value.type === 'group');
  /**判断当前是否选中会话列表**/ 
  if(currentContact.value.type === 'group' && currentContact.value.groupID !== ""){
    const name = currentContact.value.groupID;
    TUIConversationService?.switchConversation(name);
  }
  /**默认选择第一个会话列表**/ 
  else if(currentContact.value.type === 'group' && currentContact.value.groupID === ""){
    // 当前list是获取所有群聊会话列表
    const list = TUIStore?.storeMap?.conversation?.store?.conversationList;
    // 如果缓存中的会话是空的,就从会话列表中获取第一个会话;
    const currentID = list[0]?.conversationID;
    TUIConversationService?.switchConversation(currentID);
  }
  return currentContact.value.type;
});

/**监听当前群聊会话是否为空,如果为空回自接跳转到发现页**/
watchEffect(() => {
  const watchList = TUIStore?.storeMap?.conversation?.store?.conversationList;
  // console.log("测试", watchList?.length);
  if (watchList?.length === 0) {
    message.warning(
      "当前聊天页没有会话列表,会默认自动进入发现页进行聊天会话的创建或者是点击左侧栏底部添加按钮创建"
    );
    router.push({ path: "/chatFind" });
  } else {
    return;
  }
});


</script>

<style lang="scss" scoped>
</style>