<!-- 群管理员页面 -->
<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="manageVisible"
      width="500"
      zIndex="1600"
      :closable="false"
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
                icon="fluent:chevron-left-16-filled"
                class="xt-text-2"
                size="30"
              />
            </div>
          </xt-button>
          <span class="xt-text font-16 xt-font">群管理员</span>
        </div>
      </template>

      <div class="rounded-xl xt-bg-2 p-3 flex flex-col mb-4">
        <span class="xt-text xt-font font-16 mb-4">群管理员</span>
        <div class="flex items-center admin-container">
          <!-- 显示群管理员列表 -->
          <template v-for="item in adminList">
            <div
              class="flex items-center admin-item justify-center flex-col mr-3"
            >
              <a-avatar :src="item.avatar" size="32" />
              <span
                class="xt-text truncate xt-font font-12"
                style="max-width: 60px"
              >
                {{ item.nick }}
              </span>
            </div>
          </template>

          <!-- 添加 -->
          <xt-button
            w="32"
            h="32"
            style="
              background: rgba(80, 139, 254, 0.2);
              border-radius: 8px;
              margin-right: 12px;
            "
            @click="addRole"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:add-circle-12-filled"
                class="link"
                size="20"
              />
            </div>
          </xt-button>

          <!-- 取消 -->
          <xt-button
            w="32"
            h="32"
            style="background: rgba(255, 77, 79, 0.2); border-radius: 8px"
            @click="deleteRole"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="akar-icons:circle-minus-fill"
                class="error"
                size="20"
              />
            </div>
          </xt-button>
        </div>
      </div>

      <div class="rounded-xl xt-bg-2 p-3 flex flex-col">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col">
            <span class="xt-text xt-font font-16">全员禁言</span>
            <span class="xt-text-2 xt-font font-14">
              全员禁言开启后,只允许群主和管理员发言
            </span>
          </div>
          <a-switch
            v-model:checked="groupInfo.muteAllMembers"
            @change="updateMuteAllChecked($event)"
          />
        </div>
        <div class="my-3" style="background: var(--divider); height: 1px"></div>
        <div class="flex items-center admin-container">
          <!-- 显示群管理员列表 -->
          <template v-for="item in muteList">
            <div
              class="flex items-center admin-item justify-center flex-col mr-3"
            >
              <a-avatar :src="item.avatar" size="32" />
              <span
                class="xt-text truncate xt-font font-12"
                style="max-width: 60px"
              >
                {{ item.nick }}
              </span>
            </div>
          </template>

          <!-- 添加 -->
          <xt-button
            w="32"
            h="32"
            style="
              background: rgba(80, 139, 254, 0.2);
              border-radius: 8px;
              margin-right: 12px;
            "
            @click="setMemberMute"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="fluent:add-circle-12-filled"
                class="link"
                size="20"
              />
            </div>
          </xt-button>

          <!-- 取消 -->
          <xt-button
            w="32"
            h="32"
            style="background: rgba(255, 77, 79, 0.2); border-radius: 8px;"
            @click="deleteMemberMute"
          >
            <div class="flex items-center justify-center">
              <xt-ify-icon
                icon="akar-icons:circle-minus-fill"
                class="error"
                size="20"
              />
            </div>
          </xt-button>
        </div>
      </div>
    </a-drawer>
  </teleport>

  <!-- 修改群管理员角色 -->
  <UpdateGroupRole ref="updateRoleRef" @updateRole="updateRoleData" />
  <DeleteGroupManage ref="deleteRoleRef" @update="deleteRoleData" />

  <!-- 设置群成员禁言 -->
  <AddMemberMute ref="addMuteRef" @updateMute="setMuteList"/>
  <DeleteMemberMute ref="deleteMuteRef" @deleteMute="delMuteList" :muteList="muteList"/>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import TUIChatEngine, {
  TUIStore,
  StoreName,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import _ from "lodash-es";
import { message } from "ant-design-vue";
import { enableSampleTaskStatus } from "../../../TUIKit/utils/enableSampleTaskStatus";

import UpdateGroupRole from "./UpdateGroupRole.vue";
import DeleteGroupManage from "./DeleteGroupManage.vue";
import AddMemberMute from "./AddMemberMute.vue";
import DeleteMemberMute from "./DeleteMemberMute.vue";

// 限制message提示框最大显示数量
message.config({
  maxCount: 1,
});

const chat = window.$chat.chat;
const emit = defineEmits(["closeMember", "updateMuteAllMembers"]);

const props = defineProps({
  groupInfo: {
    type: String,
    default: () => {},
  },
});
const { groupInfo } = toRefs(props);

const adminList = ref([]);
// 被禁言的用户列表
const muteList = ref([]);
const updateRoleRef = ref(null);
const deleteRoleRef = ref(null);
const addMuteRef = ref(null);
const deleteMuteRef = ref(null);

const getGroupAdminList = () => {
  TUIStore.watch(StoreName.GRP, {
    currentGroupMemberList: (data) => {
      // console.log('data',data);
      // 群管理员列表
      const adminArr = _.filter(data, function (item) {
        return item?.role === "Admin";
      });
      adminList.value = adminArr;
      // 被禁言的成员列表
      const muteArr = _.filter(data, function (item) {
        return item?.muteUntil !== 0;
      });
      muteList.value = muteArr;
    },
  });
};

// 开启群管理员修改功能
const manageVisible = ref(false);
const openGroupManageDrawer = () => {
  manageVisible.value = true;
  nextTick(() => {
    // 获取群管理员列表
    getGroupAdminList();
  });
};

// 关闭群管理员修改功能
const closeManageMember = () => {
  manageVisible.value = false;
  emit("closeMember");
};

// 设置群管理员
const addRole = () => {
  updateRoleRef.value.openRoleModal();
};
const updateRoleData = (data) => {
  for (const item of data) {
    const option = {
      groupID: groupInfo.value?.groupID,
      userID: item.userID,
      role: TUIChatEngine.TYPES.GRP_MBR_ROLE_ADMIN,
    };
    chat
      .setGroupMemberRole(option)
      .then((res) => {
        if (res.code === 0) {
          message.success("添加群管理员成功");
          updateRoleRef.value.roleVisible = false;
        }
      })
      .catch((err) => {
        message.error("你不是群主,只有群主才有权限操作");
      });
  }
};

// 解除群管理员
const deleteRole = () => {
  deleteRoleRef.value.openDeleteRole();
};
const deleteRoleData = (data) => {
  for (const item of data) {
    const option = {
      groupID: groupInfo.value?.groupID,
      userID: item.userID,
      role: TUIChatEngine.TYPES.GRP_MBR_ROLE_MEMBER,
    };
    chat
      .setGroupMemberRole(option)
      .then((res) => {
        if (res.code === 0) {
          message.success("群管理员移除成功");
          deleteRoleRef.value.deleteRoleVisible = false;
        }
      })
      .catch((err) => {
        message.error("你不是群主,只有群主才有权限操作");
      });
  }
};

// 修改禁言开启状态
const updateMuteAllChecked = (evt) => {
  const options = {
    groupID: groupInfo.value?.groupID,
    muteAllMembers: evt,
  };
  chat.updateGroupProfile(options).then((res) => {
    if (res.code === 0) {
      enableSampleTaskStatus("muteGroup");
      message.success("设置全员禁言成功");
    }
  });
};

// 设置群成员禁言
const setMemberMute = () =>{
  addMuteRef.value.openMuteModal();
};
const setMuteList = (list) =>{
  for(const item of list){
    const option = {
      groupID: groupInfo.value?.groupID,
      userID: item.userID,
      muteTime: 600,
    }
    chat.setGroupMemberMuteTime(option).then((res) => {
      if(res.code === 0){
        message.success("设置禁言成功");
      }
    }).catch((err) => {
      message.error("你不是群主,只有群主才有权限操作");
    })
  }
  addMuteRef.value.muteVisible = false;
}

// 解除群成员禁言
const deleteMemberMute = () => {
  deleteMuteRef.value.openDeleteMuteModal();
};
const delMuteList = (list) =>{
  for(const item of list){
    const option = {
      groupID: groupInfo.value?.groupID,
      userID: item.userID,
      muteTime: 0,
    }
    chat.setGroupMemberMuteTime(option).then((res) => {
      if(res.code === 0){
        message.success("解除禁言成功");
      }
    }).catch((err) => {
      message.error("你不是群主,只有群主才有权限操作");
    })
  }
  deleteMuteRef.value.deleteMuteVisible = false;
}

defineExpose({
  openGroupManageDrawer,
});
</script>

<style lang="scss" scoped>
.admin {
  &-container {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 4px; // 元素之间的间距
  }
  .item {
    width: 100%; // 元素宽度占满父容器
  }
}
</style>
