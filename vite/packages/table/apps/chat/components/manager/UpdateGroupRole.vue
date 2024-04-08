<!-- 将群成员升级为群管理员的弹页面 -->
<template>
 <xt-modal
   v-if="roleVisible"
   v-model="roleVisible"
   title="修改群管理角色"
   :index="1660"
   :maskIndex="1650"
 >
   <UserSelect class="mt-4" :currentLeftList="roleList" @forward="addRole" @close="roleVisible = false"/>
 </xt-modal>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import UserSelect from "../user/UserSelect.vue";
import {
 TUIStore,
 StoreName,
 TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";

const emit = defineEmits(["updateRole"]);
const roleList = ref([]);

// 开启群管理角色修改弹窗
const roleVisible = ref(false);
const openRoleModal = () => {
 roleVisible.value = true;
 nextTick(() => {
   TUIStore.watch(StoreName.GRP, {
     currentGroupMemberList: (data) => {
       const memberArr = _.filter(data, function (item) {
         return item?.role === "Member";
       });
       roleList.value = memberArr;
     },
   });
 });
};

// 添加或删除群管理角色
const addRole = (data) => {
 emit("updateRole", data);
};

defineExpose({
 openRoleModal,
 roleVisible
});
</script>

<style lang="scss" scoped>
</style>