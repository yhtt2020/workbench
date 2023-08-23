<template>
  <div class="pl-2">
    <template v-for="item in chatList" :key="item.id">
      <div class="flex justify-end mb-3" v-if="item.role === 'user'">
        <div class="flex flex-col">
          <div class="block text-base xt-bg-2 rounded-xl ml-10">
            <GPT :content="item.content"></GPT>
          </div>
          <div class="flex justify-end items-center cursor-pointer my-1">
            <xt-button
              type=""
              icon="fuzhi"
              h="16"
              w="60"
              size="mini"
              @click="copy(item.content)"
              class="xt-text-2"
              >复制
            </xt-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="inline-block text-base mb-2 xt-bg-2 rounded-xl mr-10">
          <GPT :content="item.content"></GPT>
        </div>
        <xt-button
          type=""
          icon="fuzhi"
          h="16"
          w="60"
          size="mini"
          @click="copy(item.content)"
          class="xt-text-2"
          >复制
        </xt-button>
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
      if (this.copyToClipboard(str)) {
        console.log("已成功复制到剪切板");
      } else {
        console.error("复制到剪切板失败");
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
