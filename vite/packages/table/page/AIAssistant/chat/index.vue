<template>
  <div class="flex h-full w-full rounded-xl flex-col">
    <div class="flex h-full">
      <Topic></Topic>
      <div class="h-full w-full flex flex-col" style="border: 1px solid red">
        <div
          style="background-color: lightblue"
          class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
          ref="contentRef"
          @scroll="handleScroll"
        >
          <slot name="chat"></slot>
        </div>
        <Text isSearch="true"></Text>
      </div>
    </div>
  </div>
</template>

<script>
import Text from "../core/Text.vue";
import Topic from "./topic.vue";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: {
    Topic,
    Text,
  },
};
</script>

<style lang="scss" scoped></style>
