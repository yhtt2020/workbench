<!-- 添加新应用群聊 -->
<script setup>
import { ref } from "vue";

const emit = defineEmits(["prev", "next"]);

const list = ref([
  {
    title: "创建新群聊",
    summary: "选择你的联系人，创建一个新的群聊关联到社群中。",
    type: "create",
  },
  {
    title: "添加已有群聊",
    summary: "选择你已经创建的群聊，将他们批量关联到社群中。",
    type: "related",
  },
]);
const currentChat = ref({
  listIndex: "create",
  chatShow: false,
});

const chatVisible = ref(false);
const openChatModal = () => {
  chatVisible.value = true;
};

// 返回上一步
const returnPreviousStep = () => {
  chatVisible.value = false;
  emit("prev");
};
// 下一步
const nextClass = () => {
  chatVisible.value = false;
  emit("next",currentChat.value.listIndex);
};

// 选择加入方式
const selectChannel = (item) => {
  currentChat.value.listIndex = item.type;
};

defineExpose({
  openChatModal,
});
</script>

<template>
  <xt-modal v-if="chatVisible" v-model="chatVisible" custom>
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
        <span class="xt-text xt-font font-16">添加群聊</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="chatVisible = false"
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

      <div class="px-2 flex-col my-4">
        <template v-for="item in list">
          <div
            class="flex flex-col xt-bg-2 p-4 mb-4 rounded-lg pointer"
            :class="{ 'select-bg': currentChat.listIndex === item.type }"
            @click="selectChannel(item)"
          >
            <span class="font-16 xt-text xt-font mb-2.5">{{ item.title }}</span>
            <span class="font-14 xt-text-2 xt-font">{{ item.summary }}</span>
          </div>
        </template>
      </div>

      <div class="flex items-center justify-end" style="height: 40px">
        <xt-button
          w="64"
          h="40"
          class="category-button mr-3"
          @click="chatVisible = false"
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

<style lang="scss" scoped>
.select-bg {
  background: var(--active-secondary-bg) !important;
  border: 1px solid var(--active-bg) !important;
}
</style>