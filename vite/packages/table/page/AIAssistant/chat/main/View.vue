<template>
  <!-- <div class="w-full flex flex-col flex-grow xt-b"> -->
    <div
      class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar mt-3 w-full"
      ref="contentRef"
      @scroll="handleScroll"
    >
      <slot name="chat"></slot>
    </div>
    <div class="pt-1">
      <slot name="text"></slot>
    </div>
  <!-- </div> -->
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

const contentRef = ref(null);
const shouldScrollToBottom = ref(true); // 是否应该滚动到底部

const props = defineProps({
  data: {
    type: Array,
  },
  height: {
    type: Number,
  },
});

// 监听 chatList 的变化
watch(
  () => props.data,
  () => {
    // nextTick(() => {
    //   if (shouldScrollToBottom.value) {
    //     toBottom();
    //   }
    // });
  },
  { deep: true }
);

function toBottom(i = 20) {
  const content = contentRef.value;
  const scrollHeight = content?.scrollHeight;
  const clientHeight = content?.clientHeight;
  const height = scrollHeight - clientHeight;
  content.scrollTop += i;

  let c;
  if (content.scrollTop < height) {
    c = setTimeout(() => toBottom(i), 16);
  } else {
    clearTimeout(c);
  }
}

function handleScroll() {
  const content = contentRef.value;
  const isAtBottom =
    content.scrollTop >= content.scrollHeight - content.clientHeight;
  shouldScrollToBottom.value = isAtBottom;
}
</script>

<style lang="scss" scoped></style>
