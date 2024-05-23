<!-- 联系人模块中的通知列表页 -->
<template>
  <div class="w-full h-full flex flex-col px-4">
    <div class="flex w-full items-center justify-between pt-1">
      <span class="xt-text xt-font font-16" >
        通知({{ currentNoticeArr.length }}个)
      </span>
    </div>

    <!-- 空状态 -->
    <template v-if="currentNoticeArr.length === 0">
      <div class="flex flex-col items-center justify-center h-full">
        <xt-ify-icon
          icon="fluent-emoji:sleeping-face"
          size="64"
          style="color: #d9d9d9"
        />
        <span class="xt-text xt-font font-16" style="color: #d9d9d9">
          暂无通知
        </span>
      </div>
    </template>

    <xt-scrollbar :y="true" style="height: 100%" v-else>
      <div style="height: 16px"></div>
      <template v-for="item in currentNoticeArr">
        <div
          class="flex items-center justify-between w-full xt-bg-t-2 pointer rounded-lg p-4 friend-item"
        >
          <div class="flex items-center">
            <a-avatar size="32" :src="item.avatar" />
            <div class="flex flex-col ml-2">
              <span class="xt-text xt-font font-16">
                {{ item.nick }}
              </span>
              <span class="xt-text-2 font-14 xt-font">
                {{ TUITranslateService.t("TUIChat.申请加入") }}
              </span>
            </div>
          </div>
          <div class="flex items-center">
            <xt-button
              w="80"
              h="32"
              type="theme"
              style="margin-right: 12px"
              @click="handleApplication(item, 'Agree')"
            >
              同意
            </xt-button>
            <xt-button
              w="80"
              h="32"
              style="background: var(--error) !important"
              @click="handleApplication(item, 'Reject')"
            >
              拒绝
            </xt-button>
          </div>
        </div>
      </template>
      <div style="height: 16px"></div>
    </xt-scrollbar>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from "vue";
import {
  TUIStore,
  StoreName,
  TUITranslateService,
} from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";
import { message } from "ant-design-vue";

const chat = window.$chat?.chat;
const currentNoticeList = ref([]);
const userProFile = ref([]);

// 接收消息通知
TUIStore.watch(StoreName.CUSTOM, {
  groupApplicationCount: (data) => {
    // console.log("群申请消息", data);
  },
});

// 通过计算属性处理数据
const currentNoticeArr = computed(() => {
  const list = [];
  for (const item of currentNoticeList.value) {
    const index = _.findIndex(userProFile.value, function (userItem) {
      return Number(userItem.userID) === Number(item.applicant);
    });
    if (index !== -1) {
      list.push({ ...item, ...userProFile.value[index] });
    }
  }
  if (list.length !== 0) {
    return list;
  } else {
    return [];
  }
});

// 处理群申请消息
const handleApplication = async (item, type) => {
  const appParams = _.find(currentNoticeList.value, function (findItem) {
    return Number(findItem.applicant) === Number(item.applicant);
  });
  const res = await chat.handleGroupApplication({
    handleAction: type,
    application: { ...appParams },
  });
  if (res.code === 0) {
    message.success("消息通知处理成功");
    getNoticeList();
  }
};

// 获取通知列表
const getNoticeList = () => {
  chat?.getGroupApplicationList().then((res) => {
    const { applicationList } = res.data;
    const list = [];
    for (const item of applicationList) {
      const index = _.findIndex(list, function (findItem) {
        return Number(findItem.userID) === Number(item.applicant);
      });
      if (index === -1) {
        list.push(item.applicant);
      }
    }
    chat?.getUserProfile({ userIDList: list }).then((res) => {
      const list = res.data;
      for (const item of list) {
        const index = _.findIndex(userProFile, function (userItem) {
          return Number(userItem.userID) === Number(item.userID);
        });
        if (index === -1) {
          userProFile.value.push(item);
        }
      }
    });
    currentNoticeList.value = applicationList;
  });
};

onMounted(() => {
  getNoticeList();
});
</script>

<style scoped>
</style>