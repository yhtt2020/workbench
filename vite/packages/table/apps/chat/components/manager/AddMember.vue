<!-- 添加群成员弹窗 -->
<template>
  <xt-modal
    v-if="memberVisible"
    v-model="memberVisible"
    title="添加群成员"
    :index="1700"
  >
    <UserSelect
      :currentLeftList="userList"
      @close="memberVisible = false"
      @forward="addMember"
    />
  </xt-modal>
</template>

<script setup>
import { ref, toRefs } from "vue";
import {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import { message } from "ant-design-vue";
import { sortMembers } from "../../hooks/groupType";

import UserSelect from "../user/UserSelect.vue";

const emit = defineEmits(["update"]);

const props = defineProps({
  userList: {
    type: Array,
    default: () => [],
  },
  groupID: {
    type: String,
    required: true,
  },
});
const { userList, groupID } = toRefs(props);

// 开启添加成员弹窗
const memberVisible = ref(false);
const openMemberModal = () => {
  memberVisible.value = true;
};

// 添加成员
const addMember = async (list) => {
  const userIDList = list.map((item) => item.userID);
  const option = {
    groupID: groupID.value,
    userIDList,
  };
  const res = await TUIGroupService.addGroupMember(option);
  if (res.code === 0) {
    memberVisible.value = false;
    message.success("添加成功");
    TUIStore.watch(StoreName.GRP, {
      currentGroupMemberList: (data) => {
        emit("update", sortMembers(data));
      },
    });
  }
};

defineExpose({
  openMemberModal,
});
</script>

<style lang="scss" scoped>
</style>