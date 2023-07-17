<template>
  <div class="p-1">
    <template v-for="item in chatList" :key="item.id">
      <div v-if="item.type === 'user'" class="flex justify-end">
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 overflow-wrap break-word xt-bg-2 rounded-xl"
          style="max-width: 80%"
          v-html="item.content"
        ></div>
        <div @click="copy(item)">复制</div>
      </div>
      <div v-else>
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 xt-bg-2 rounded-xl"
          style="max-width: 80%"
        >
          <GPT :content="item.content"></GPT>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import GPT from "./GPT.vue";
const props = defineProps({
  chatList: {
    type: Array,
  },
});

const copy = (str) => {
  navigator.clipboard
    .writeText(str)
    .then(() => {
      console.log("文本已复制到剪贴板");
    })
    .catch((error) => {
      console.error("无法复制文本:", error);
    });
};
</script>

<style lang="scss" scoped></style>
