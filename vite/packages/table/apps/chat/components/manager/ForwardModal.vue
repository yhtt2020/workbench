<template>
  <xt-modal v-if="forwardVisible" v-model="forwardVisible" title="转发消息">
    <div class="forward-container flex">
      <div class="flex-1 forward-left flex flex-col">
        <!-- 搜索 -->
        <a-input
          class="h-10 xt-bg-2"
          v-model:value="forwardText"
          placeholder="搜索好友、群聊"
          style="color: var(--secondary-text); border-radius: 8px"
          @change="search"
        >
          <template #suffix>
            <div
              class="flex items-center justify-center pointer active-button"
              @click="search"
              v-if="forwardText === ''"
            >
              <xt-ify-icon
                icon="fluent:search-16-regular"
                size="20"
                class="xt-text-2"
              />
            </div>
            <div
              class="flex items-center justify-center"
              v-else
              @click="clearForwardText"
            >
              <xt-ify-icon
                icon="fluent:dismiss-circle-16-filled"
                size="16"
                class="xt-text-2"
              />
            </div>
          </template>
        </a-input>

        <!-- 聊天列表 -->
        <div class="flex flex-col mt-4">
          <div class="flex items-center justify-between w-full">
            <span class="font-14 mb-4 xt-text-2">最近聊天</span>
            <a-checkbox v-model:checked="currentChecked">全选</a-checkbox>
          </div>
          <xt-scrollbar :y="true" style="height: 300px">
            <div class="flex flex-col">
              <template v-for="(item, index) in currentForwardList">
                <div
                  class="flex p-3 w-full rounded-lg pointer mb-4"
                  @click="selectForward(item)"
                  :class="{ 'select-bg': isSelect(index) }"
                >
                  <a-avatar
                    shape="square"
                    v-if="item.type === 'GROUP'"
                    size="32"
                    :src="item?.avatar"
                  ></a-avatar>
                  <a-avatar v-else size="32" :src="item?.avatar"></a-avatar>
                  <span class="ml-4 xt-text">{{ item.nick }}</span>
                </div>
              </template>
            </div>
          </xt-scrollbar>
        </div>
      </div>

      <!-- 分割线 -->
      <a-divider
        type="vertical"
        style="height: 400px; background-color: var(--divider); margin: 0 16px"
      />

      <!-- 选中列表 -->
      <div class="flex-1 forward-left flex flex-col">
        <span class="font-14 mb-4 xt-text-2"
          >已选中（{{ currentCheckedList.length }}人）</span
        >
        <xt-scrollbar :y="true" style="height: 300px">
          <div class="flex flex-col">
            <template v-for="item in currentCheckedList">
              <div
                class="flex p-3 w-full rounded-lg justify-between items-center pointer"
              >
                <div class="flex">
                  <a-avatar
                    shape="square"
                    v-if="item.type === 'GROUP'"
                    size="32"
                    :src="item?.avatar"
                  ></a-avatar>
                  <a-avatar v-else size="32" :src="item?.avatar"></a-avatar>
                  <span class="ml-4 xt-text">{{ item.nick }}</span>
                </div>
                <xt-button
                  h="0"
                  style="width: auto !important"
                  @click="deleteForward(item)"
                >
                  <div class="flex items-center justify-center">
                    <xt-ify-icon
                      icon="akar-icons:circle-minus-fill"
                      size="20"
                      class="xt-text-2"
                    />
                  </div>
                </xt-button>
              </div>
            </template>
          </div>
        </xt-scrollbar>

        <div class="flex items-center justify-end w-full h-10 mt-4">
          <xt-button
            w="100"
            h="40"
            @click="forwardVisible = false"
            style="border-radius: 8px; margin-right: 16px"
          >
            取消
          </xt-button>
          <xt-button
            w="100"
            h="40"
            type="theme"
            @click="handleForward"
            style="border-radius: 8px"
          >
            确定
          </xt-button>
        </div>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  getCurrentInstance,
  nextTick,
  watch,
} from "vue";
import _ from "lodash-es";
import {
  TUIStore,
  StoreName,
  TUIChatService,
} from "@tencentcloud/chat-uikit-engine";
import { isEnabledMessageReadReceiptGlobal } from "../../../TUIKit/components/TUIChat/utils/utils";
import { message } from "ant-design-vue";

