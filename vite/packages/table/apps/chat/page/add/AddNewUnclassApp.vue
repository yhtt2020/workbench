<!-- 添加新应用(没有分类选择的流程) -->
<template>
  <!-- 添加新应用,没有频道分类选择的第一步 -->
  <AddNewApp ref="newUnClassRef" @next="handleUnClassAppNext" />

  <!-- 添加新应用,没有频道分类选择的第二步 -->
  <!-- 社区版块 -->
  <AddNewForum
    ref="newUnClassForum"
    @next="handleUnClassForumNext"
    @prev="handleUnClassForumPrev"
    :title="'确定'"
    :isClose="true"
  />
  <!-- 群聊 -->
  <AddNewAppChat
    ref="newUnClassChat"
    @next="handleChatNext"
    @prev="handleUnClassForumPrev"
  />
  <!-- 选择自定义群聊 -->
  <AddCustomGroup
    ref="newUnClassCustom"
    :isClose="true"
    @prev="handleUnClassCustomPrev"
    @next="handleUnClassCustomNext"
  />
  <!-- 群聊创建 -->
  <AddCreateGroup
    ref="newUnClassCreate"
    @prev="handleUnClassCustomPrev"
    @handleCurrentGroup="handleUnClassCreateNext"
  />
  <!-- 链接 -->
  <AddCategoryLink
    ref="newUnClassLink"
    @next="handleUnClassLink"
    @prev="handleUnClassForumPrev"
    :title="'确定'"
  />
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import { channelClass } from "../../../../js/chat/createChannelClass";
import { chatCommunityStore } from "../../store/chatCommunity";
import { message } from "ant-design-vue";

/**新应用第一步弹窗**/
import AddNewApp from "../../components/add/AddNewApp.vue";
/**新应用第二步弹窗**/
/** 社区版块**/
import AddNewForum from "../../components/add/newapp/AddNewForum.vue";
/**群聊**/
import AddNewAppChat from "../../components/add/group/AddNewAppChat.vue";
/**群聊选择**/
import AddCustomGroup from "../../components/add/group/AddCustomGroup.vue";
/**群聊创建**/
import AddCreateGroup from "../../components/add/group/AddCreateGroup.vue";

/**链接**/
import AddCategoryLink from "../../components/link/AddCategoryLink.vue";

// 限制message提示框最大显示数量
message.config({
  maxCount: 1,
});

const chatCommunity = chatCommunityStore();

const props = defineProps({
  currentAppSet: {
    type: Object,
    default: () => ({}),
  },
});
const { currentAppSet } = toRefs(props);

const newUnClassRef = ref(null);
const newUnClassForum = ref(null);
const newUnClassCustom = ref(null);
const newUnClassChat = ref(null);
const newUnClassCreate = ref(null);
const newUnClassLink = ref(null);

const openNewUnClassApp = () => {
  newUnClassRef.value.openAddNewApp();
};

/**社区版块返回上一步**/
const handleUnClassForumPrev = () => {
  newUnClassRef.value.openAddNewApp();
};
/**自定义群聊返回上一步**/
const handleUnClassCustomPrev = () => {
  newUnClassChat.value.openChatModal();
};

/**添加新应用第一步进入第二步**/
const handleUnClassAppNext = (data) => {
  switch (data.type) {
    case "link":
      newUnClassLink.value.openLinkModal();
      break;
    case "forum":
      newUnClassForum.value.openForumModal();
      break;
    case "group":
      newUnClassChat.value.openChatModal();
      break;
  }
};

/**版块数据的回调**/
const handleUnClassForumNext = async (data) => {
  const option = {
    parentID: currentAppSet.value?.id,
    item: { type: "forum", item: data.item },
    communityNo: currentAppSet.value?.communityNo,
  };
  const rs = await channelClass.secondaryChannel(option);
  if (rs.status === 1) {
    message.success(`${rs.info}`);
    chatCommunity.getCommunityTree(currentAppSet.value?.communityNo);
    newUnClassForum.value.forumVisible = false;
  }
};

/**群聊模块选择后**/
const handleChatNext = (type) => {
  switch (type) {
    case "create":
      newUnClassCreate.value.openCreateGroupSession();
      break;
    case "related":
      newUnClassCustom.value.openCustomGroupModal();
      break;
  }
};

/**自定义群聊选中后**/
const handleUnClassCustomNext = async (list) => {
  for (const item of list) {
    const option = {
      parentID: currentAppSet.value?.id,
      item: { type: "group", item: item },
      communityNo: currentAppSet.value?.communityNo,
    };
    const rs = await channelClass.secondaryChannel(option);
    if (rs.status === 1) {
      message.success(`${rs.info}`);
      chatCommunity.getCommunityTree(currentAppSet.value?.communityNo);
      newUnClassCustom.value.customVisible = false;
    }
  }
};

/**群聊创建后**/
const handleUnClassCreateNext = async (data) => {
  const option = {
    parentID: currentAppSet.value?.id,
    item: { type: "group", item: data },
    communityNo: currentAppSet.value?.communityNo,
  };
  const rs = await channelClass.secondaryChannel(option);
  if (rs.status === 1) {
    message.success(`${rs.info}`);
    chatCommunity.getCommunityTree(currentAppSet.value?.communityNo);
  }
};

/**链接创建后**/
const handleUnClassLink = async (data) => {
  const option = {
    parentID: currentAppSet.value?.id,
    item: { type: "link", item: data },
    communityNo: currentAppSet.value?.communityNo,
  };
  const rs = await channelClass.secondaryChannel(option);
  if (rs.status === 1) {
    message.success(`${rs.info}`);
    chatCommunity.getCommunityTree(currentAppSet.value?.communityNo);
  }
};

defineExpose({
  openNewUnClassApp,
});
</script>

<style lang="scss" scoped>
</style>