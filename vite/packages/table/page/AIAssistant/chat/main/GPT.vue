<template>
  <div class="markdown-body" v-html="htmlContent"></div>
</template>

<script setup>
import { computed } from "vue";
// @import url(github-markdown-css/github-markdown-dark.css);
import "github-markdown-css/github-markdown-light.css";
import { marked } from "marked";

import hljs from "highlight.js";
import "highlight.js/styles/github.css";

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

/**
 * 配置代码高亮
 */
marked.setOptions({
  highlight: (code, lang) => {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    } catch (error) {
      console.warn("error :>> ", error);
    }
  },
  gfmtrue: true,
  breaks: true,
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
.markdown-body {
  background: none;
  user-select: text;
}
</style>
