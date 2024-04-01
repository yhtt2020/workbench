<!-- 踢除群成员 -->
<template>
  <xt-modal
    v-if="deleteVisible"
    v-model="deleteVisible"
    title="移除群成员"
    :index="1700"
  >
    <UserSelect
      :currentLeftList="userList"
      @close="deleteVisible = false"
      @forward="deleteMember"
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
const { userList,groupID } = toRefs(props);

// 开启删除成员弹窗
const deleteVisible = ref(false);
const handleDeleteMember = () => {
  deleteVisible.value = true;
};

// 删除成员
const deleteMember = async (list) => {
  const userIDList = list.map((item) => item.userID);
  const option = {
    groupID: groupID.value,
    userIDList,
  };
  const res = await TUIGroupService.deleteGroupMember(option);
  if (res.code === 0) {
    deleteVisible.value = false;
    message.success("删除成功");
    TUIStore.watch(StoreName.GRP, {
      currentGroupMemberList: (data) => {
        emit("update", sortMembers(data));
      },
    });
  }
};

defineExpose({
  handleDeleteMember,
});
</script>

<style lang="scss" scoped>
</style>