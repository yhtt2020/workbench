<!-- 网页端链接下载按钮 -->
<template>
  <xt-button
    @click="downloadFile"
    w="32"
    h="32"
    class="xt-bg-t-3 mr-3"
    :radius="8"
  >
    <slot name="a-button"></slot>
  </xt-button>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { fileExtension } from "./fileType";

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
});

const { url } = toRefs(props);

const downloadFile = () => {
  const content = url.value;
  const newContentUrl = content.split("?")[0];
  // 获取文件
  const file = newContentUrl?.split("/")[newContentUrl?.split("/")?.length - 1];
  // 进行转换
  const blob = new Blob([content], { type: "text/plain" });
  const newUrl = window.URL.createObjectURL(blob);
  // 创建一个a元素进行操作
  const a = document.createElement("a");
  a.href = newUrl;
  a.download = file;
  a.click();
  window.URL.revokeObjectURL(newUrl);
};
</script>

<style scoped>
</style>
