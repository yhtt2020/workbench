<template>
  <!-- 动态头部 -->
  <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 86px">
    <template v-for="item in newList.slice(0, last)">
      <div @click="iconSelectClick(item.id)">
        <slot :name="item.slot" v-if="item.slot"> </slot>
        <Item :item="item" :id="currentIndex">
          <template #default>
            <slot :name="item.slot">{{ item.slot }} </slot>
          </template>
        </Item>
      </div>
    </template>

    <!-- 动态适中 -->
    <div
      class="xt-scrollbar xt-container h-full xt-bt py-3 xt-bm flex flex-col items-center"
    >
      <template v-for="item in newList.slice(last, -1 * end)">
        <div @click="iconSelectClick(item.id)">
          <slot :name="item.slot" v-if="item.slot"> </slot>
          <Item :item="item" :id="currentIndex">
            <template #default>
              <slot :name="item.slot">{{ item.slot }} </slot>
            </template>
          </Item>
        </div>
      </template>
    </div>
    <!-- 底部循环 -->

    <template v-for="item in newList.slice(-1 * end)">
      <div @click="iconSelectClick(item.id, item.flag)">
        <slot :name="item.slot" v-if="item.slot"> </slot>
        <Item :item="item" :id="currentIndex" m="mt">
          <template #default>
            <slot :name="item.slot">{{ item.slot }} </slot>
          </template>
        </Item>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
  index: {
    default: 0,
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
const newList = computed(() => {
  let id = -1;
  let res = props.list.map((item) => {
    id++;
    return {
      id,
      ...item,
    };
  });
  return res;
});
const currentIndex = ref(props.index);
const iconSelectClick = (id, flag) => {
  if (flag) return;
  currentIndex.value = id;
};
</script>

<style lang="scss" scoped>
.box {
  border: 4px solid var(--active-bg) !important;
  border-radius: 12px;
}
</style>
