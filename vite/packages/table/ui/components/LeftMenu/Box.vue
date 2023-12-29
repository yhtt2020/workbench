<template>
  <!-- 统一选择模板 -->
  <div
    :class="[activeState ? 'active' : ' active-unread', boxClass]"
    class="flex justify-center items-center menu-item relative"
    style=""
  >
    <!-- <div
      class="rounded-full flex items-center justify-center font-400 xt-active-text"
      v-if="unreadStatus"
      style="
        width: 18px;
        height: 18px;
        position: absolute;
        font-size: 10px;
        z-index: 100;
        top: -4px;
        right: -4px;
      "
    >
      {{ item.unread }}
    </div> -->
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
        style="position: absolute; font-size: 10px; z-index: 50"
        :class="[infoBg]"
      >
        {{ item.info[2] }}
      </div>
    </div>
    <!--  -->

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
.tt-info-warn {
  background: #fa7b14;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 50px;
  width: 12px;
  height: 12px;
}
</style>