const { proxy } = getCurrentInstance();

const forwardVisible = ref(false);
const forwardText = ref("");
// 左侧列表
const currentForwardList = ref([]);
// 右侧选中列表
const currentCheckedList = ref([]);
// 全选
const currentChecked = ref(false);

// 获取聊天列表
const getForwardChatList = () => {
  TUIStore.watch(StoreName.CONV, {
    conversationList: (list) => {
      currentForwardList.value = list.map((conversation) => {
        return {
          // 为了实现Transfer的复用，这里用userID代替ConversationID
          userID: conversation.conversationID,
          nick: conversation.getShowName(),
          avatar: conversation.getAvatar(),
          type: conversation.type,
        };
      });
    },
  });
};

// 开启转发弹窗
const openForwardModal = () => {
  forwardVisible.value = true;
  nextTick(() => {
    getForwardChatList();
  });
};

// 搜索
const search = () => {
  if (forwardText.value !== "") {
    const searchList = currentForwardList.value?.filter((item) => {
      return item?.nick?.includes(forwardText.value);
    });
    currentForwardList.value = searchList;
  } else {
    getForwardChatList();
  }
};
// 搜索清空操作
const clearForwardText = () => {
  forwardText.value = "";
  getForwardChatList();
};
// 选中转发
const selectForward = (item) => {
  const index = _.findIndex(currentCheckedList.value, function (findItem) {
    return findItem.userID === item.userID;
  });
  if (index > -1) {
    currentCheckedList.value.splice(index, 1);
  } else {
    currentCheckedList.value.push(item);
  }
};
// 取消转发
const deleteForward = (item) => {
  const index = _.findIndex(currentCheckedList.value, function (findItem) {
    return findItem.userID === item.userID;
  });
  currentCheckedList.value.splice(index, 1);
};

// 根据右侧选中内容进行左侧选中状态显示
const isSelect = (index) => {
  const indexStatus = _.some(currentCheckedList.value, function (item) {
    return item?.userID === currentForwardList.value[index]?.userID;
  });
  return indexStatus;
};

// 确定转发
const handleForward = () => {
  // 这里传递的是 coversationID
  // 但为了实现 Transfer 的复用 这里用 userID 代替 ConversationID
  const selectedConversationList = currentCheckedList.value.map(
    (convIDWrapper) => {
      const { userID: conversationID } = convIDWrapper;
      return TUIStore.getConversationModel(conversationID);
    }
  );
  const singleForwardMessageID = TUIStore.getData(
    StoreName.CUSTOM,
    "singleForwardMessageID"
  );
  const message = TUIStore.getMessageModel(singleForwardMessageID);
  TUIChatService.sendForwardMessage(selectedConversationList, [message], {
    needReadReceipt: isEnabledMessageReadReceiptGlobal(),
  }).catch((error) => {
    if (error.code === 80001) {
      message.error(`${TUITranslateService.t("内容包含敏感词汇")}`);
    } else {
      message.error(`${error.message}`);
    }
  });
  forwardVisible.value = false;
};

// 监听全选
watch(
  () => currentChecked.value,
  (val) => {
    if (val) {
      currentCheckedList.value = currentForwardList.value;
    } else {
      currentCheckedList.value = [];
    }
  }
);

onMounted(() => {
  proxy.$bus.on("openForwardModal", openForwardModal);
});
</script>

<style lang="scss" scoped>
.forward {
  &-container {
    width: 650px;
  }
  &-left {
    width: 239px;
  }
}
:deep(.ps__rail-y) {
  display: none !important;
}

:deep(.ant-checkbox-wrapper) {
  span {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-input) {
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
.select-bg {
  background: var(--active-secondary-bg);
  border: 1px solid var(--active-bg);
}
</style>