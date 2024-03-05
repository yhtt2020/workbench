<template>
  <!-- 1 -->
  <div class="xt-bg-2 p-4 pb-1 mb-4 rounded-xl">
    <xt-option-info
      title="桌面壁纸"
      info="选择喜欢的图片作为工作台桌面壁纸。"
    />
    <template v-if="!settings.transparent">
      <div class="flex flex-col mb-4">
        <xt-update-desk-bg></xt-update-desk-bg>
      </div>
      <hr />
      <!-- 修复桌面壁纸设置，选择为纯色后，模糊度选项屏蔽掉这个bug,可能后续补充的需求 -->
      <template v-if="backgroundName.name === 'img'">
        <xt-option-info
          title="桌面壁纸模糊度"
          info="调节桌面壁纸的模糊程度。"
          icon="fluent:arrow-clockwise-16-regular"
          @onIconClick="backgroundSettings.backGroundImgBlur = 0"
        />
        <xt-option-slider
          v-model:slider="backgroundSettings.backGroundImgBlur"
          :min="0"
          :max="100"
        />
        <hr />
      </template>
    </template>

    <xt-option-info
      v-if="!$useEnv()"
      isSwitch
      v-model:switch="settings.transparent"
      title="透明背景"
      info="设置工作台窗口背景为透明，此功能下小组件的背景模糊会失效。"
    />
  </div>
  <!-- 2 -->
  <div class="xt-bg-2 p-4 pb-1 mb-4 rounded-xl">
    <xt-option-info
      isSwitch
      v-model:switch="autoOpenEdit"
      title="自动进入编辑模式"
      info="开启后在非编辑模式下添加小组件自动进入编辑模式。"
    />
  </div>
  <!-- 3 -->
  <div class="xt-bg-2 p-4 mb-4 rounded-xl">
    <div
      v-if="currentDeskSettings.enableZoom || isFreeLayout"
      class="rounded-xl text-sm p-3 xt-bg-t-2 mb-3"
      style="color: var(--warning)"
    >
      当前桌面正在使用独立布局或自由布局，此处设置的布局和缩放无效。
    </div>
    <xt-option-info
      title="桌面缩放"
      info="调节桌面的缩放比例，默认为100%。"
      icon="fluent:arrow-clockwise-16-regular"
      @onIconClick="globalSettings.cardZoom = 100"
    />
    <xt-option-slider
      v-model:slider="globalSettings.cardZoom"
      :min="20"
      :max="500"
    />
    <hr />
    <xt-option-info
      title="组件间距"
      info="调节组件之间的间距，默认为 12px。"
      icon="fluent:arrow-clockwise-16-regular"
      @onIconClick="globalSettings.cardMargin = 12"
    />
    <xt-option-slider
      v-model:slider="globalSettings.cardMargin"
      :min="6"
      :max="30"
    />
    <hr />
    <xt-option-info
      title="桌面距离顶部状态栏间距"
      info="调节桌面和「顶部状态栏」的间距。"
      @onIconClick="globalSettings.marginTop = 0"
      icon="fluent:arrow-clockwise-16-regular"
    />
    <xt-option-slider
      v-model:slider="globalSettings.marginTop"
      :min="0"
      :max="200"
      style="margin: 0 !important"
    />
  </div>
  <div class="xt-bg-2 p-4 pb-1 mb-4 rounded-xl">
    <div class="xt-bg-t-2 p-4 mb-4 rounded-xl text-sm xt-text-2">
      此类功能性能消耗较高，如果有卡顿情况请关闭。
    </div>
    <xt-option-info
      isSwitch
      v-model:switch="settings.houserun"
      title="边框RGB效果"
      info="在工作台窗口四周显示RGB效果。"
    />
    <hr />
    <xt-option-info
      isSwitch
      v-model:switch="settings.down.enable"
      title="飘落效果"
      info="选择喜欢的图片作为工作台桌面背景。"
    />
    <template v-if="settings.down.enable">
      <hr />
      <xt-option-info title="飘落物" />
      <xt-option-tab
        v-model="settings.down.type"
        :list="fallingList"
        circle
        style="height: 40px"
      />
      <hr />
      <xt-option-input v-model:input="settings.down.count" />
    </template>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref, toRefs, computed } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../store";
import { useDeskStore } from "../../../../components/desk/store";
import { cardStore as useCardStore } from "../../../../store/card";
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";
const freeLayoutStore = useFreeLayoutStore();
const { getCurrentDesk, isFreeLayout } = storeToRefs(freeLayoutStore);
const app = appStore();
const cardStore = useCardStore();
// 这个应该是全局桌面参数
const { settings: globalSettings } = storeToRefs(cardStore);
const { settings, backgroundSettings, backgroundName } = storeToRefs(app);

console.log("getCurrentDesk.value :>> ", getCurrentDesk.value);
const currentDeskSettings = computed(() => {
  return getCurrentDesk.value.settings;
});
const deskStore = useDeskStore();
const { autoOpenEdit } = storeToRefs(deskStore);

const fallingList = ref([
  {
    value: "rain",
    name: "雨",
  },
  {
    value: "snow",
    name: "雪",
  },
  {
    value: "leaf",
    name: "叶",
  },
]);
</script>

<style lang="scss" scoped></style>
