<template>
  <!-- <div class="markdown-body" v-html="htmlContent"></div> -->
  <MdPreview
    :showCodeRowNumber="true"
    :modelValue="content"
    :theme="theme"
    :previewTheme="previewTheme"
    :codeTheme="codeTheme"
  />
</template>

<script setup>
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";


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
const theme = "dark";
const previewTheme = "default";
const codeTheme = "github";

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
