<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { highLightKeywords } from "../../utils";
import Scrollbar from "./Scrollbar.vue";
const words = inject("words");
const isWebSource = inject("isWebSource");
const currentSource = inject("currentSource");

const systemList = ref([
  {
    name: "全部",
  },
  {
    name: "收藏",
  },
  {
    name: "应用",
  },
  {
    name: "备忘录",
  },
  {
    name: "待办",
  },
  {
    name: "剪切板",
  },
  {
    name: "社群",
  },
  {
    name: "系统",
  },
]);
</script>

<template>
  <xt-scrollbar
    :x="true"
    style="border-bottom: 1px solid var(--tt-primary-border-color)"
    class="w-full relative flex overflow-hidden tab-container flex-nowrap whitespace-nowrap mb-1"
  >
    <div
      v-for="item in systemList"
      :style="[
        {
          'border-bottom':
            currentSource.name == item.name
              ? '2px solid var(--tt-theme-color)'
              : '2px solid var(--modal-bg)',
        },
      ]"
      class="p-3 inline-flex items-center cursor-pointer"
    >
      <span class="">{{ item.name }}</span>
    </div>
  </xt-scrollbar>

  <Scrollbar
  >
    123321
  </Scrollbar>
</template>

<style lang="scss" scoped></style>
