<template>
  <div class="p-1">
    <template v-for="item in chatList" :key="item.id">
      <div v-if="item.type === 'user'" class="flex justify-end">
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 overflow-wrap break-word xt-bg-2 rounded-xl"
          style="max-width: 80%"
          v-html="item.content"
        ></div>
      </div>
      <div v-else>
        <div
          class="inline-block bg-red-200 p-2 text-base mb-2 xt-bg-2 rounded-xl"
          style="max-width: 80%"
        >
          <ChatGPT :content="item.content"></ChatGPT>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import ChatGPT from "./ChatGPT.vue";
const props = defineProps({
  chatList: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped></style>
