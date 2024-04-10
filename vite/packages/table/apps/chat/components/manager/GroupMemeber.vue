<!-- 群成员管理页面 -->
<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="memberVisible"
      :closable="false"
      @close="closeManageMember"
      width="500"
      :zIndex="1600"
    >
      <template #title>
        <div class="flex items-center w-full">
          <xt-button
            w="40"
            h="40"
            style="margin-right: 16px; border-radius: 8px"
            @click="closeManageMember"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:chevron-left-16-regular"
                class="xt-text-2"
                size="30"
              />
            </div>
          </xt-button>
          <span class="xt-text font-16 xt-font">群成员</span>
        </div>
      </template>
      <div class="flex flex-col p-3 xt-bg-2 rounded-lg">
        <template v-for="item in memberList">
          <div class="flex w-full items-center justify-between mb-4">
            <div class="flex items-center justify-center">
              <a-avatar
                :src="item.avatar"
                size="48"
              ></a-avatar>
              <span class="ml-3 xt-text-2 font-14 xt-font">{{ item.nick }}</span>
            </div>
            <span class="xt-text-2 font-14 xt-font">{{ isOwner(item) }}</span>
          </div>
        </template>
      </div>
    </a-drawer>
  </teleport>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../store";
import { sortMembers } from "../../hooks/groupType";

const emit = defineEmits(["closeMember"]);
const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});

const app = appStore();
const { userInfo } = storeToRefs(app);

const memberVisible = ref(false);
const memberList = ref([]);

// 开启弹窗
const openManageMember = () => {
  memberVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP, {
      currentGroupMemberList: (data) => {
        memberList.value = sortMembers(data);
      },
    });
  });
};
// 关闭弹窗
const closeManageMember = () => {
  memberVisible.value = false;
  emit("closeMember");
};

// 标识当前用户是否是群主
const isOwner = (item) => {
  const isSelf = Number(item?.userID) === Number(userInfo.value.uid);
  if(item.role === "Owner" && isSelf){
    return '(群主)(我)';
  }
  else if(item.role === "Admin" && isSelf){
    return '(管理员)(我)';
  }
  else if(item.role === "Admin" && !isSelf){
    return '(管理员)';
  }
  else if(item.role === "Owner" && !isSelf){
    return '(群主)';
  }
  else if(isSelf){
    return '(我)';
  }
};

defineExpose({
  openManageMember,
});
</script>

<style lang="scss" scoped>
</style>