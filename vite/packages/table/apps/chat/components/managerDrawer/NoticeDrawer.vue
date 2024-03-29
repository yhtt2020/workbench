<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="noticeVisible"
      title="群公告"
      width="500"
      :bodyStyle="{padding:'0 24px'}"
    >
      <div class="flex flex-col">
        <div class="textarea-container">
          <a-textarea
            v-model:value="noticeValue"
            :spellcheck="false"
            placeholder="暂无群公告"
            :disabled="noticeRole === 'Member'"
            :rows="8"
            :maxlength="maxLength"
            @input="handleInput"
            style="color: var(--primary-text); border-radius: 12px"
          />
          <span class="char-count">{{ currentLength }} / {{ maxLength }}</span>
        </div>
        <xt-button
          h="40"
          w="452"
          type="theme"
          v-if="noticeRole !== 'Member'"
          style="margin-top: 12px"
          @click="saveGroupNotice"
        >
          保存
        </xt-button>
      </div>
    </a-drawer>
  </teleport>
</template>

<script setup>
import { nextTick, ref, toRefs, computed } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});
const { groupID } = toRefs(props);

// 群公告内容
const currentContent = ref({});
const noticeValue = ref("");
const noticeRole = ref("");
const maxLength = ref(300);

// 开启公修改弹窗
const noticeVisible = ref(false);
const openNoticeDrawer = () => {
  noticeVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.CONV, {
      currentConversation: (conversation) => {
        currentContent.value = conversation;
        noticeValue.value = conversation?.groupProfile?.notification;
        noticeRole.value = conversation?.groupProfile?.selfInfo?.role;
      },
    });
  });
};

// 计算当前文本输入框的字数
const currentLength = computed(() => {
  return noticeValue.value.length;
});

// 修改公告信息
const saveGroupNotice = async () => {
  const chat = window.$chat.chat;
  const res = await chat.updateGroupProfile({
    groupID: groupID.value,
    notification: noticeValue.value,
  });
  if (res.code === 0) {
    noticeVisible.value = false;
  }
};

defineExpose({
  openNoticeDrawer,
});
</script>

<style lang="scss" scoped>
.textarea-container {
  position: relative;
  & textarea::-webkit-scrollbar {
    width: 2px !important;
  }
  & textarea::-webkit-scrollbar-thumb {
    background: var(--secondary-bg) !important;
  }
  & textarea::-webkit-scrollbar-thumb:hover {
    background: #6666 !important;
  }
}

.char-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>