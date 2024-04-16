<!-- 添加新应用 -->
<script setup>
import { ref } from "vue";

/**第一步弹窗组件**/
import AddNewApp from "../../components/add/AddNewApp.vue";
/**第二步弹窗组件**/
/**社区版块**/
import AddNewForum from "../../components/add/newapp/AddNewForum.vue";
/**链接**/
import AddCategoryLink from "../../components/link/AddCategoryLink.vue";

const newAppRef = ref(null);
const newForumRef = ref(null);
const newLinkRef = ref(null);

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
    case 'chat':
      
      break;
  }
};

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
  <AddCategoryLink ref="newLinkRef" />

  <!-- 群聊 -->
</template>

<style lang="scss" scoped>
</style>