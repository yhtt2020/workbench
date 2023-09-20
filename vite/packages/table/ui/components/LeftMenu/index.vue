<template>
  <div class="xt-text flex h-full" style="box-sizing: border-box; " :class="[typeClass]">
    <!-- 左侧区域开始 -->
    <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 72px; min-width: 72px">
      <!-- 头部 -->
      <div>
        <Menu @itemClick="itemClick" :list="item.children" v-for="item in newList.slice(0, last)">
          <tippy trigger="mouseenter" :interactive="true" placement="right">
            <template #content v-if="item.float">
              <slot :name="item.float"> </slot>
            </template>
            <Box @itemClick="itemClick" :item="item" @selectClick="selectClick" :id="currentIndex" class="mb-2">
              <Full v-if="item.full"></Full>
              <Item :item="item" v-else>
                <template #[item.slot]>
                  <slot :name="item.slot"></slot>
                </template>
              </Item>
            </Box>
          </tippy>
        </Menu>
      </div>
      <!-- 中间 -->
      <div class="xt-scrollbar xt-container  xt-bt flex flex-col items-center flex-1">
        <!-- <vue-custom-scrollbar :settings="scrollerSettings" style="height: 100%">
          <div style="height: auto"> -->
        <Menu @itemClick="itemClick" :list="item.children" v-for="item in newList.slice(last, -1 * end)">
          <tippy trigger="mouseenter" :interactive="true" placement="right" :arrow="false" >
            <template #content v-if="item.float ">
              <slot :name="isFloat === true ? item.float : ''"> </slot>
            </template>
            <Box @itemClick="itemClick" :item="item" @selectClick="selectClick" :id="currentIndex" class="mt-2">
              <Full v-if="item.full" v-model:full="isFull" type=""></Full>
              <Item v-else :item="item" w="40">
                <template #[item.slot]>
                  <slot :name="item.slot"></slot>
                </template>
              </Item>
            </Box>
          </tippy>
        </Menu>
        <!-- </div>
        </vue-custom-scrollbar> -->
      </div>
      <!-- 底部 -->
      <div>
        <Menu @itemClick="itemClick" :list="item.children" v-for="item in newList.slice(-1 * end)">
          <tippy trigger="mouseenter" :interactive="true" placement="right">
            <template #content v-if="item.float">
              <slot :name="item.float"> </slot>
            </template>
            <Box @itemClick="itemClick" :item="item" @selectClick="selectClick" :id="currentIndex" class="mt-2">
              <Full v-if="item.full" v-model:full="isFull" type=""></Full>
              <Item :item="item" type="" v-else>
                <template #[item.slot]>
                  <slot :name="item.slot"></slot>
                </template>
              </Item>
            </Box>
          </tippy>
        </Menu>
      </div>
    </div>
    <!-- 左侧区域结束 -->
    <!-- 主体区域开始 -->
    <div class="h-full w-full flex">
      <slot></slot>
    </div>
    <!-- 主体区域结束 -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Menu from "./Menu.vue";
import Full from "./Full.vue";
import Box from "./Box.vue";
import Item from "./Item.vue";
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import { nanoid } from "nanoid";
import { chatStore } from '../../../store/chat'

const props = defineProps({
  // scrollerSettings: {
  //   default: {
  //     useBothWheelAxes: true,
  //     swipeEasing: true,
  //     suppressScrollY: false,
  //     suppressScrollX: true,
  //     wheelPropagation: true,
  //   },
  // },
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
  let res = props.list.map((item) => {
    if (item.full) full.value = true;
    let id = item.id ?? nanoid();
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
  if (item.full) {
    isFull.value = !isFull.value;
    return;
  }
  selectClick(item.id, item.flag);
  if (item.children) return;
  emit("update:modelValue", item);
  item.callBack && item.callBack(item);
};

// 判断是否展开悬浮模式
const isFloat = computed(()=>{
  return chatStore().$state.settings.enableHide
});
</script>

<style lang="scss" scoped>
// .box {
//   border: 4px solid var(--active-bg) !important;
//   border-radius: 12px;
// }

// :deep(.anticon) {
//   font-size: 20px;
// }

// :deep(.ps__rail-y) {
//   display: none;
// }


</style>
