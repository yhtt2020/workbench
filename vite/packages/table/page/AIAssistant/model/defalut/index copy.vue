<template>
  <div class="flex flex-col h-full">
    {{ isModel }}
    <div
      class="flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
      style="margin-bottom: 50px"
    >
      <template v-for="data in dafalutData">
        <div class="text-base mt-4">{{ data.name }}</div>
        <div class="flex flex-wrap">
          <template v-for="item in data.children">
            <div
              @click="useModel()"
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
    ...mapWritableState(aiStore, ["isModel", "isFull"]),
  },
  data() {
    return {
      dafalutData,
    };
  },
  computed: {},
  methods: {
    useModel() {
      console.log("1 :>> ", this.isModel);
      this.isModel = true;
      this.isFull = true;
      console.log('this.isFull :>> ', this.isFull);
    },
  },
};
</script>

<style lang="scss" scoped></style>
