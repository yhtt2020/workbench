<template>
  <div class="flex justify-between mb-3">
    <template v-for="item in itemList">
      <div
        style="width: 105px; height: 105px; border-radius: 12px"
        class="flex flex-col items-center justify-center xt-bg-2 cursor-pointer"
        v-if="!item.disabled"
        @click="item.fn"
      >
        <xt-ify-icon :icon="item.icon" size="32" />
        {{ item.name }}
      </div>
    </template>
  </div>
  <xt-option-box>
    <xt-option-info
      title="桌面缩放"
      info="调节桌面的缩放比例，默认为100%。"
      icon="fluent:arrow-clockwise-16-regular"
      @onIconClick="settings.cardZoom = 100"
    />
    <xt-option-slider
      v-model:slider="settings.cardZoom"
      :min="20"
      :max="500"
      class="pb-3"
    />
  </xt-option-box>
  <xt-option-box>
    <xt-option-info
      title="顶部状态栏显示日期和时间"
      isSwitch
      v-model:switch="appSettings.showTopbarTime"
    />
    <hr />
    <xt-option-info
      title="顶部状态栏显示天气"
      info="需要先添加天气组件，完成城市设置。"
      class="pb-3"
      isSwitch
      v-model:switch="appSettings.showTopbarWeather"
    />
    <div class="pb-1"></div>
  </xt-option-box>
  <xt-option-box>
    <xt-option-info
      title="在系统任务栏中显示工作台窗口"
      isSwitch
      v-model:switch="appSettings.showInTaskBar"
    />
    <hr />
    <xt-option-info
      title="开机自启动"
      info="可能会被安全软件拦截，请选择允许。"
      isSwitch
      v-model:switch="appSettings.autoStart"
    />
    <div class="pb-1"></div>
  </xt-option-box>
  <!-- {{ appSettings }} -->
  <xt-option-box>
    <xt-option-info title="双击托盘菜单默认打开" />
    <xt-option-tab
      v-model="trayOpen"
      :list="trayList"
      circle
      style="height: 40px"
    />
    <hr />
    <xt-option-info title="右键菜单模式" />
    <xt-option-tab
      v-model="rightModel"
      :list="rightMenuList"
      circle
      style="margin-bottom: 0; height: 40px"
    />
    <hr />
    <xt-option-info title="链接打开方式" />
    <xt-option-tab
      v-model="browserMode"
      :list="browserList"
      circle
      style="margin-bottom: 0; height: 40px"
    />
    <hr />

    <div class="pb-1"></div>
  </xt-option-box>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { cardStore as useCardStore } from "../../../store/card";
import { appStore as useAppStore } from "../../../store";
import { useWidgetStore } from "../../card/store";

const cardStore = useCardStore();
const { settings } = storeToRefs(cardStore);

const appStore = useAppStore();
const { settings: appSettings } = storeToRefs(appStore);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

const { proxy } = getCurrentInstance();
//
const itemList = computed(() => {
  return [
    {
      name: "设置触控屏",
      icon: "fluent:hand-draw-16-regular",
      fn: () => {},
      // 禁用
      disabled: proxy.$useEnv(),
    },
    {
      name: "选择屏幕",
      icon: "fluent:desktop-16-regular",
      fn: () => {},
      disabled: proxy.$useEnv(),
    },
    {
      name: "分屏设置",
      icon: "fluent:window-multiple-16-filled",
      fn: () => {},
      disabled: proxy.$useEnv(),
    },
    {
      name: "主题外观",
      icon: "fluent:color-24-regular",
      fn: () => {},
      disabled: false,
    },
  ];
});
// 托盘菜单

const trayList = [
  {
    name: "工作台",
    value: "table",
  },
  {
    name: "浏览器",
    value: "browser",
  },
];
const rightMenuList = [
  {
    name: "下拉菜单",
    value: "follow",
  },
  {
    name: "抽屉菜单",
    value: "default",
  },
];
// 托盘模式
const trayMode = ref("");
// 浏览器模式
const browserMode = ref("");

onMounted(async () => {
  trayMode.value = (await tsbApi.settings.get("trayMode")) || "table";
  browserMode.value = (await tsbApi.settings.get("openUrlBrowser")) || "system";
});
const browserList = [
  {
    name: "系统默认",
    value: "system",
  },
  {
    name: "内置浏览器",
    value: "table",
  },
  {
    name: "想天浏览器",
    value: "inner",
  },
];
// 监听是否在任务栏显示
watch(
  () => appSettings.value.showInTaskBar,
  async (value) => {
    tsbApi.window.setSkipTaskbar(!value);
  }
);

// 监听是否开机自启动
watch(
  () => appSettings.value.autoStart,
  async (value) => {
    ipc.send("setAutoRun", { value });
  }
);

// 监听双击托盘菜单默认打开
watch(
  () => trayMode.value,
  async (value) => {
    await tsbApi.settings.set("trayOpen", value);
  }
);

// 监听右键菜单模式
watch(
  () => rightModel.value,
  async (value) => {
    await tsbApi.settings.set("openUrlBrowser", value);
  }
);
</script>

<style lang="scss" scoped></style>
