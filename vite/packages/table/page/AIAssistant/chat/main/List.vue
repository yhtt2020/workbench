<template>
  <div class="p-1">
    <template v-for="item in chatList" :key="item.id">
      <div v-if="item.type === 'user'" class="flex justify-end">
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 overflow-wrap break-word xt-bg-2 rounded-xl"
          style="max-width: 80%"
          v-html="item.content"
        ></div>
        <div @click="copy(item.content)">复制</div>
      </div>
      <div v-else>
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 xt-bg-2 rounded-xl"
          style="max-width: 80%"
        >
          <GPT :content="item.content"></GPT>
        </div>
        <div @click="copy(item.content)">复制</div>
      </div>
    </template>
  </div>
</template>
<script>

import GPT from "./GPT.vue";
export default {
  components: {
    GPT,
  },
  methods: {
    copyToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;

      // 将 textarea 元素添加到 DOM 树中，以便可以执行复制操作
      document.body.appendChild(textarea);

      // 选择文本并执行复制操作
      textarea.select();
      const copySuccessful = document.execCommand("copy");

      // 清理创建的 textarea 元素
      document.body.removeChild(textarea);

      return copySuccessful;
    },
    copy(str) {
      console.log("str :>> ", str);
      if (this.copyToClipboard(str)) {
        console.log("已成功复制到剪贴板");
      } else {
        console.error("复制到剪贴板失败");
      }
    },
  },
  props: {
    chatList: {
      type: Array,
    },
  },
};
</script>

<style lang="scss" scoped></style>
