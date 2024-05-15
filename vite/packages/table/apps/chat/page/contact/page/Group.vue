<!-- 联系人模块中的群聊列表页 -->
<template>
  <div class="w-full h-full flex flex-col px-4">
    <div class="flex w-full items-center justify-between pt-1">
      <span class="xt-text xt-font font-16">群聊({{ currentGroupList.length }}个)</span>
      <xt-button
        w="32"
        h="32"
        type="theme"
        style="border-radius: 8px"
        @click="createGroup"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:add-16-filled" size="20" />
        </div>
      </xt-button>
    </div>

    <!-- 空状态 -->
    <template v-if="currentGroupList.length === 0">
      <div class="flex flex-col items-center justify-center h-full">
        <xt-ify-icon
          icon="fluent-emoji:sleeping-face"
          size="64"
          style="color: #d9d9d9"
        />
        <span class="xt-text xt-font font-16" style="color: #d9d9d9"
          >暂无群聊</span
        >
      </div>
    </template>

    <xt-scrollbar :y="true" style="height: 100%" v-else>
      <div style="height: 16px"></div>
      <template v-for="item in currentGroupList">
        <div
          class="flex items-center pointer rounded-lg p-4 group-item"
          @click="handleCheckInfo(item)"
        >
          <a-avatar shape="square" size="32" :src="item.avatar" />
          <div class="flex flex-col ml-2">
            <span class="xt-text xt-font font-16">{{ item.name }}</span>
            <span class="xt-text xt-font font-14">200人群</span>
          </div>
        </div>
      </template>
      <div style="height: 16px"></div>
    </xt-scrollbar>
  </div>
  <!-- 群聊创建弹窗 -->
  <GroupUserSelect ref="groupCreateRef" />

  <!-- 群聊基本信息展示弹窗 -->
  <GroupInfo ref="groupInfoRef" :info="currentGroupInfo"/>
</template>

<script setup>
import { ref, toRefs } from "vue";
import {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";

import GroupUserSelect from "../../../components/create/CreateGroupSession.vue";
import GroupInfo from "../components/GroupInfo.vue";

const chat = window.$chat?.chat;

/**当前群聊列表**/
const currentGroupList = ref([]);
/**当前社群的创建和群信息**/
const groupCreateRef = ref(null);
const groupInfoRef = ref(null);
/**获取当前群信息**/
const currentGroupInfo = ref({});

TUIStore.watch(StoreName.GRP, {
  groupList: (data) => {
    currentGroupList.value = data;
  },
});

/**旧版代码**/
// const props = defineProps({
//   list: {
//     type: Array,
//     default: () => [],
//   },
// });
// const { list } = toRefs(props);



// 创建群聊
const createGroup = () => {
  groupCreateRef.value.openCreateGroupSession();
};
// 查看当前群聊信息
const handleCheckInfo = async(item) => {
  const options = {
    groupID:item.groupID,
    count: 100,
  };
  const res  = await chat.getGroupProfile(options);
  if(res.code === 0){
    const { group } = res.data;
    currentGroupInfo.value = group;
  }
  groupInfoRef.value.openGroupInfo();
};
</script>

<style lang="scss" scoped>
.group {
  &-item {
    &:hover {
      background: rgba(80, 139, 254, 0.2);
    }
  }
}
</style>
