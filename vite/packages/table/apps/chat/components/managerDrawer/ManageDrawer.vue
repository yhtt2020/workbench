<!-- 群管理页 -->
<template>
  <teleport to="body">
    <a-drawer
      v-model:visible="manageVisible"
      title="群管理"
      width="500"
      :zIndex="1500"
      @close="manageVisible = false"
    >
      <!-- 群基本信息 -->
      <div
        class="xt-bg-2 rounded-xl flex flex-col p-4 pointer"
        @click="openManageName"
      >
        <div class="flex items-center justify-between pointer mb-3">
          <span class="xt-text font-16 xt-font">群信息</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
        <div class="flex items-center pointer">
          <a-avatar
            :src="manageInfo.avatar"
            size="48"
            shape="square"
          ></a-avatar>
          <span class="ml-3 xt-text-2 font-14 xt-font">{{
            manageInfo.groupName
          }}</span>
        </div>
      </div>

      <!-- 群公告 -->
      <div
        class="xt-bg-2 rounded-xl flex flex-col p-4 my-4"
        @click="openManageNotice"
      >
        <div
          class="flex items-center justify-between pointer mb-3"
          @click="openManageNotice"
        >
          <span class="xt-text font-16 xt-font">群公告</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="20"
          ></xt-ify-icon>
        </div>
        <span class="w-full xt-text-2 xt-font font-14">
          {{ manageInfo.notification !== '' ? manageInfo.notification : '暂无群公告' }}
        </span>
      </div>

      <!-- 群成员 -->
      <div class="xt-bg-2 rounded-lg flex flex-col p-4 mb-4">
        <div
          class="flex items-center justify-between pointer mb-3"
          @click="openManageMember"
        >
          <span class="xt-text font-16 xt-font">群成员</span>
          <div class="flex">
            <span class="xt-text-2 xt-font font-14">{{ currentMemberList.length }}人</span>
            <xt-ify-icon
              icon="fluent:chevron-right-28-regular"
              class="xt-text-2"
              size="20"
            />
          </div>
        </div>
        <div class="flex w-full">
          <!-- 不具备管理员权限 -->
          <template v-if="manageInfo.role === 'Member'">
            <template v-for="item in currentMemberList.slice(0, 7)">
              <div class="flex flex-col items-center justify-center mr-2.5">
                <a-avatar :src="item.avatar" size="32"></a-avatar>
                <span
                  class="xt-text truncate xt-font font-12"
                  style="max-width: 48px"
                >
                  {{ item.nick }}
                </span>
              </div>
            </template>
          </template>

          <!-- 具备管理员权限 -->
          <template v-else>
            <div class="flex items-center">
              <template v-for="item in currentMemberList.slice(0, 6)">
                <div class="flex flex-col items-center justify-center mr-2.5">
                  <a-avatar :src="item.avatar" size="32"></a-avatar>
                  <span
                    class="xt-text truncate xt-font font-12"
                    style="max-width: 48px"
                  >
                    {{ item.nick }}
                  </span>
                </div>
              </template>

              <!-- 添加群成员 -->
              <xt-button
                w="32"
                h="32"
                style="
                  background: rgba(80, 139, 254, 0.2);
                  border-radius: 8px;
                  margin-right: 10px;
                "
                @click="addManagerMember"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="fluent:add-circle-12-filled"
                    class="link"
                    size="20"
                  />
                </div>
              </xt-button>

              <!-- 踢出群成员 -->
              <xt-button
                w="32"
                h="32"
                style="background: rgba(255, 77, 79, 0.2); border-radius: 8px"
                @click="deleteManagerMember"
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
          </template>
        </div>
      </div>

      <!-- 群类型展示区域 -->
      <div class="xt-bg-2 rounded-lg flex flex-col p-4 mb-4">
        <!-- 群管理入口 -->
        <div
          class="flex items-center justify-between pointer mb-4"
          v-if="manageInfo.role !== 'Member'"
          @click="openGroupManage"
        >
          <span class="xt-text font-16 xt-font">群管理</span>
          <xt-ify-icon
            icon="fluent:chevron-right-28-regular"
            class="xt-text-2"
            size="24"
          />
        </div>
        <div class="flex flex-col w-full">
          <!-- 群ID -->
          <div class="flex justify-between">
            <span class="xt-text xt-font font-16">群ID</span>
            <div class="flex items-center justify-center">
              <span class="xt-text-2 xt-font font-14">{{
                manageInfo.groupID
              }}</span>
              <xt-button
                h="0"
                style="width: auto !important"
                @click="copyGroupID"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="fluent:copy-16-regular"
                    size="24"
                    class="xt-text-2"
                  />
                </div>
              </xt-button>
            </div>
          </div>

          <!-- 群类型 -->
          <div class="flex justify-between my-4">
            <span class="xt-text xt-font font-16">群类型</span>
            <span class="xt-text-2 xt-font font-14">
              {{ getTypeName(manageInfo.type) }}
            </span>
          </div>

          <!-- 入群方式 -->
          <div class="flex justify-between mb-4">
            <span class="xt-text xt-font font-16">加群方式</span>
            <div class="flex items-center justify-center">
              <span class="xt-text-2 xt-font font-14">
                {{ joinName(manageInfo.join) }}
              </span>
              <xt-button
                h="0"
                style="width: auto !important"
                v-if="manageInfo.role !== 'Member'"
                @click="joinDrawer"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="fluent:chevron-right-28-regular"
                    class="xt-text-2"
                    size="24"
                  />
                </div>
              </xt-button>
            </div>
          </div>

          <!-- 邀请方式 -->
          <div class="flex justify-between">
            <span class="xt-text xt-font font-16">邀请方式</span>
            <div class="flex items-center justify-center">
              <span class="xt-text-2 xt-font font-14">
                {{ inviteName(manageInfo.invite) }}
              </span>
              <xt-button
                h="0"
                style="width: auto !important"
                v-if="manageInfo.role !== 'Member'"
                @click="inviteDrawer"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="fluent:chevron-right-28-regular"
                    class="xt-text-2"
                    size="24"
                  />
                </div>
              </xt-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部群聊退出、解散群聊、转让群聊按钮 -->
      <template v-if="manageInfo.role === 'Member'">
        <div class="flex items-center justify-center w-full">
          <xt-button
            h="48"
            w="190"
            style="border-radius: 8px; background: var(--error) !important"
            @click="quitGroup"
          >
            退出群聊
          </xt-button>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-center w-full">
          <xt-button
            style="border-radius: 8px; margin-right: 12px"
            h="48"
            w="190"
            @click="transferGroup"
          >
            转让群聊
          </xt-button>
          <xt-button
            style="border-radius: 8px; background: var(--error) !important"
            h="48"
            w="190"
            @click="dissolveGroup"
          >
            解散群聊
          </xt-button>
        </div>
      </template>
    </a-drawer>
  </teleport>

  <!-- 修改群昵称和头像基本信息弹窗 -->
  <GroupName
    ref="nameRef"
    :info="manageInfo"
    @closeName="manageVisible = true"
  />

  <!-- 修改公告弹窗 -->
  <NoticeDrawer
    :groupID="manageInfo.groupID"
    ref="noticeRef"
    :isBack="true"
    @closeNotice="manageVisible = true"
  />

  <!-- 修改群成员弹窗 -->
  <MemberDrawer ref="memberRef" @closeMember="manageVisible = true" />

  <!-- 添加群成员弹窗 -->
  <AddMember
    ref="userSelectRef"
    :userList="addMemberList"
    :groupID="groupID"
    @update="updateMemeber"
  />

  <!-- 移除群成员弹窗 -->
  <DeleteUserSelect
    ref="deleteUserSelectRef"
    :userList="currentMemberList"
    @update="updateMemeber"
    :groupID="groupID"
  />

  <!-- 修改群管理员弹窗 -->
  <GroupManage
    ref="updateManageRef"
    :groupInfo="manageInfo"
    @closeMember="manageVisible = true"
    @updateMuteAllMembers="updateGroupManager"
  />

  <!-- 修改加群方式 -->
  <JoinVerfiate
    ref="joinRef"
    :currentJoin="manageInfo.join"
    @update="updateJoin"
  />

  <!-- 修改邀请方式 -->
  <InviteVerfiacte
    ref="inviteRef"
    :currentInvite="manageInfo.invite"
    @update="updateInvite"
  />
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import {
  TUIStore,
  StoreName,
  TUIFriendService,
  TUIGroupService,
} from "@tencentcloud/chat-uikit-engine";
import useClipboard from "vue-clipboard3";
import { message } from "ant-design-vue";
import {
  getTypeName,
  joinName,
  inviteName,
  sortMembers,
} from "../../hooks/groupType";

