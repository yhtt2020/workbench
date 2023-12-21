<template>
  <div class="xt-bg-2 p-4 mb-4 rounded-xl">
    <div class="mb-2.5">桌面布局模式</div>
    <div
      class="rounded-xl text-sm p-3 xt-bg-t-2 mb-3"
      style="color: var(--warning)"
    >
      目前「自由布局」还处于测试完善中，「水平布局」和「垂直布局」是我们提供的过度方案，如果你在使用「自由布局」中出现了影响使用的问题，请切换到其他两种布局模式）
    </div>
    <xt-option-tab
      v-model="currentLayout"
      :list="layoutList"
      circle
      style="margin-bottom: 0; height: 40px"
      @cb="updateTab"
    />
  </div>
  <CurrentDesk v-if="!isFreeLayout" :fixedDesk="fixedDesk" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, toRefs } from "vue";
import { useFreeLayoutStore } from "../freeLayout/store";
import CurrentDesk from "./CurrentDesk.vue";

// pinia
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout } = storeToRefs(freeLayoutStore);

// props
const props = defineProps({
  fixedDesk: {},
});
const { fixedDesk } = toRefs(props);

// 桌面布局切换
const currentLayout = ref(isFreeLayout.value === true ? "free" : "fixed");
const layoutList = ref([
  {
    name: "自由布局",
    value: "free",
  },
  {
    name: "固定布局",
    value: "fixed",
  },
]);
const updateTab = (data) => {
  freeLayoutStore.renewFreeLayout();
};

</script>

<style lang="scss" scoped></style>
