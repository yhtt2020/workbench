<template>
  <div class="flex flex-wrap" style="align-content: flex-start">
    <template v-for="item in userData">
      <div
        @click="useDome()"
        style="height: 150px; width: 280px"
        class="mt-4 mr-4 xt-bg-2 rounded-xl flex justify-center items-center flex-col p-8 cursor-pointer"
      >
        <div class="text-base mb-3">{{ item.name }}</div>
        <div class="text-sm xt-text-2">{{ item.value }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import { userData } from "./userData";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isMode"]),
  },
  data() {
    return {
      userData,
    };
  },
  methods: {
    useDome() {
      this.isMode = !this.isMode;
    },
  },
};
</script>

<style lang="scss" scoped></style>
