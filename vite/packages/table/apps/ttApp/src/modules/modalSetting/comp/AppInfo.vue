<script setup lang="ts">
import { inject, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTTAppStore } from "../../../store";
const ttappStore = useTTAppStore();
const { modal } = storeToRefs(ttappStore);

const data = inject("data");
</script>

<template>
  <xt-option-box>
    <div class="flex text-sm mb-4">
      <div>
        <a-avatar shape="square" :size="48" :src="data?._logo" />
      </div>
      <div class="ml-4">
        <div class="">{{ data?.name }}</div>
        <div class="tt-text-2 mt-1">{{ data?.description }}</div>
      </div>
    </div>
  </xt-option-box>

  <xt-option-box>
    <div class="flex text-sm mb-4">
      <div>
        <a-avatar shape="circular" :size="48" :src="modal.userInfo?.avatar" />
      </div>
      <div class="ml-4">
        <div class="">{{ modal.userInfo?.name }}</div>
        <div class="tt-text-2 mt-1">开发者</div>
      </div>
    </div>
  </xt-option-box>

  <xt-option-box>
    <div class="flex text-sm mb-4 justify-between">
      <div>版本</div>
      <div class="tt-text-2">{{ data?.version }}</div>
    </div>
    <template v-if="data.projectUrl">
      <hr />

      <div class="flex text-sm mb-4 justify-between">
        <div>官网</div>
        <div class="tt-link">立即访问</div>
      </div>
    </template>
  </xt-option-box>
  <xt-option-box v-if="data.socializeList.length">
    <template v-for="(item, index) in data.socializeList">
      <div class="flex text-sm mb-4 justify-between">
        <div>{{ data?.typeName }}</div>
        <div class="tt-text-2">{{ data?.name }}</div>
      </div>
      <hr v-if="index !== data.socializeList.length - 1" />
    </template>
  </xt-option-box>
</template>
<style lang="scss" scoped></style>
