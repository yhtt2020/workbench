<template>
  <div class="w-full flex justify-between items-center">
    <div class="flex">
      <a-input
        class="h-8 xt-mask xt-text"
        style="
          width: 215px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        "
        placeholder="搜索"
        :maxlength="10"
        :allow-clear="false"
        v-model:value="keyWord"
        @change="changeSearchValue"
      >
        <template #suffix>
          <xt-ify-icon
            v-if="keyWord === ''"
            class="absolute right-3 xt-text-2"
            icon="fluent:search-20-filled"
            size="20"
            @click="changeSearchValue"
          />
          <xt-ify-icon
            v-else
            icon="fluent:dismiss-16-regular"
            size="16"
            class="absolute right-3 xt-text-2"
            @click="keyWord = ''"
          ></xt-ify-icon>
        </template>
      </a-input>
    </div>

    <xt-button w="32" h="32" style="border-radius: 8px;" @click="close">
      <div class="flex items-center justify-center">
        <xt-ify-icon icon="fluent:dismiss-16-regular" size="20" />
      </div>
    </xt-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(["close"]);

const keyWord = ref("");

const close = () => {
 emit("close");
};

// 搜索事件
const changeSearchValue = () => {
 // keyWord.value = e.target.value;
};
</script>

<style lang="scss" scoped>

</style>