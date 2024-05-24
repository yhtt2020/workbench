<script setup lang="ts">
import { ref, computed, inject } from "vue";
const data: any = inject("data");
const selectIndex: any = inject("selectIndex");

const clear = () => {
  data.value.historyList = [];
};
</script>

<template>
  {{ selectIndex }}
  <div class="h-full overflow-hidden flex-col flex">
    <div class="flex justify-between p-2">
      <div class="text-sm tt-text-2">最近</div>
      <xt-mix-icon
        size="20"
        icon="fluent:dismiss-circle-16-filled"
        @click="clear"
      />
    </div>
    <div class="flex-1 overflow-hidden">
      <xt-scrollbar class="h-full" :x="false" :y="true">
        <div
          v-for="(item, index) in data.historyList"
          class="text-sm p-2 w-full h-12 rounded-lg flex items-center justify-between"
          :class="{
            'xt-theme-bg-2': index === selectIndex,
          }"
        >
        {{ index }}
          <div class="flex">
            <xt-mix-icon
              size="24"
              class="mr-3"
              :icon="item.source.icon"
              type="select"
            />
            {{ item.value }}
          </div>
          <div></div>
        </div>
      </xt-scrollbar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
