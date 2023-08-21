<template>
  <!-- <div class="markdown-body" v-html="htmlContent"></div> -->
  <MdPreview :showCodeRowNumber="true" :modelValue="htmlContent" theme="dark" />
</template>

<script setup>
import { computed } from "vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
// import url(github-markdown-css/github-markdown-dark.css);
import { marked } from "marked";

import DOMPurify from "dompurify";

const props = defineProps({
  // Markdown 文本数据
  content: {
    type: String,
    default: "",
  },
  // 跟随光标
  showCursor: {
    type: Boolean,
    default: false,
  },
});

// 最终要显示的 html 文本
const htmlContent = computed(() => {
  // 转换为 html 文本
  const html = marked.parse(props.content);
  // 清理和过滤 HTML
  return DOMPurify.sanitize(html);
});
</script>

<style lang="scss" scoped>
#md-editor-v3 {
  background: none;
  user-select: text;
  .md-editor-preview-wrapper {
    padding: 12px !important;
  }
}

:deep(.md-editor-preview-wrapper) {
  padding: 12px !important;
}

:deep(.default-theme p) {
  margin: 0;
  padding: 0;
}
</style>
