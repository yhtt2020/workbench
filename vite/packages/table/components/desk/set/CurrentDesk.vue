<template>
  <div class="xt-bg-2 p-4 mb-4 rounded-xl">
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
      v-model:switch="fixedDesk.settings.enableZoom"
      title="独立缩放"
      info="开启独立缩放后，将不再使用「通用设置」中的相关缩放设置。"
    />
    <template v-if="fixedDesk.settings.enableZoom">
      <hr />
      <xt-option-info
        title="桌面缩放"
        info="调节桌面的缩放比例，默认为100%。"
        icon="fluent:arrow-clockwise-16-regular"
        @onIconClick="fixedDesk.settings.cardZoom = 100"
      />
      <xt-option-slider
        v-model:slider="fixedDesk.settings.cardZoom"
        :min="20"
        :max="500"
      />
      <hr />
      <xt-option-info
        title="组件间距"
        info="调节组件之间的间距，默认为 12%。"
        icon="fluent:arrow-clockwise-16-regular"
        @onIconClick="fixedDesk.settings.cardMargin = 0"
      />
      <xt-option-slider
        v-model:slider="fixedDesk.settings.cardMargin"
        :min="6"
        :max="30"
      />
      <hr />
      <xt-option-info
        title="桌面距离顶部状态栏间距"
        info="调节桌面和「顶部状态栏」的间距。"
        @onIconClick="fixedDesk.settings.marginTop = 0"
        icon="fluent:arrow-clockwise-16-regular"
      />
      <xt-option-slider
        v-model:slider="fixedDesk.settings.marginTop"
        :min="0"
        :max="200"
        style="margin: 0 !important ;"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, toRefs } from "vue";

// props
const props = defineProps({
  fixedDesk: {},
});
const { fixedDesk } = toRefs(props);

const fixedLayout = ref(
  fixedDesk.value.settings.vDirection ? "horizontal" : "vertical"
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
  fixedDesk.value.settings.vDirection = !fixedDesk.value.settings.vDirection;
};
</script>

<style lang="scss" scoped></style>
