<template>
  <div class="flex flex-col h-full">
    <div
      class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
      style="margin-bottom: 50px"
    >
      <div class="flex flex-wrap">
        {{ isModel }}
        <template v-for="item in userData">
          <div
            @click="isModel = true"
            style="height: 150px; width: 280px"
            class="mt-4 mr-4 xt-bg-2 rounded-xl flex justify-center items-center flex-col p-8 cursor-pointer"
          >
            <div class="text-base mb-3">{{ item.name }}</div>
            <div class="text-sm xt-text-2">{{ item.value }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { userData } from "./userData";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isModel"]),
  },
  data() {
    return {
      userData,
    };
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
