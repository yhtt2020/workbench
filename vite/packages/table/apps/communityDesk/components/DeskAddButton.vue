<!-- 社群桌面空状态的添加按钮 -->
<template>
  <div
    class="flex justify-center w-full mt-6 justify-items-center align-items-center"
  >
    <template v-for="item in buttonList">
      <xt-button
        :w="113"
        :h="40"
        :radius="8"
        class="ml-3 xt-bg-t-2"
        type="primary"
        @click="item.fn"
      >
        <div class="flex items-center">
          <xt-new-icon class="mr-2" size="20" :icon="item.newIcon" />
          <span class="xt-text font-16 xt-font">{{ item.name }}</span>
        </div>
      </xt-button>
    </template>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  buttonList: {
    type: Array,
    default: () => [],
  },
});
const { buttonList } = toRefs(props);
</script>

<style lang="scss" scoped>
</style>