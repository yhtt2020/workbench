<!-- 添加社群频道流程中,创建群聊会话弹窗页面 -->
<template>
  <xt-modal
    v-if="createGroupVisible"
    v-model="createGroupVisible"
    :index="1000"
    custom
  >
    <div class="flex flex-col p-4">
      <div class="w-full flex items-center justify-between mb-4">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">{{ modalTitle }}</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="createGroupVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>

      <UserSelect
        :currentLeftList="currentFriendList"
        @close="createGroupVisible = false"
        @forward="getCreateList"
      />
    </div>
  </xt-modal>

  <AddNextCreateGroup
    ref="nextRef"
    :nextList="nextList"
    @close="createGroupVisible = false"
    @handleGroup="handleEmitGroup"
  />
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../../store";

import UserSelect from "../../user/UserSelect.vue";
import AddNextCreateGroup from "./AddNextCreateGroup.vue";

// 解构app中的缓存数据
const app = appStore();
const { userInfo } = storeToRefs(app);
const emit = defineEmits(["handleCurrentGroup", "prev"]);

// 弹窗标题
const modalTitle = ref("选择联系人");
// 获取好友列表
const currentFriendList = ref([]);
// 下一步数组
const nextList = ref([]);
const nextRef = ref(null);

// 开启创建群聊用户选择弹窗
const createGroupVisible = ref(false);
const openCreateGroupSession = () => {
  createGroupVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.FRIEND, {
      friendList: (data) => {
        const filterData = _.filter(data, function (item) {
          return String(item.userID) !== String(userInfo.value.uid);
        });
        const mapList = _.map(filterData, function (item) {
          return item.profile;
        });
        console.log("测试", mapList);
        currentFriendList.value = mapList;
      },
    });
  });
};

// 返回上一步
const returnPreviousStep = () => {
  createGroupVisible.value = false;
  emit("prev");
};

// 获取用户选择后的结果进行下一步处理
const getCreateList = (list) => {
  nextList.value = list;
  nextRef.value.openNextCreateGroup();
};

const handleEmitGroup = (data) => {
  emit("handleCurrentGroup", data);
};

defineExpose({
  openCreateGroupSession,
});
</script>

<style lang="scss" scoped>
</style>