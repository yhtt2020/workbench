<template>
  <div class="flex flex-col items-center h-full xt-br mr-3" style="width: 72px">
    <!-- 头部 -->
    <div>
      <Menu :list="item.children" v-for="item in newList.slice(0, last)">
        <Box
          :item="item"
          @selectClick="selectClick"
          :id="currentId"
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
      class="flex-1 xt-scrollbar xt-container xt-bt pb-2 xt-bm flex flex-col items-center"
    >
      <Menu :list="item.children" v-for="item in newList.slice(last, -1 * end)">
        <Box
          :item="item"
          @selectClick="selectClick"
          :id="currentId"
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
      </Menu>
    </div>
    <!-- 底部 -->
    <div>
      <Menu :list="item.children" v-for="item in newList.slice(-1 * end)">
        <Box
          :item="item"
          @selectClick="selectClick"
          :id="currentId"
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Menu from "./Menu.vue";
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
  id: { default: false },
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
const id = computed(() => {
  return isNaN(props.id.value) ? newList.value[0].id : props.id.value;
});

// 选择ID
const currentId = ref(id.value);

//选中事件
const selectClick = (id, flag) => {
  if (flag) return;
  currentId.value = id;
};

// 点击事件
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
</style>
