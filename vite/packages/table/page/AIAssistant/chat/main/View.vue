<template>
  <div class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar mt-3 w-full" ref="contentRef" @scroll="handleScroll">
    <slot name="chat"></slot>
  </div>
  <div class="pt-1">
    <!-- {{ isAtBottom }}--{{ shouldScrollToBottom }} -->
    <slot name="text"></slot>
  </div>
</template>  
  
<script setup>
import { ref, watch, nextTick } from "vue";
import { aiStore } from "../../../../store/ai";
const store = aiStore();

const contentRef = ref(null);

const shouldScrollToBottom = ref(true); // 添加一个标志变量，初始值为 true  
const isAtBottom = ref(true);

const props = defineProps({
  data: {
    type: Array,
  },
  height: {
    type: Number,
  },
});

function handleScroll() {
  const content = contentRef.value;
  const scrollHeight = content.scrollHeight;
  const clientHeight = content.clientHeight;
  const scrollTop = content.scrollTop;

  // 定义一个阈值，以确定页面是否在底部  
  const threshold = 10; // 调整此值以满足您的需求  

  // 如果滚动位置接近内容底部，表示页面在底部  
  isAtBottom.value = scrollHeight - scrollTop - clientHeight <= threshold;

  // 根据滚动位置是否在底部来更新标志变量  
  shouldScrollToBottom.value = isAtBottom.value;
}

// 首次加载定位到底部  
watch(() => store.selectTopicIndex, (newV) => {
  nextTick(() => {
    setTimeout(() => {
      const content = contentRef.value;
      content.scrollTo(0, content.scrollHeight);
    }, 100)
  })
}, {
  immediate: true
});
// 滚动操作
watch(() => props.data, (newV) => {
  // if (shouldScrollToBottom.value) { // 只有当标志变量为 true 时才触发滚动  
  //   const content = contentRef.value;
  //   content.scrollTo(0, content.scrollHeight);
  // }
}, {
  deep: true
});

</script>