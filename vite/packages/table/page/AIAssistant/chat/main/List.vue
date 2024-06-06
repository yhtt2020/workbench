<template>
  <div
    class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar mt-3 w-full pl-2 relative"
    ref="contentRef"
    @scroll="handleScroll"
  >
    <template v-for="item in chatList" :key="item.id">
      <div
        class="flex justify-end mb-3 chatBox"
        v-if="item.role === 'user'"
        :data-id="item.id"
      >
        <div class="flex flex-col">
          <div class="flex">
            <div
              class="block text-base xt-bg-2 rounded-xl ml-10 mr-2"
              style="border-radius: 0.75rem"
            >
              <GPT :content="item.content"></GPT>
            </div>
            <img
              :src="img"
              alt=""
              style="width: 32px; height: 32px; border-radius: 50%"
            />
          </div>
          <div class="flex justify-end items-center cursor-pointer my-2">
            <xt-button
              type="2222"
              h="16"
              w="60"
              size="mini"
              :copy="item.content"
              class="xt-text-2"
            >
              <xt-base-icon icon="fuzhi" />
              复制
            </xt-button>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col chatBox" :data-id="item.id">
        <div class="flex">
          <img src="/img/gpt.png" alt="" style="width: 32px; height: 32px" />
          <div class="flex-1 w-0">
            <div
              class="ml-2 inline-block text-base xt-bg-2 rounded-xl mr-10"
              style="max-width: calc(100% - 20px); border-radius: 0.75rem"
            >
              <GPT :content="item.content"></GPT>
            </div>
          </div>
        </div>
        <xt-button
          type=""
          h="16"
          w="60"
          size="mini"
          :copy="item.content"
          class="xt-text-2 my-2"
        >
          <xt-base-icon icon="fuzhi" />
          复制
        </xt-button>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, watch, nextTick, inject } from "vue";
import { storeToRefs } from "pinia";
import GPT from "./GPT.vue";
import { aiStore as useAiStore } from "../../../../store/ai";
const aiStore = useAiStore();
import { appStore } from "../../../../store";
const store = appStore();
const { selectTopicIndex } = storeToRefs(aiStore);
let img = store.userInfo.avatar ? store.userInfo.avatar : "/img/user.png";
const props = defineProps({
  chatList: {
    type: Array,
  },
});
const contentRef = ref(null);
const modalParams = inject("modalParams");

// 首次加载定位到底部
watch(
  () => selectTopicIndex.value,
  (newV) => {
    setTimeout(() => {
      const content = contentRef.value;
      if (modalParams?.chatId) {
        let div = content.querySelectorAll(".chatBox");
        for (let item of div) {
          const dataId = item.getAttribute("data-id");
          if (modalParams?.chatId == dataId) {
            let obj = item.getBoundingClientRect();
            let top = item.offsetTop;
            console.log("obj :>> ", obj);
            console.log("item :>> ", item);
            content.scrollTo(0, top);
          }
        }
      } else {
        content.scrollTo(0, content.scrollHeight);
      }
    }, 100);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped></style>
