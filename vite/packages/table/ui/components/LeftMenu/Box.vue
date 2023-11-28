<template>
  <!-- 统一选择模板 -->
  <div
    :class="[ activeState ?  'active' : ' active-unread', boxClass]"
    class="xt-base-btn menu-item relative "
    style=""
  >
    <div class="rounded-full flex items-center justify-center font-400" v-if="item.unread !== 0 && item.hasOwnProperty('unread')"
     style="width:18px;height: 18px; position: absolute; background:red;font-size: 10px;z-index: 1000;top: -4px;right: -4px;">
     {{ item.unread }}
    </div>
    <slot></slot>

  </div>
</template>

<script setup>
import routerTab from "../../../js/common/routerTab";
import { useRoute } from "vue-router";
import { reactive, ref, watchEffect, onMounted, computed } from "vue";
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
const showUnread = computed(() => {
  console.log("执行...排查问题", props.item.unread);
  return props.item.unread !== 0 ? props.item.unread : 0;
});
</script>

<style lang="scss" scoped>
.active {
  border: 3px solid var(--active-bg);
}
.active-unread{
  border: 3px solid transparent !important;
}

.menu-item {
  width: 50px;
  height: 50px;
  min-height: 50px;
  border-radius: 14px;
}
</style>
