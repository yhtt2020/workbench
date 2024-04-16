<!-- 添加新应用 -->
<script setup>
import { ref, toRefs } from "vue";

/**第一步弹窗组件**/
import AddNewApp from "../../components/add/AddNewApp.vue";
/**第二步弹窗组件**/
/**社区版块**/
import AddNewForum from "../../components/add/newapp/AddNewForum.vue";
/**链接**/
import AddCategoryLink from "../../components/link/AddCategoryLink.vue";
/**群聊**/
import AddNewAppChat from "../../components/add/AddNewAppChat.vue";
/**第三步弹窗组件**/
import CategoryClass from "../../components/add/class/CategoryClass.vue";

const newAppRef = ref(null);
const newForumRef = ref(null);
const newLinkRef = ref(null);
const newChatRef = ref(null);
const newClassRef = ref(null);

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
    case "chat":
      newChatRef.value.openChatModal();
      break;
  }
};
// 第二步进入第三步
// 社区版块
const handleForumSecondaryNext = (data) => {
  console.log("社区版块", data);
  newClassRef.value.openClassModal();
};

// 第三步的组件返回上一步
const handleClassPrev = () => {};

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
  <AddCategoryLink ref="newLinkRef" @prev="handleForumPrev" />
  <!-- 群聊 -->
  <AddNewAppChat ref="newChatRef" @prev="handleForumPrev" />

  <!-- 第三步 -->
  <CategoryClass ref="newClassRef"  @prev="handleClassPrev" />
</template>

<style lang="scss" scoped>
</style>