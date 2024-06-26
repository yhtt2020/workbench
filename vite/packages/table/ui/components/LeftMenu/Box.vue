<template>
  <!-- 统一选择模板 -->
  <div
    :class="[activeState ? 'active' : ' active-unread', boxClass]"
    class="flex justify-center items-center menu-item relative"
  >
    <div
      class="absolute flex items-center justify-center font-400 xt-active-text z-10"
      style="width: 20px; height: 20px; font-size: 10px"
      :style="[infoPosition]"
    >
      <xt-ify-icon
        v-if="typeof infoState === 'string'"
        size="20"
        :class="[infoBg]"
        :icon="infoState"
      />
      <div
        class="rounded-full flex items-center justify-center font-400 xt-active-text"
        v-else-if="item.info"
        style="position: absolute; font-size: 10px;"
        :class="[infoBg]"
      >
        {{ item.info[2] }}
      </div>
    </div>

    <!-- 置顶 -->
    <div
      class="absolute flex items-center justify-center font-400 xt-active-text"
      style="width: 16px; height: 16px; font-size: 10px"
      :style="[topPosition]"
      v-if="topState"
    >
      <div
        class="rounded-tr-lg rounded-bl-md flex items-center justify-center font-400 xt-active-text w-4 h-4"
        style="position: absolute; font-size: 10px; z-index: 110 !important"
        :class="[topBg]"  v-if="topState.state"
      >
        <xt-ify-icon size="12" :icon="topState.icon" class="xt-text" />
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
import routerTab from "../../../js/common/routerTab";
import { useRoute } from "vue-router";
import { reactive, toRefs, ref, watchEffect, onMounted, computed } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

const isActive = routerTab.isActive;
const props = defineProps({
  item: {},
  id: "",
  model: {
    default: "router",
  },
  boxClass: {},
});
const { item } = toRefs(props);
const tabParams = ref({});
onMounted(() => {
  tabParams.value = useRoute().params;
});
onBeforeRouteUpdate((to, from) => {
  tabParams.value = to.params;
});

const activeState = computed(() => {
  if (props.model == "router") {
    return isActive(props.item.tab || props.item.id, 3, tabParams.value);
  } else if (props.model == "id") {
    return props.item.id == props.id;
  }
});

/**
 * 2023-12-22
 * 定位信息
 */
const infoState = computed(() => {
  if (!item.value.info) return;

  if (item.value.info[2] && typeof item.value.info[2] === "object") {
    return item.value.info[2].icon;
  } else if (item.value.info[2]) {
    return 2;
  }
});
const infoPosition = computed(() => {
  if (!item.value.info) return;
  const position = item.value.info[0];
  const bg = item.value.info[1];
  if (position === "tr") {
    return {
      top: "-4px",
      right: "-4px",
    };
  } else if (position === "br") {
    return {
      bottom: "-4px",
      right: "-4px",
    };
  } else if (position === "tl") {
    return {
      left: "-6px",
      top: "-6px",
    };
  } else if (position === "bl") {
    return {
      left: "-4px",
      bottom: "-4px",
    };
  }
});
const infoBg = computed(() => {
  if (!item.value.info) return;
  const bg = item.value.info[1];
  if (bg === "red") return "tt-info-red";
  else if (bg === "warn") return "tt-info-warn";
  else if (bg === "success") return "success";
});

/**置顶标记
 * topPosition 记录位置
 * topState 记录状态 0 没有置顶, 置顶
 * topBg 记录颜色
 * **/
const topPosition = computed(() => {
  if (!item.value.top) return;
  const position = item.value.top[0];
  const bg = item.value.top[1];
  if (position === "tr") {
    return {
      top: "2px",
      right: "2px",
    };
  } else if (position === "br") {
    return {
      bottom: "1px",
      right: "1px",
    };
  } else if (position === "tl") {
    return {
      left: "-6px",
      top: "-6px",
    };
  } else if (position === "bl") {
    return {
      left: "-4px",
      bottom: "-4px",
    };
  }
});
const topState = computed(() => {
  if (!item.value.top) return;
  if (item.value.top[2] && typeof item.value.top[2] === "object") {
    if (item.value.top[3] && typeof item.value.top[3] === "number") {
      /**判断有没有置顶**/
      if (item.value.top[3] === 0) return;
      return {
        icon: item.value.top[2].icon,
        state: true,
      };
    }
  } else if (item.value.top[2]) {
    return 2;
  }
});
const topBg = computed(() => {
  if (!item.value.top) return;
  const bg = item.value.top[1];
  if (bg === "red") return "tt-info-red";
  else if (bg === "warn") return "tt-info-warn";
  else if (bg === "success") return "success";
  else if (bg === "blue") return "xt-theme-bg";
});

// 下个版本删除
// 通过计算属性判断消息提示状态
// const unreadStatus = computed(() => {
//   if (props.item.unread && props.item.unread !== 0) {
//     return true;
//   } else {
//     return false;
//   }
// });
</script>

<style lang="scss" scoped>
.active {
  border: 3px solid var(--active-bg);
}
.active-unread {
  border: 3px solid transparent !important;
}
.menu-item {
  width: 50px;
  // height: 50px;
  min-height: 50px;
  border-radius: 14px;
}
// 不同的info框
.tt-info-red {
  width: 18px;
  height: 18px;
  background: red;
}
// 1
.tt-info-warn {
  background: #fa7b14;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 50px;
  width: 12px;
  height: 12px;
}
</style>
