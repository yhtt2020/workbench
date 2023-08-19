<template>
  <div class="flex h-full w-full rounded-xl flex-col">
    <div class="flex h-full">
      <div class="h-full flex flex-col">
        <Topic
          class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
        ></Topic>
      </div>
      <div class="h-full w-full flex flex-col p-1">
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script>
import Topic from "./topic/index.vue";
import Main from "./main/index.vue";
import { test, gpt3 } from "../service/api/ai";

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
  async mounted() {
    // let res = await test();
    // console.log("res :>> ", res);
    // let data = await gpt3([{ role: "user", content: "Hello!" }]);
    // console.log('data :>> ', data);
  },
};
</script>

<style lang="scss" scoped></style>
