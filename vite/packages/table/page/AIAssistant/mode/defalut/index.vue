<template>
  <template v-for="data in dafalutData">
    <div class="text-base mt-4">{{ data.name }}</div>
    <div class="flex flex-wrap">
      <template v-for="item in data.children">
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
</template>

<script>
import { dafalutData } from "./dafalutData";

import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isMode"]),
  },
  data() {
    return {
      dafalutData,
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
