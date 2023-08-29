<template>
  <!-- 动态头部 -->
  <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 70px">
    <template v-for="item in list.slice(0, last)">
      <slot :name="item.slot" v-if="item.slot"> </slot>
      <Item @itemClick="iconClick" :item="item">
        <template #default>
          <slot :name="item.slot">{{ item.slot }} </slot>
        </template>
      </Item>
    </template>

    <!-- 动态适中 -->
    <div
      class="xt-scrollbar xt-container h-full xt-bt py-3 xt-bm flex flex-col items-center mb-3"
    >
      <template v-for="item in list.slice(last, -1 * end)">
        <slot :name="item.slot" v-if="item.slot"> </slot>
        <Item @itemClick="iconClick" :item="item">
          <template #default>
            <slot :name="item.slot"> </slot>
          </template>
        </Item>
      </template>
    </div>
    <!-- 底部循环 -->

    <template v-for="item in list.slice(-1 * end)">
      <Item @itemClick="iconClick" :item="item">
        <template #default>
          <slot :name="item.slot"> </slot>
        </template>
      </Item>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Item from "./Item.vue";
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
          img: "/icons/bg.png",
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
