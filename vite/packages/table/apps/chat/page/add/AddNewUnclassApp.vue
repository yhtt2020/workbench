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
  <AddNewAppChat />
  <!-- 链接 -->
  <AddCategoryLink />
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import { CommunityAPI } from "../../api/communityAPI";
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
/**链接**/
import AddCategoryLink from "../../components/link/AddCategoryLink.vue";

const comAPI = new CommunityAPI();
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


const openNewUnClassApp = () => {
  newUnClassRef.value.openAddNewApp();
};

/**社区版块返回上一步**/
const handleUnClassForumPrev = () => {
  newUnClassRef.value.openAddNewApp();
};

/**添加新应用第一步进入第二步**/
const handleUnClassAppNext = (data) => {
  switch (data.type) {
    case "link":
      break;
    case "forum":
      newUnClassForum.value.openForumModal();
      break;
    case "group":
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

defineExpose({
  openNewUnClassApp,
});
</script>

<style lang="scss" scoped>
</style>