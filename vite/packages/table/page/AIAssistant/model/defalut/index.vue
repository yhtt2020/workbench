<template>
  <div class="flex flex-col h-full">
    <div
      class="flex-grow h-full b-4"
      style="margin-bottom: 50px; border: 1px solid red"
    >
      <template v-for="data in dafalutData">
        <div class="text-base mt-4">{{ data.name }}</div>
        <div class="flex flex-wrap">
          <template v-for="item in data.children">
            <div
              @click="useModel"
              style="height: 150px; width: 280px"
              class="mt-4 mr-4 xt-bg-2 rounded-xl flex justify-center items-center flex-col p-8 cursor-pointer"
            >
              <div class="text-base mb-3">{{ item.name }}</div>
              <div class="text-sm xt-text-2">{{ item.value }}</div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { dafalutData } from "./dafalutData";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isModel"]),
  },
  data() {
    return {
      dafalutData,
    };
  },
  computed: {},
  methods: {
    useModel() {
      console.log("isModel :>> ", this.isModel);
      this.isModel = !this.isModel;
    },
  },
};
</script>

<style lang="scss" scoped></style>
