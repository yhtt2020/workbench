<!-- 添加好友弹窗组件 -->
<template>
  <xt-modal
    v-if="addVisible"
    v-model="addVisible"
    title="添加好友"
    @close="closeAdd"
  >
    <div style="width: 500px; height: 300px" class="flex flex-col mt-4">
      <a-input
        v-model:value="keyWord"
        style="border-radius: 12px; height: 40px"
        :spellcheck="false"
        class="xt-bg-2"
        placeholder="输入用户ID搜索"
        @change="handleSearch"
      >
        <template #suffix>
          <xt-button style="width: auto !important" h="0" v-if="keyWord === ''">
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:search-16-filled"
                size="20"
                class="xt-text-2"
              />
            </div>
          </xt-button>
          <xt-button
            style="width: auto !important"
            h="0"
            v-else
            @click="keyWord = ''"
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
      <span class="xt-text font-14 xt-font my-4" v-if="friendResult.length !== 0">搜索结果</span>
      <template v-if="friendResult.length === 0">
        <div class="flex items-center justify-center flex-col h-full">
          <xt-ify-icon icon="fluent-emoji:sleeping-face" size="64" />
          <span class="xt-text font-14 xt-font">暂无数据</span>
        </div>
      </template>

      <template v-else>
        <template v-for="item in friendResult">
          <div
            class="flex items-center justify-between w-full p-4 xt-bg-2 mt-4 rounded-xl"
          >
            <div class="flex items-center">
              <a-avatar :src="item.avatar" size="40" shape="circle" />
              <span class="xt-text font-16 xt-font ml-4">{{ item.nick }}</span>
            </div>
            <xt-button
              type="primary"
              h="32"
              w="80"
              @click="addCurrentFriend(item)"
              v-if="!isCheckAdd"
              style="border-radius: 8px"
            >
              添加
            </xt-button>
            <xt-button
              v-else
              w="80"
              h="32"
              class="xt-bg-t-2"
              style="border-radius: 8px; pointer-events: none"
            >
              已添加
            </xt-button>
          </div>
        </template>
      </template>
    </div>
  </xt-modal>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import TUICore from "@tencentcloud/tui-core";
import Server from "../../../TUIKit/components/TUIGroup/server";
import TUIChatEngine, {
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import _ from "lodash-es";
import { completeTask } from "../../../task/task";

const TUIConstants = Server.getInstance()?.constants?.TUISearch;
const TUISearchServer = TUICore.getService(TUIConstants?.SERVICE?.NAME);

const keyWord = ref("");
// 好友结果
const friendResult = ref([]);
// 这是当前好友列表,用于检测有没有已经添加的的好友
const currentFriendList = ref([]);

const addVisible = ref(false);
const openAddFriend = () => {
  addVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.FRIEND, {
      friendList: (list) => {
        currentFriendList.value = list;
      },
    });
  });
};

// 关闭添加好友弹窗
const closeAdd = () => {
  addVisible.value = false;
  friendResult.value = [];
};

// 好友搜索
const handleSearch = async () => {
  const isNum = /^\d+$/;
  if (keyWord.value !== "" && isNum.test(keyWord.value)) {
    const res = await TUISearchServer.searchUser(keyWord.value);
    if (res.code === 0) {
      friendResult.value = res.data;
    }
  } else {
    message.error("输入框参数不能为空且UID只能为数字");
    friendResult.value = [];
  }
};

// 检测是否已经添加
const isCheckAdd = computed(() => {
  if (friendResult.length !== 0) {
    const isSome = _.some(currentFriendList.value, function (item) {
      return Number(item.userID) === Number(friendResult.value[0]?.userID);
    });
    return isSome;
  } else {
    return false;
  }
});

// 添加好友
const addCurrentFriend = async(item) => {
  const option = {
    to: item.userID,
    source: "AddSource_Type_Web",
    remark: item.nick,
    groupName:'好友',
    type: TUIChatEngine.TYPES.SNS_ADD_TYPE_BOTH,
  };
  const res = await window.$chat?.chat?.addFriend(option);
  if(res.code === 0){
    message.success("添加好友成功");
    keyWord.value = '';
    completeTask('Z0602');
    closeAdd();
  }
};

defineExpose({
  openAddFriend,
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
</style>
