<template>
  <div
    class="xt-text flex h-full"
    style="box-sizing: border-box"
    :class="[typeClass]"
  >
    <!-- 左侧区域开始 -->
    <div
      class="flex flex-col items-center h-full xt-br mr-3"
      style="width: 72px; min-width: 72px"
    >
      <!-- 头部 -->
      <div>
        <Float
          @itemClick="itemClick"
          :list="item.children"
          v-for="item in newList.slice(0, last)"
          :data="item"
        >
          <Box :item="item" :id="currentIndex" class="mb-2" :model="model">
            <Item :item="item">
              <template #[item.slot]>
                <slot :name="item.slot"></slot>
              </template>
            </Item>
          </Box>
          <template #content> <slot :name="item.float"> </slot> </template>
        </Float>
      </div>
      <!-- 中间 -->
      <div
        class="xt-scrollbar xt-container xt-bt flex flex-col items-center flex-1"
      >
        <Float
          @itemClick="itemClick"
          :list="item.children"
          v-for="item in newList.slice(last, -1 * end)"
          :data="item"
        >
          <Box :item="item" :id="currentIndex" class="mt-2" :model="model">
            <Item :item="item" w="40">
              <template #[item.slot]>
                <slot :name="item.slot"></slot>
              </template>
            </Item>
          </Box>
          <template #content> <slot :name="item.float"> </slot> </template>
        </Float>
      </div>
      <!-- 底部 -->
      <div>
        <Float
          @itemClick="itemClick"
          :list="item.children"
          v-for="item in newList.slice(-1 * end)"
          :data="item"
        >
          <Box :item="item" :id="currentIndex" class="mt-2" :model="model">
            <Item :item="item" type="" newType="" bg="">
              <template #[item.slot]>
                <slot :name="item.slot"></slot>
              </template>
            </Item>
          </Box>
          <template #content> <slot :name="item.float"> </slot> </template>
        </Float>
      </div>
    </div>
    <!-- 左侧区域结束 -->
    <!-- 主体区域开始 -->
    <div class="  flex h-full flex-1 w-0">
      <slot></slot>
    </div>
    <!-- 主体区域结束 -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Float from "./Float.vue";
import Box from "./Box.vue";
import Item from "./Item.vue";
import { nanoid } from "nanoid";

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
  index: { default: false },
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
        {
          icon: "shezhi1",
        },
        {
          full: true,
        },
      ];
    },
  },
  model: {
    default: "router",
  },
});
const full = ref(false);
const isFull = ref(false);
const typeClass = computed(() => {
  if (full.value) {
    return isFull.value
      ? " fixed left-0 right-0 top-0 bottom-0 xt-bg pr-3 py-3 "
      : "xt-bg pr-3 py-3 rounded-xl";
  }
});
// 动态添加ID
const newList = computed(() => {
  let index = -1;
  let res = props.list.map((item) => {
    if (item.full) full.value = true;
    // let id = item.id ?? nanoid(4);
    let id = item.id ?? ++index;
    return {
      id,
      ...item,
    };
  });
  return res;
});

// 动态获取ID
const index = computed(() => {
  return isNaN(props.index.value) ? newList.value[0].id : props.index.value;
});

// 选择ID
const currentIndex = ref(index.value);

//选中事件
const emit = defineEmits(["modelValue", "index"]);
const selectClick = (id, flag) => {
  emit("update:index", id);
  if (flag) return;
  currentIndex.value = id;
};

// 点击事件
const itemClick = (item) => {
  if (item?.full) {
    isFull.value = !isFull.value;
    return;
  } else if (item?.children) {
    return;
  }
  selectClick(item.id, item.flag);
  emit("update:modelValue", item);
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped></style>
