<template>
  <!-- 动态头部 -->
  <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 70px">
    <xt-icon
      class="mb-3"
      v-for="item in list.slice(0, last)"
      v-bind="config"
      :icon="item.icon"
      @click="iconClick(item)"
      :class="{
        box: item.icon == currentIndex,
      }"
    ></xt-icon>

    <!-- 动态适中 -->
    <div
      class="xt-scrollbar   xt-container  h-full xt-bt py-3 xt-bm flex flex-col items-center"
    >
      <xt-icon
        v-for="item in list.slice(last, -1 * end)"
        v-bind="config"
        class="mb-3"
        :icon="item.icon"
        @click="iconClick(item)"
        :class="{
          box: item.icon == currentIndex,
        }"
      ></xt-icon>
    </div>
    <!-- 底部循环 -->
    <xt-icon
    class="mt-3"
      v-for="item in list.slice(-1 * end)"
      v-bind="config"
      :icon="item.icon"
      @click="iconClick(item, true)"
    >
    </xt-icon>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  config: {
    default: () => {
      return {
        w: "40",
        size: "18",
      };
    },
  },
  last: {
    default: 1,
  },
  end: {
    default: 1,
  },
  modelValue: {},
  list: {
    default: () => {
      return [
        {
          icon: "message",
        },
        {
          icon: "star",
        },
        {
          icon: "smile",
        },
        {
          icon: "aixin",
        },
        {
          icon: "yanjing",
        },

        // ----------
        {
          icon: "smile",
        },
        {
          icon: "aixin",
        },
        {
          icon: "yanjing",
        },
        {
          icon: "smile",
        },
        {
          icon: "aixin",
        },
        {
          icon: "yanjing",
        },
        // -----------
        {
          icon: "shezhi1",
        },
      ];
    },
  },
});
const currentIndex = ref(props.list[0].icon);

const iconClick = (item, flag) => {
  if (!flag) currentIndex.value = item.icon;
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped>
.box {
  border: 4px solid var(--active-bg) !important;
  border-radius: 12px;
}
</style>
