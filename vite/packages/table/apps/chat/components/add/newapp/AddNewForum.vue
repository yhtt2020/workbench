<!-- 添加新应用的社群版块详情页 -->
<template>
  <xt-modal v-if="forumVisible" v-model="forumVisible" custom>
    <div class="flex flex-col p-4" style="width: 500px">
      <div class="w-full flex items-center justify-between">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">选择社区版块</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="forumVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>

      <span class="xt-text xt-font font-16 my-4">
        我创建的版块({{ forumList.length }})
      </span>

      <!-- 空状态 -->
      <template v-if="forumList.length === 0">
        <EmptyStatus />
      </template>

      <xt-scrollbar :y="true" style="height: 300px">
        <template v-for="(item, index) in forumList">
          <div
            class="flex items-center mb-3 pointer p-5 rounded-lg xt-bg-2"
            :class="{ 'select-bg': currentForum.selectIndex === index }"
            @click="selectForum(index, item)"
          >
            <a-avatar :size="40" shape="square" :src="item.logo"></a-avatar>
            <span class="font-16 ml-3 xt-text">{{ item.name }}</span>
          </div>
        </template>
      </xt-scrollbar>

      <div class="mt-4 flex items-center justify-end" style="height: 40px">
        <xt-button
          w="64"
          h="40"
          class="category-button mr-3"
          @click="forumVisible = false"
        >
          取消
        </xt-button>
        <xt-button
          w="64"
          h="40"
          class="category-button"
          type="theme"
          @click="nextClass"
        >
          选择
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, toRefs, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { forumStore } from "../../../store/forumStore";
import EmptyStatus from "../../../page/empty/EmptyStatus.vue";
const emit = defineEmits(["prev", "next"]);
const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);
const forum = forumStore();
const { forumList } = storeToRefs(forum);
const currentForum = ref({
  selectIndex: -1,
  item: null,
});
// 开启社区版块选择弹窗
const forumVisible = ref(false);
const openForumModal = () => {
  forumVisible.value = true;
  nextTick(() => {
    forum.getForumData();
  });
};
// 选择社区版块
const selectForum = (index, item) => {
  if (currentForum.value.selectIndex === index) {
    currentForum.value.selectIndex = -1;
    currentForum.value.item = null;
  } else {
    currentForum.value.selectIndex = index;
    currentForum.value.item = item;
  }
};
// 返回上一步
const returnPreviousStep = () => {
  emit("prev");
  forumVisible.value = false;
};
// 下一步
const nextClass = () => {
  if (currentForum.value.selectIndex === -1) {
    return;
  } else {
    emit("next", currentForum.value);
    forumVisible.value = false;
  }
};
defineExpose({
  openForumModal,
});
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
</style>