import GroupName from "../manager/GroupName.vue";
import NoticeDrawer from "./NoticeDrawer.vue";
import MemberDrawer from "../manager/GroupMemeber.vue";
import AddMember from "../manager/AddMember.vue";
import DeleteUserSelect from "../manager/DeleteMember.vue";
import GroupManage from "../manager/GroupManage.vue";
import JoinVerfiate from "../manager/JoinVerfiate.vue";
import InviteVerfiacte from "../manager/InviteVerfiacte.vue";

const chat = window.$chat.chat;

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});
const { groupID } = toRefs(props);

// 群管理信息
const manageInfo = ref({});
const nameRef = ref(null);
const noticeRef = ref(null);
const memberRef = ref(null);
const userSelectRef = ref(null);
const deleteUserSelectRef = ref(null);
const updateManageRef = ref(null);
const joinRef = ref(null);
const inviteRef = ref(null);

// 当前群成员列表
const currentMemberList = ref([]);
// 好友添加成为群成员列表
const addMemberList = ref([]);

// 初始化数据
const initManageData = () => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: (data) => {
      const groupProfile = data?.groupProfile;
      manageInfo.value.avatar = groupProfile.avatar;
      manageInfo.value.groupName = groupProfile.name;
      manageInfo.value.groupID = groupProfile.groupID;
      manageInfo.value.role = groupProfile.selfInfo?.role;
      manageInfo.value.notification = groupProfile.notification;
      manageInfo.value.type = groupProfile.type;
      manageInfo.value.join = groupProfile.joinOption;
      manageInfo.value.invite = groupProfile.inviteOption;
      manageInfo.value.muteAllMembers = groupProfile.muteAllMembers;
    },
  });
  TUIStore.watch(StoreName.GRP, {
    currentGroupMemberList: (data) => {
      currentMemberList.value = sortMembers(data);
    },
  });
};

