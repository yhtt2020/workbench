<template>
  <xt-modal v-if="infoVisible" v-model="infoVisible" title="群信息">
    <div style="width: 500px" class="flex flex-col mt-4">
      <!-- 头像昵称 -->
      <div class="flex items-center xt-bg-2 rounded-lg px-4 py-2 mb-4">
        <a-avatar
          shape="square"
          size="64"
          :src="info.avatar"
          style="margin-right: 8px"
        />
        <span class="xt-text xt-font font-16">{{ info.name }}</span>
      </div>

      <!-- 基础信息,例如群id、群类型、加群方式、群人数等等 -->
      <div class="flex flex-col rounded-lg p-4 xt-bg-2 w-full mb-3">
        <div class="flex justify-between">
          <span class="xt-font xt-text font-16">群ID</span>
          <div class="flex items-center">
            <span class="xt-text-2 xt-font font-14 mr-2">
              {{  info.groupID }}
            </span>
            <xt-button
              h="0"
              style="width: auto !important"
              @click="copyCurrentID"
            >
              <div class="flex items-center justify-center">
                <xt-ify-icon
                  icon="fluent:copy-16-regular"
                  size="16"
                  class="xt-text-2"
                />
              </div>
            </xt-button>
          </div>
        </div>
        <div class="flex justify-between my-3">
          <span class="xt-font xt-text font-16">群类型</span>
          <span class="xt-text-2 xt-font font-14">
            {{ getTypeName(info.type) }}
          </span>
        </div>
        <div class="flex justify-between mb-3">
          <span class="xt-font xt-text font-16">加群方式</span>
          <span class="xt-text-2 xt-font font-14">
            {{  joinName(info.joinOption)}}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="xt-font xt-text font-16">群人数</span>
          <span class="xt-text-2 xt-font font-14">{{ info.memberCount }}</span>
        </div>
      </div>

      <!-- 群 解散按钮 转让按钮 进入群按钮 退出群按钮 -->
      <div class="flex items-center justify-center w-full">
        <!-- 群成员具备管理员的资格 -->
        <template v-if="info.selfInfo.role !== 'Member'">
          <xt-button
            w="142"
            h="48"
            style="border-radius: 8px; margin-right: 12px"
            v-if="info.role !== 'Member'"
            @click="transferGroup"
          >
            转让群聊
          </xt-button>
          <xt-button
            w="142"
            h="48"
            style="
              border-radius: 8px;
              background: var(--error);
              margin-right: 12px;
            "
            v-if="info.role !== 'Member'"
            @click="dissolveGroup"
          >
            解散群聊
          </xt-button>
        </template>
        <!-- 群成员不具备管理员的资格  -->
        <xt-button
          style="
            border-radius: 8px;
            background: var(--error);
            margin-right: 12px;
          "
          w="142"
          h="48"
          v-else
          @click="exitGroup"
        >
          退出群聊
        </xt-button>

        <xt-button
          w="142"
          type="theme"
          h="48"
          style="border-radius: 8px"
          @click="enterGroup"
        >
          进入群聊
        </xt-button>
      </div>
    </div>
  </xt-modal>

  <TransferGroupAdmin ref="transferRef" :groupID="info.groupID" @close="infoVisible =  false"/>
</template>

<script setup>
import { ref, toRefs } from "vue";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
import { getTypeName, joinName } from "../../../hooks/groupType";
import { TUIConversationService,TUIGroupService } from "@tencentcloud/chat-uikit-engine";
import { useRouter } from "vue-router";

import TransferGroupAdmin from "./TransferGroupAdmin.vue";

const router = useRouter();

const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
});
const { info } = toRefs(props);

const transferRef = ref(null);

// 开启群基础信息查看弹窗
const infoVisible = ref(false);
const openGroupInfo = () => {
  infoVisible.value = true;
};
// 复制当前群ID
const copyCurrentID = async () => {
  const { toClipboard } = useClipboard();
  const res = await toClipboard(info.value.groupID);
  if (res.text !== "") {
    message.success("复制成功");
  }
};
// 进入群聊
const enterGroup = () => {
  const conversationID = `GROUP${info.value.groupID}`;
  router.push({ name: "chatMain" });
  TUIConversationService.switchConversation(conversationID);
  infoVisible.value = false;
};
// 退出群聊
const exitGroup = async () => {
  const res = await TUIGroupService.quitGroup(info.value.groupID);
  if (res.code === 0) {
    message.success("群聊退出成功");
    infoVisible.value = false;
  }
};
// 转让群聊
const transferGroup = () => {
  transferRef.value.openTransfer();
};
// 解散群聊
const dissolveGroup = async() => {
  const res = await TUIGroupService.dismissGroup(info.value.groupID)
  if(res.code === 0){
    message.success("解散群聊成功");
    infoVisible.value = false;
  }
};

defineExpose({
  openGroupInfo,
});
</script>

<style lang="scss" scoped>
</style>