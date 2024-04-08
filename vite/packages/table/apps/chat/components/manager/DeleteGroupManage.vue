<!-- 将群管理员进行踢除操作的弹窗页面 -->
<template>
  <xt-modal
    v-if="deleteRoleVisible"
    v-model="deleteRoleVisible"
    title="修改群管理员角色"
    :index="1660"
    :maskIndex="1650"
  >
    <UserSelect
      class="mt-4"
      :currentLeftList="deleteList"
      @close="deleteRoleVisible"
      @forward="deleteRole"
    />
  </xt-modal>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { TUIStore, StoreName } from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

import UserSelect from "../user/UserSelect.vue";

const emit = defineEmits(["update"]);
const deleteList = ref([]);

// 开启删除群管理员角色弹窗
const deleteRoleVisible = ref(false);
const openDeleteRole = () => {
  deleteRoleVisible.value = true;
  nextTick(() => {
    TUIStore.watch(StoreName.GRP, {
      currentGroupMemberList: (data) => {
        const memberArr = _.filter(data, function (item) {
          return item?.role === "Admin";
        });
        deleteList.value = memberArr;
      },
    });
  });
};

// 删除群管理角色
const deleteRole = (data) => {
  emit("update", data);
};

defineExpose({
  openDeleteRole,
  deleteRoleVisible,
});
</script>

<style lang="scss" scoped>
</style>