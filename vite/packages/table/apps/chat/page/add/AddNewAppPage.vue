<!-- 添加新应用(变化分类选择的流程) -->
<script setup>
import { onMounted, ref, toRefs, getCurrentInstance } from "vue";

/**第一步弹窗组件**/
import AddNewApp from "../../components/add/AddNewApp.vue";
/**第二步弹窗组件**/
/**社区版块**/
import AddNewForum from "../../components/add/newapp/AddNewForum.vue";
/**链接**/
import AddCategoryLink from "../../components/link/AddCategoryLink.vue";
/**群聊**/
import AddNewAppChat from "../../components/add/group/AddNewAppChat.vue";
/**选择群聊**/
import AddCustomGroup from "../../components/add/group/AddCustomGroup.vue";
/**创建群聊**/
import CreateGroupSession from "../../components/add/group/AddCreateGroup.vue";
/**第三步弹窗组件**/
import CategoryClass from "../../components/add/class/CategoryClass.vue";

const { proxy } = getCurrentInstance();

const newAppRef = ref(null);
const newForumRef = ref(null);
const newLinkRef = ref(null);
const newChatRef = ref(null);
const newClassRef = ref(null);
const newGroupSession = ref(null);
const newCustomGroup = ref(null);

const currentNewData = ref({
  type: {},
  item: {},
});

/**事件**/
const openNewAppFirstStep = () => {
  newAppRef.value.openAddNewApp();
};
// 社区版块返回第一步
const handleForumPrev = () => {
  openNewAppFirstStep();
};
// 第一步进入第二步
const handleFirstStep = (data) => {
  switch (data.type) {
    case "forum":
      newForumRef.value.openForumModal();
      break;
    case "link":
      newLinkRef.value.openLinkModal();
      break;
    case "group":
      newChatRef.value.openChatModal();
      break;
  }
};
// 第二步进入第三步
/**社区版块**/
const handleForumSecondaryNext = (data) => {
  currentNewData.value.item = data?.item;
  currentNewData.value.type = "forum";
  newClassRef.value.openClassModal();
};
/**群聊模块**/
const handleGroupNext = (type) => {
  switch (type) {
    case "create":
      newGroupSession.value.openCreateGroupSession();
      break;
    case "related":
      newCustomGroup.value.openCustomGroupModal();
      break;
  }
};
// 返回上一步,返回第二步重新选择类型
const handleCreateGroupPrev = () => {
  newChatRef.value.openChatModal();
};
// 获取群聊创建后的返回数据,进入第三步
const handleCurrent = (data) => {
  currentNewData.value.item = data;
  currentNewData.value.type = "group";
  newClassRef.value.openClassModal();
};
// 获取群聊选择后的回调数据,进入第三步
const handleCustomGroupNext = (data) => {
  currentNewData.value.item = data;
  currentNewData.value.type = "group";
  newClassRef.value.openClassModal();
};
/**链接模块进入下一步**/
const handleLinkNext = (data) => {
  currentNewData.value.item = data;
  currentNewData.value.type = "link";
  newClassRef.value.openClassModal();
};


onMounted(() => {});

defineExpose({
  openNewAppFirstStep,
});
</script>

<template>
  <!-- 添加社群新应用组件(带有频道列表分类) 开始 -->
  <!-- 第一步 -->
  <AddNewApp ref="newAppRef" @next="handleFirstStep" />
  <!-- 第二步 -->
  <!-- 社区版块 -->
  <AddNewForum
    ref="newForumRef"
    @prev="handleForumPrev"
    @next="handleForumSecondaryNext"
  />
  <!-- 链接 -->
  <AddCategoryLink
    ref="newLinkRef"
    @prev="handleForumPrev"
    @next="handleLinkNext"
  />
  <!-- 群聊 -->
  <AddNewAppChat
    ref="newChatRef"
    @prev="handleForumPrev"
    @next="handleGroupNext"
  />
  <!-- 创建群聊流程 -->
  <CreateGroupSession
    ref="newGroupSession"
    @prev="handleCreateGroupPrev"
    @handleCurrentGroup="handleCurrent"
  />
  <!-- 选择群聊流程 -->
  <AddCustomGroup
    ref="newCustomGroup"
    @prev="handleCreateGroupPrev"
    @next="handleCustomGroupNext"
  />

  <!-- 第三步 -->
  <CategoryClass
    ref="newClassRef"
    @prev="handleFirstStep"
    :currentItem="currentNewData"
  />
</template>

<style lang="scss" scoped>
</style>