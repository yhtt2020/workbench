<!-- 转发 -->
<template>
  <xt-modal
    v-if="forwardVisible"
    v-model="forwardVisible"
    :title="`分享${alias}`"
  >
    <div class="flex flex-col rounded-lg h-full" style="width: 650px">
      <UserSelect
        :currentLeftList="currentConversationList"
        @forward="getForwardList"
        @close="forwardVisible = false"
      />
    </div>
  </xt-modal>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import { storeToRefs } from "pinia";
import { appStore } from "../../store";
import _ from "lodash-es";
import { message } from "ant-design-vue";

import UserSelect from "../../apps/chat/components/user/UserSelect.vue";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
  type: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
  },
});
const { alias, type, content } = toRefs(props);

// 限制message提示框最大显示数量
message.config({
  maxCount: 1
})

const apps = appStore();
const { userInfo } = apps;

/**当前会话**/
const currentConversationList = ref([]);

/**开启转发弹窗**/
const forwardVisible = ref(false);
const openShareModal = () => {
  forwardVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.CONV, {
      conversationList: (data) => {
        const mapList = _.map(data, (item) => {
          if (item.type === "GROUP") {
            return {
              userID: item.groupProfile?.groupID,
              nick: item.groupProfile?.name,
              avatar: item.groupProfile?.avatar,
              type: item.type,
            };
          } else if (item.type === "C2C") {
            return {
              userID: item.userProfile?.userID,
              nick: item.userProfile?.nick,
              avatar: item.userProfile?.avatar,
              type: item.type,
            };
          }
        });
        currentConversationList.value = mapList;
      },
    });
  });
};

/**分享**/
const getForwardList = async (list) => {
  if (list.length !== 0) {
    for (const item of list) {
      shareContent(item);
    }
    forwardVisible.value = false;
  } else {
    message.warn("请选择需要分享的群和用户");
  }
};
/**分享数据**/
const shareContent = async (data) => {
  const messageContent = {
    to: data.userID,
    conversationType: `${data.type}`,
    payload: content.value,
  };
  const resMsg = await window.$chat?.chat?.createCustomMessage(messageContent);
  let promise = window.$chat?.chat?.sendMessage(resMsg);
  promise
    .then(function (imResponse) {
      /**发送成功**/ 
      message.success("转发成功");
    })
    .catch(function (imError) {
      /**发送失败**/ 
      message.error("转发失败");
    });
};

defineExpose({
  openShareModal,
});
</script>

<style lang="scss" scoped>
</style>