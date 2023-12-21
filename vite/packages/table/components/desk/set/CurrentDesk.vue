<template>
  <div class="p-4 mb-4 text-base xt-bg-2 rounded-xl">
    <div class="mb-4">桌面名称</div>
    <xt-input v-model="currentDesk.name" class="xt-modal xt-b"></xt-input>
  </div>
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
  <div v-if="!isFreeLayout" class="xt-bg-2 p-4 mb-4 rounded-xl">
    <xt-option-info title="滚动模式" info="选择桌面的滚动模式。" />
    <xt-option-tab
      v-model="fixedLayout"
      :list="fixedLayoutList"
      circle
      style="height: 40px"
      @cb="updateFixedLayout"
    />
    <xt-option-info
      isSwitch
      v-model:switch="fixedSettings.enableZoom"
      title="独立缩放"
      info="开启独立缩放后，将不再使用「通用设置」中的相关缩放设置。"
    />
    <template v-if="fixedSettings.enableZoom">
      <hr />
      <xt-option-info
        title="桌面缩放"
        info="调节桌面的缩放比例，默认为100%。"
        icon="fluent:arrow-clockwise-16-regular"
        @onIconClick="fixedSettings.cardZoom = 100"
      />
      <xt-option-slider
        v-model:slider="fixedSettings.cardZoom"
        :min="20"
        :max="500"
      />
      <hr />
      <xt-option-info
        title="组件间距"
        info="调节组件之间的间距，默认为 12%。"
        icon="fluent:arrow-clockwise-16-regular"
        @onIconClick="fixedSettings.cardMargin = 12"
      />
      <xt-option-slider
        v-model:slider="fixedSettings.cardMargin"
        :min="6"
        :max="30"
      />
      <hr />
      <xt-option-info
        title="桌面距离顶部状态栏间距"
        info="调节桌面和「顶部状态栏」的间距。"
        @onIconClick="fixedSettings.marginTop = 0"
        icon="fluent:arrow-clockwise-16-regular"
      />
      <xt-option-slider
        v-model:slider="fixedSettings.marginTop"
        :min="0"
        :max="200"
        style="margin: 0 !important"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../freeLayout/store";
// pinia
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout } = storeToRefs(freeLayoutStore);

// props
const props = defineProps({
  fixedSettings: {},
  currentDesk: {},
});
const { fixedSettings } = toRefs(props);

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

const fixedLayout = ref(
  fixedSettings.value.vDirection ? "horizontal" : "vertical"
);
const fixedLayoutList = ref([
  {
    name: "水平滚动",
    value: "horizontal",
  },
  {
    name: "垂直滚动",
    value: "vertical",
  },
]);

const updateFixedLayout = (data) => {
  fixedSettings.value.vDirection = !fixedSettings.value.vDirection;
};
</script>

<style lang="scss" scoped></style>
