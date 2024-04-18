<!--群聊会话列表页面 -->
<template>
  <div :class="['TUIKit', isH5 && 'TUIKit-h5']">
    <div v-if="!(isH5 && currentConversationID)" class="TUIKit-navbar">
      <div
        v-for="item of navbarList"
        :key="item.id"
        :class="[
          'TUIKit-navbar-item',
          currentNavbar === item.id && 'TUIKit-navbar-item-active',
        ]"
        @click="currentNavbar = item.id"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="TUIKit-main-container">
      <div v-if="currentNavbar === 'conversation'" class="TUIKit-main">
        <div v-if="!(isH5 && currentConversationID)" class="TUIKit-main-aside">
          <TUISearch searchType="global"></TUISearch>
          <TUIConversation
            @handleSwitchConversation="handleSwitch"
          ></TUIConversation>
        </div>
        <div v-if="!isH5 || currentConversationID" class="TUIKit-main-main">
          <TUIChat>
            <h1>欢迎使用腾讯云即时通信IM</h1>
          </TUIChat>
          <TUIGroup :class="isH5 ? 'chat-popup' : 'chat-aside'" />
          <TUISearch
            :class="isH5 ? 'chat-popup' : 'chat-aside'"
            searchType="conversation"
          />
        </div>
        <TUIGroup v-if="isH5 && !currentConversationID" class="chat-popup" />
        <TUIContact displayType="selectFriend" />
      </div>
      <div v-else-if="currentNavbar === 'contact'" class="TUIKit-main">
        <TUIContact
          displayType="contactList"
          @switchConversation="currentNavbar = 'conversation'"
        />
      </div>
      <!-- <TUICallKit class="callkit-container" :allowedMinimized="true" :allowedFullScreen="false" /> -->
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import {
  TUIStore,
  StoreName,
  TUIConversationService,
} from "@tencentcloud/chat-uikit-engine";
import { isH5 } from "../../../TUIKit/utils/env";
//导入pinia缓存将当前会话进行存储
import { storeToRefs } from "pinia";
import { chatStore } from "../../../../store/chat";

const chat = chatStore();
const { conversations } = storeToRefs(chat);

const currentConversationID = ref("");
const currentNavbar = ref("conversation");
const navbarList = [
  {
    id: "conversation",
    label: "会话",
  },
  {
    id: "contact",
    label: "通讯录",
  },
];
const currentConversationList = ref([]);

// 触发当前的群聊会话
const handleSwitch = (data) => {
  //  console.log('查看data',data);
  conversations.value.conversationID = data;
};

TUIStore.watch(StoreName.CONV, {
  currentConversationID: (id) => {
    currentConversationID.value = id;
  },
  currentConversationList: (list) => {
    currentConversationList.value = list;
  },
});

// 监听缓存中的会话ID
watch(
  () => conversations.value.conversationID,
  (value) => {
    if (value) {
      TUIConversationService.switchConversation(value);
    } else {
      // 当前list是获取所有群聊会话列表
      const list = TUIStore?.storeMap?.conversation?.store?.conversationList;
      // 如果缓存中的会话是空的,就从会话列表中获取第一个会话;
      const currentID = list[0]?.conversationID;
      TUIConversationService.switchConversation(currentID);
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
@import "../../../TUIKit/assets/styles/common.scss";
@import "../../../TUIKit/assets/styles/sample.scss";
</style>

