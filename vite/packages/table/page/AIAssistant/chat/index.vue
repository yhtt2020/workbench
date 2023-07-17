<template>
  <div class="flex h-full w-full rounded-xl flex-col">
    <div class="flex h-full">
      <div class="h-full flex flex-col" style="border: 1px solid red">
        <Topic
          class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
        ></Topic>
      </div>
      <div class="h-full w-full flex flex-col" style="border: 1px solid red">
        <Main></Main>
        <!-- <div
          style="background-color: lightblue"
          class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
          ref="contentRef"
          @scroll="handleScroll"
        >
          <slot name="chat"></slot>
        </div>
        <Text isSearch="true"></Text> -->
      </div>
    </div>
  </div>
</template>

<script>
// import Topic from "./topic.vue";
import Topic from "./topic/index.vue";
import Main from "./main/index.vue";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: {
    Topic,
    Main,
  },
};
</script>

<style lang="scss" scoped></style>
