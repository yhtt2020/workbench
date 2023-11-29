<template>
  <div
    class="xt-text flex h-full xt-bg"
    style="box-sizing: border-box"
    :class="[typeClass]"
  >
    <!-- 左侧区域开始 -->
    <div
      class="flex flex-col items-center h-full xt-br mr-3"
      style="width: 72px; min-width: 72px;position: relative;"
    >
      <div v-for="list in listOption" :class="list?.class">
        <Float
          @itemClick="itemClick"
          :list="item.children"
          v-for="item in list.array"
          :data="item"
        >
          <Box
            :item="item"
            :id="currentIndex"
            :boxClass="list?.boxClass"
            :model="model"
          >
            <Item :item="item" v-bind="list?.itemOption">
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
    <div class="flex h-full flex-1 w-0">
      <slot></slot>
    </div>
    <!-- 主体区域结束 -->
  </div>
</template>

<script setup>
import { ref, computed, watch, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Float from "./Float.vue";
import Box from "./Box.vue";
import Item from "./Item.vue";
import { appStore } from "../../../store";
const store = appStore();
const { fullScreen } = storeToRefs(store);

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
          full: true,
        },
        {
          icon: "shezhi1",
        },
      ];
    },
  },
  model: {
    default: "router",
  },
});
// 全屏控制
const full = ref(false);
const isFull = ref(false);
const typeClass = computed(() => {
  if (full.value) {
    return isFull.value && fullScreen.value
      ? " fixed left-0 right-0 top-0 bottom-0 pr-3 py-3 "
      : "xt-bg pr-3 py-3 rounded-xl";
  }
});

// const route = useRoute();
// const currentPage = ref(route.path);
// watch(route, (newRoute) => {
//   if (full.value && currentPage !== newRoute.path) isFull.value = false;
// });
const { list } = toRefs(props);
// 动态添加ID
const newList = computed(() => {
  let index = -1;
  let res = list.value.map((item) => {
    if (item.full) full.value = true;
    let id = item.id ?? ++index;
    return {
      id,
      ...item,
    };
  });
  return res;
});

// 渲染的列表配置项
const listOption = computed(() => {
  return [
    {
      boxClass: "mb-2",
      array: newList.value.slice(0, props.last),
    },
    {
      class:
        "xt-scrollbar xt-container xt-bt flex flex-col items-center flex-1",
      boxClass: "mt-2",
      array: newList.value.slice(props.last, -1 * props.end),
      itemOption: {
        w: "40",
      },
    },
    {
      boxClass: "mt-2",
      array: newList.value.slice(-1 * props.end),
      itemOption: {
        type: "",
        newType: "",
        bg: "",
      },
    },
  ];
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
