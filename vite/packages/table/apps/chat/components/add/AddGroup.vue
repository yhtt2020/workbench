<!-- 添加群聊弹窗组件 -->
<template>
  <xt-modal
    v-if="addGroupVisible"
    v-model="addGroupVisible"
    title="添加群聊"
    @close="closeAdd"
  >
    <div style="width: 500px; height: 400px" class="flex h-full flex-col mt-4">
      <a-input
        placeholder="输入群ID搜索"
        :spellcheck="false"
        v-model:value="data.searchId"
        class="h-12 xt-bg-2"
        style="border-radius: 12px"
        @keyup.enter="searchGroup"
      >
        <template #suffix>
          <xt-button
            style="width: auto !important"
            h="0"
            v-if="data.searchId === ''"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:search-16-regular"
                size="20"
                class="xt-text-2"
              />
            </div>
          </xt-button>
          <xt-button
            style="width: auto !important"
            h="0"
            v-else
            @click="data.searchId = ''"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:dismiss-circle-16-filled"
                size="16"
                class="xt-text-2"
              />
            </div>
          </xt-button>
        </template>
      </a-input>

      <!-- 空状态 -->
      <template v-if="data.searchResult.length === 0">
        <div class="flex items-center justify-center flex-col h-full mt-4">
          <xt-ify-icon icon="fluent-emoji:sleeping-face" size="64" />
          <span class="xt-text font-14 xt-font">暂无数据</span>
        </div>
      </template>

      <template v-else>
        <xt-scrollbar style="height: 350px">
          <div style="height: 16px"></div>
          <template v-for="item in data.searchResult">
            <div
              class="flex justify-between items-center mb-4 rounded-xl xt-bg-2 p-4"
            >
              <div class="flex">
                <a-avatar
                  shape="square"
                  :size="48"
                  :src="item.avatar"
                ></a-avatar>
                <div class="flex flex-col" style="margin-left: 16px">
                  <span style="color: var(--primary-text)">
                    {{ item.name }}
                  </span>
                  <span style="color: var(--primary-text)">200人</span>
                </div>
              </div>
              <xt-button
                w="80"
                h="32"
                type="theme"
                v-if="!isJoinGroup(item)"
                @click="joinGroup(item)"
                >加入</xt-button
              >
              <xt-button
                w="80"
                h="32"
                class="xt-bg-t-2"
                v-else
                style="pointer-events: none"
                >已加入</xt-button
              >
            </div>
          </template>
        </xt-scrollbar>
      </template>
    </div>
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import TUIChatEngine, {
  TUITranslateService,
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import { completeTask } from "../../../task/task";

const chat = window.$chat.chat;

const data = ref({
  searchId: "",
  searchResult: [],
  currentGroupList: [],
});

// 开启群聊添加弹窗
const addGroupVisible = ref(false);
const openAddGroup = () => {
  addGroupVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP, {
      groupList: (list) => {
        data.value.currentGroupList = list;
      },
    });
  });
};

// 关闭群聊退弹窗
const closeAdd = () => {
  addGroupVisible.value = false;
  data.value.searchId = "";
  data.value.searchResult = [];
};

// 搜索群聊
const searchGroup = () => {
  if (data.value.searchId !== "") {
    chat
      .searchGroupByID(data.value.searchId)
      .then((res) => {
        console.log("res", res);
        if (res.code === 0) {
          const { group } = res.data;
          const isSome = data.value.searchResult.some(
            (item) => item.groupID === res.data.group.groupID
          );
          console.log(isSome, "isSome");
          if (isSome) {
            return;
          } else {
            data.value.searchResult.push({ ...group });
          }
        }
      })
      .catch((err) => {
        message.warn("该群聊为私群,不支持搜索");
      });
  } else {
    message.warn("输入框内容不能为空且群ID不能是纯中文");
  }
};

// 点击加入群聊
const joinGroup = async (group) => {
  const disabledJoin =
    group.joinOption === TUIChatEngine.TYPES.JOIN_OPTIONS_DISABLE_APPLY;
  if (disabledJoin) {
    message.warn("群管理员开启了禁止加群设置");
    addGroupVisible.value = false;
  } else {
    const options = {
      groupID: group.groupID,
      applyMessage:
        group.applyMessage || TUITranslateService.t("TUIContact.加群"),
      type: group?.type,
    };
    const res = await chat.joinGroup(options);
    if (res.data.status === "WaitAdminApproval") {
      message.success("入群申请已发出,等待群主和管理员审核");
    }
    else if(res.data.status === "JoinedSuccess"){
      message.success("群聊添加成功")
    }
    else if(res.data.status === "AlreadyInGroup"){
      message.success("已经在群聊中")
    }
    completeTask("Z0601");
    closeAdd();
  }
};

// 判断群聊是否已经加入
const isJoinGroup = (group) => {
  const index = _.findIndex(data.value.currentGroupList, function (item) {
    return item.groupID === group?.groupID;
  });
  return index > -1;
};

defineExpose({
  openAddGroup,
});
</script>

<style lang="scss" scoped>
:deep(.ant-input) {
  color: var(--secondary-text);
  font-size: 1rem;
  &::placeholder {
    color: var(--secondary-text);
  }
}
:deep(.ps__rail-y) {
  display: none !important;
}
</style>