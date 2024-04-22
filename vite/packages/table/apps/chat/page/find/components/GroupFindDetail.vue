<!-- 推荐群聊详情页 -->
<template>
  <div class="content-list">
    <template v-for="item in groupList">
      <div
        class="flex items-center xt-bg-t-2 content-item px-4 justify-between py-5 rounded-xl mb-3"
        style="width: 400px"
      >
        <div class="flex items-center">
          <a-avatar :src="item.avatar" shape="square" :size="48"></a-avatar>
          <div class="flex flex-col justify-center pl-4">
            <span class="font-16 xt-text xt-font">
              {{ item.name }}
            </span>
            <span class="font-16 xt-text-2 xt-font">
              {{ item.memberCount }}人
            </span>
          </div>
        </div>
        <xt-button
          w="120"
          h="48"
          v-show="item.relationShip === 'yes'"
          class="xt-theme-bg-2"
          @click="enterGroup(item)"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon icon="fluent:chat-16-regular" class="mr-2" size="20" />
            <span class="xt-text xt-font font-16 font-400">进入群聊</span>
          </div>
        </xt-button>
        <xt-button
          w="120"
          h="48"
          v-show="item.relationShip === 'not'"
          type="theme"
          @click="addGroup(item.groupID)"
        >
          加入群聊
        </xt-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { completeTask } from "../../../../task/task";
import { chatStore } from "../../../../../store/chat";
import { TUIConversationService } from "@tencentcloud/chat-uikit-engine";

const chatServer = window?.$chat?.chat;
const router = useRouter();
const chat = chatStore();

const props = defineProps({
  groupList: {
    type: Array,
    default: () => [],
  },
});
const { groupList } = toRefs(props);

// 添加群聊
const addGroup = async (id) => {
  const option = { groupID: id };
  console.log('测试',option);
  const res =  await chatServer.joinGroup(option);
  if(res.code === 0){
    const conversationID =  `GROUP${id}`;
    handlerConversationList(conversationID)
    completeTask("Z0601");
    chat.updateGroupRelationship();
  }
};

// 进入群聊
const enterGroup = async (item) => {
  const conversationID = `GROUP${item.groupID}`;
  handlerConversationList(conversationID);
};
const handlerConversationList = (conversationID) => {
  chat.updateConversation(conversationID);
  router.push({ name: "chatMain" });
  TUIConversationService.switchConversation(conversationID);
};
</script>

<style lang="scss" scoped>
.content-item {
  margin-right: 16px !important;
  aspect-ratio: 5 / 1;
  max-width: 400px;
}
@media screen and (max-width: 964px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}

@media screen and (min-width: 965px) {
  .content-list {
    width: 100%;
    display: grid !important;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
  }
  .content-item {
    width: calc(100% / 1);
  }
}
</style>