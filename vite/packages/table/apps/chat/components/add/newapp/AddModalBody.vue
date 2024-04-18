<!-- 添加新应用组件 第一个步骤的body页面 -->
<template>
  <div class="flex flex-col" style="width: 500px">
    <div class="flex flex-col px-2">
      <div class="p-4 flex rounded-lg flex-col xt-bg-2">
        <span class="font-16 font-400 mb-2.5 xt-text">选择类型</span>
        <span class="font-14 font-400 xt-text-2">
          你可以选择添加桌面，关联工作台内部的社区，也可以选择关联你的群聊，还支持自定义添加网页应用链接，把需要的资源全部整合到社群当中，与你的小伙伴们一起分享和协作。
        </span>
      </div>

      <div class="flex flex-col mt-4">
        <div
          v-for="item in channelList"
          class="flex items-center pointer rounded-lg px-6 py-5 mb-4"
          style="background: var(--secondary-bg)"
          :class="{ 'select-bg': currentItem.selectIndex === item.type }"
          @click="selectChannel(item)"
        >
          <xt-ify-icon :icon="item.icon" size="24" />
          <span class="pl-4 font-16 font-400 xt-text">{{ item.name }}</span>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <xt-button
          w="64"
          h="40"
          class="category-button mr-3"
          @click="closeModal"
        >
          取消
        </xt-button>
        <xt-button
          w="64"
          h="40"
          class="category-button"
          type="theme"
          @click="selectSubmit"
        >
          选择
        </xt-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);
const channelList = ref([
  // 后期再补上
  // { icon: "fluent-emoji-flat:desktop-computer", name: "桌面", type: "desk" },
  { icon: "fluent-emoji-flat:placard", name: "社区", type: "forum" },
  { icon: "fluent-emoji-flat:thought-balloon", name: "群聊", type: "group" },
  {
    icon: "fluent-emoji-flat:globe-with-meridians",
    name: "网页链接",
    type: "link",
  },
]);
const currentItem = ref({
  selectIndex: "forum",
  type: null,
});
// 关闭弹窗
const closeModal = () => {
  emit("close");
};
// 选择频道
const selectChannel = (item) => {
  currentItem.value.selectIndex = item.type;
  currentItem.value.type = item.type;
};
// 选择提交
const selectSubmit = () => {
  emit("enterNext", {type:currentItem.value.selectIndex,});
};
</script>

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
</style>