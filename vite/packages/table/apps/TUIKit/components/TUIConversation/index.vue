<template>
  <div class="tui-conversation" @click="handleClickConv">
    <!-- 解决refs的报错,屏蔽不使用 -->
    <!-- <ConversationHeader
      v-if="conversationHeaderVisible"
      ref="headerRef" 
    /> -->
    <!-- 当前用不到,屏蔽 -->
    <!-- <ConversationNetwork /> -->
    <ConversationList @handleSwitchConversation="handleSwitchConversation" />
  </div>
</template>
<script lang="ts" setup>
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import { ref, nextTick } from "../../adapter-vue";
import ConversationList from "./conversation-list/index.vue";

/**解决refs的报错,屏蔽不使用**/
// import ConversationHeader from './conversation-header/index.vue';

/**屏蔽,暂时不需要使用**/ 
// import ConversationNetwork from "./conversation-network/index.vue";

const emits = defineEmits(["handleSwitchConversation"]);

const totalUnreadCount = ref(0);

/**解决refs的报错,屏蔽不使用**/
// const headerRef = ref<typeof ConversationHeader>();
// const conversationHeaderVisible = ref<boolean>(true);

TUIStore.watch(StoreName.CONV, {
  totalUnreadCount: (count: number) => {
    totalUnreadCount.value = count;
  },
});

/**解决refs的报错,屏蔽不使用**/
// TUIStore.watch(StoreName.CUSTOM, {
//   isShowConversationHeader: (showStatus: boolean) => {
//     console.log('排查refs报错-测试',showStatus);
//     // conversationHeaderVisible.value = showStatus !== false;
//   },
// });

const handleSwitchConversation = (conversationID: string) => {
  emits("handleSwitchConversation", conversationID);
};

const handleClickConv = () => {
  /**解决refs的报错,屏蔽不使用**/
  // nextTick(()=>{
  //   headerRef?.value?.closeChildren();
  // })
};
</script>

<style lang="scss" scoped src="./style/index.scss"></style>
