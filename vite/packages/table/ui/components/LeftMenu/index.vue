<template>
  <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 72px">
    <!-- 头部 -->
    <div>
      <Menu
        @itemClick="itemClick"
        :list="item.children"
        v-for="item in newList.slice(0, last)"
      >
        <Box
          @itemClick="itemClick"
          :item="item"
          @selectClick="selectClick"
          :id="currentIndex"
          class="mb-2"
        >
          <div
            v-if="item.slot"
            style="width: 40px; height: 40px; border-radius: 10px"
            class="xt-bg xt-base-btn"
          >
            <slot :name="item.slot"> </slot>
          </div>
          <Item :item="item" v-else>
            <template #default>
              <slot :name="item.slot"> </slot>
            </template>
          </Item>
        </Box>
      </Menu>
    </div>
    <!-- 中间 -->
    <div
      class="flex-1 xt-scrollbar xt-container xt-bt pb-3 mb-3  flex flex-col items-center"
    >
      <vue-custom-scrollbar :settings="scrollerSettings" style="height: 100%">
        <div style="height: auto">
          <Menu
            @itemClick="itemClick"
            :list="item.children"
            v-for="item in newList.slice(last, -1 * end)"
          >
            <a-tooltip :title="item.title" placement="right">
              <Box
                @itemClick="itemClick"
                :item="item"
                @selectClick="selectClick"
                :id="currentIndex"
                class="mt-2"
              >
                <div
                  v-if="item.slot"
                  style="width: 40px; height: 40px; border-radius: 10px"
                  class="xt-bg xt-base-btn"
                >
                  <slot :name="item.slot"> </slot>
                </div>
                <Item :item="item" w="40">
                  <template #default>
                    <slot :name="item.slot"></slot>
                  </template>
                </Item>
              </Box>
            </a-tooltip>
          </Menu>
        </div>
      </vue-custom-scrollbar>
    </div>
    <!-- 底部 -->
    <div>
      <Menu
        @itemClick="itemClick"
        :list="item.children"
        v-for="item in newList.slice(-1 * end)"
      >
        <Box
          @itemClick="itemClick"
          :item="item"
          @selectClick="selectClick"
          :id="currentIndex"
          class="mb-2"
        >
          <div
            v-if="item.slot"
            style="width: 40px; height: 40px; border-radius: 10px"
            class="xt-bg xt-base-btn"
          >
            <slot :name="item.slot"> </slot>
          </div>
          <Item :item="item" type="" v-else>
            <template #default>
              <slot :name="item.slot"> </slot>
            </template>
          </Item>
        </Box>
      </Menu>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Menu from "./Menu.vue";
import Box from "./Box.vue";
import Item from "./Item.vue";
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import { nanoid } from "nanoid";

const props = defineProps({
  scrollerSettings: {
    default: {
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true,
    },
  },
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
      ];
    },
  },
});

// 动态添加ID
const newList = computed(() => {
  let res = props.list.map((item) => {
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
  selectClick(item.id, item.flag);
  if (item.children) return;
  emit("update:modelValue", item);
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped>
.box {
  border: 4px solid var(--active-bg) !important;
  border-radius: 12px;
}
.anticon {
  width: 999px !important;
  color: red !important;
}
:deep(.anticon) {
  font-size: 20px;
}
:deep(.ps__rail-y) {
  display: none;
}
</style>