// 开启群基础信息修改弹窗
const manageVisible = ref(false);
const openManageDrawer = () => {
  manageVisible.value = true;
  nextTick(() => {
    initManageData();
  });
};

// 开启群昵称和头像修改弹窗
const openManageName = () => {
  manageVisible.value = false;
  nameRef.value.openNameDrawer();
};
// 开启群公告修改弹窗
const openManageNotice = () => {
  manageVisible.value = false;
  noticeRef.value.openNoticeDrawer();
};
// 开启群成员管理弹窗
const openManageMember = () => {
  manageVisible.value = false;
  memberRef.value.openManageMember();
};

// 复制群ID
const copyGroupID = async () => {
  const { toClipboard } = useClipboard();
  const res = await toClipboard(manageInfo.value.groupID);
  if (res.text !== "") {
    message.success("群聊ID成功复制");
  }
};

// 群成员踢出群
const deleteManagerMember = async () => {
  deleteUserSelectRef.value.handleDeleteMember();
};
// 群成员添加
const addManagerMember = async () => {
  userSelectRef.value.openMemberModal();
  const imResponse = await TUIFriendService.getFriendList();
  const friendList = imResponse.data.map((item) => {
    return {
      ...item?.profile,
    };
  });
  addMemberList.value = friendList;
};

// 更新当前群成员数据
const updateMemeber = (data) => {
  currentMemberList.value = data;
};
// 更新当前群禁言状态
const updateGroupManager = (data) => {
  manageInfo.value.muteAllMembers = data.muteAllMembers;
};

// 开启群管理入口 就是将群成员升级为群管理员
const openGroupManage = () => {
  updateManageRef.value.openGroupManageDrawer();
};

// 解散群聊
const dissolveGroup = async () => {
  const res = await TUIGroupService.dismissGroup(manageInfo.value.groupID);
  if (res.code === 0) {
    message.success("解散群聊成功");
    manageVisible.value = false;
  }
};
// 退出群聊
const quitGroup = async () => {
  const res = await TUIGroupService.quitGroup(manageInfo.value.groupID);
  if (res.code === 0) {
    message.success("群聊退出成功");
    manageVisible.value = false;
  }
};

// 开启修改加群验证方式的弹窗
const joinDrawer = () => {
  joinRef.value.openJoinModal();
};
// 开启修改群邀请方式的弹窗
const inviteDrawer = () => {
  inviteRef.value.openInviteModal();
};

// 更新加入方式
const updateJoin = async (data) => {
  const options = {
    groupID: manageInfo.value.groupID,
    joinOption: data,
  };
  const res = await chat.updateGroupProfile(options);
  // console.log("更新", res);
  if (res.code === 0) {
    const { group } = res.data;
    manageInfo.value.join = group.joinOption;
    message.success("加群方式修改成功");
    joinRef.value.joinVisible = false;
  }
};

// 更新邀请方式
const updateInvite = async (data) => {
  const options = {
    groupID: manageInfo.value.groupID,
    inviteOption: data,
  };
  const res = await chat.updateGroupProfile(options);
  if (res.code === 0) {
    const { group } = res.data;
    manageInfo.value.invite = group.inviteOption;
    message.success("邀请方式修改成功");
    inviteRef.value.inviteVisible = false;
  }
};

defineExpose({
  openManageDrawer,
});
</script>

<style lang="scss" scoped>
</style>