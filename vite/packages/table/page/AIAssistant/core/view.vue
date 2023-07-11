<template>
  <div class="h-screen w-full flex flex-col" style="border: 1px solid red">
    <div
      style="background-color: lightblue"
      class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
      ref="contentRef"
      @scroll="handleScroll"
    >
      <slot name="chat"></slot>
    </div>
    <div class="p-1">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";

const contentRef = ref(null);
const shouldScrollToBottom = ref(true); // 是否应该滚动到底部
const userScrolling = ref(false); // 用户是否手动滚动

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
    nextTick(() => {
      if (shouldScrollToBottom.value) {
        toBottom();
      }
    });
  },
  { deep: true }
);

function toBottom(i = 20) {
  if (userScrolling.value) return;
  console.log("1 :>> ", 1);
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

onMounted(() => {
  const content = contentRef.value;

  if (content) {
    content.addEventListener("scroll", () => {
      // userScrolling.value = true
    });

    content.addEventListener("mouseup", () => {
      userScrolling.value = false;
      toBottom();
    });
  }
});
</script>

<style lang="scss" scoped></style>
