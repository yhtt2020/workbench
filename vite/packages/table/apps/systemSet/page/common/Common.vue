<template>
  <div class="flex justify-between mb-4">
    <template v-for="item in itemList">
      <div
        style="width: 105px; height: 105px; border-radius: 12px"
        class="flex flex-col items-center justify-center cursor-pointer xt-bg-2"
        v-if="!item?.disabled"
        @click="item.fn"
      >
        <xt-ify-icon :icon="item.icon" size="32" />
        {{ item?.name }}
      </div>
    </template>
  </div>
  <!-- 选择屏幕 -->
  <a-modal
    v-model:visible="visibleChooseScreen"
    :title="null"
    width="100%"
    :footer="null"
    wrap-class-name="full-modal"
    @ok="
      () => {
        this.visibleChooseScreen = false;
      }
    "
  >
    <div
      style="
        zoom: 1.5;
        font-size: 16px;
        padding-top: 5em;
        text-align: center;
        z-index: 9999999999999999999;
      "
    >
      <div style="width: 500px; overflow: visible; display: inline-block">
        <ChooseScreen />
      </div>
    </div>
  </a-modal>

  <Zoom v-if="$usePlat('client')" />
  <!-- 2 -->
  <xt-option-box>
    <xt-option-info
      title="状态栏显示日期和时间"
      isSwitch
      v-model:switch="appSettings.showTopbarTime"
    />
    <hr />
    <xt-option-info
      title="状态栏显示天气"
      info="需要先添加天气组件，完成城市设置。"
      class="pb-3"
      isSwitch
      v-model:switch="appSettings.showTopbarWeather"
    />
  </xt-option-box>
  <!-- 3 -->
  <xt-option-box v-if="!$usePlat()">
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
      v-model:switch="isAutoRun"
    />
    <hr />
    <xt-option-info
      title="显卡硬件加速"
      info="关闭显卡硬件加速可以减少显卡占用，但会提升处理器占用，重启生效"
      isSwitch
      v-model:switch="hardware"
    />
  </xt-option-box>
  <!-- 4 -->
  <xt-option-box v-if="!$usePlat()">
    <xt-option-info title="双击托盘菜单默认打开" />
    <xt-option-tab
      v-model="trayMode"
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
      style="height: 40px"
    />
    <hr />
    <xt-option-info title="链接打开方式" />
    <xt-option-tab
      v-model="browserMode"
      :list="browserList"
      circle
      style="height: 40px"
    />
  </xt-option-box>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { cardStore as useCardStore } from "../../../../store/card";
import { appStore as useAppStore } from "../../../../store";
import { useWidgetStore } from "../../../../components/card/store";
import { browserList, rightMenuList, trayList } from "./config";
import { useAppModal } from "../../../../hooks";

import ChooseScreen from "../../../../page/ChooseScreen.vue";
import Zoom from "./Zoom.vue";

const router = useRouter();

const cardStore = useCardStore();
const { settings: cardSettings } = storeToRefs(cardStore);

const appStore = useAppStore();
const { settings: appSettings } = storeToRefs(appStore);

const widgetStore = useWidgetStore();
const { rightModel } = storeToRefs(widgetStore);

const { proxy } = getCurrentInstance();

const visibleChooseScreen = ref(false);
const emits = defineEmits(["switchNav"]);
const itemList = computed(() => {
  return [
    {
      name: "设置触控屏",
      icon: "fluent:hand-draw-16-regular",
      fn: async () => {
        await tsbApi.window.setAlwaysOnTop(false);
        let cp = require("child_process");
        cp.exec("MultiDigiMon.exe -touch", async (err) => {
          await tsbApi.window.setAlwaysOnTop(true);
        });
      },
      disabled: proxy.$usePlat(),
    },
    {
      name: "选择屏幕",
      icon: "fluent:desktop-16-regular",
      fn: () => {
        visibleChooseScreen.value = true;
      },
      disabled: proxy.$usePlat(),
    },
    {
      name: "鼠标穿梭",
      icon: "fluent:cursor-click-20-regular",
      fn: () => {
        emits("switchNav", "Key");
      },
      disabled: proxy.$usePlat(),
    },
    {
      name: "锁屏设置",
      icon: "fluent:lock-closed-16-regular",
      fn: () => {
        const { openApp } = useAppModal("galleryModalApp");
        openApp();
        setTimeout(() => {
          proxy.$bus.emit("lockScreen");
        }, 500);
      },
      disabled: false,
    },
  ];
});

/**
 * 托盘模式
 */
const trayMode = ref("table");
// 监听双击托盘菜单打开模式
watch(
  () => trayMode.value,
  async (value) => {
    await tsbApi.settings.set("trayOpen", value);
  }
);
/**
 * 浏览器模式
 */
const browserMode = ref("system");
// 监听浏览器模式
watch(
  () => browserMode.value,
  async (value) => {
    await tsbApi.settings.set("openUrlBrowser", value);
  }
);

// 监听是否在任务栏显示
watch(
  () => appSettings.value.showInTaskBar,
  async (value) => {
    tsbApi.window.setSkipTaskbar(!value);
  }
);

/**
 * 开机自启动
 */
const isAutoRun = ref(false);

// 监听是否开机自启动
watch(
  () => isAutoRun.value,
  async (value) => {
    await tsbApi.settings.setAutoRun(value);
  }
);

const hardware = ref(true);
// 监听是否硬件加速

onMounted(async () => {
  if (proxy.$usePlat()) return;
  // 获取窗口缩放
  // windowZoom.value = (await tsbApi.window.getZoomFactor()) * 100 || 100;
  // oldWindowZoom.value = windowZoom.value;
  // 获取托盘模式
  trayMode.value = (await tsbApi.settings.get("trayMode")) || "table";
  // 获取浏览器模式
  browserMode.value = (await tsbApi.settings.get("openUrlBrowser")) || "system";
  // 获取开机自启动
  isAutoRun.value = await tsbApi.settings.get("autoRun");
  //硬件加速
  hardware.value = await tsbApi.settings.get("hardware");
  if (hardware.value === undefined) {
    hardware.value = true;
  }
  watch(
    () => hardware.value,
    async (value) => {
      await tsbApi.settings.set("hardware", value);
      if (value) {
        window.$ui.confirm("提示", "开启硬件加速需要重启后方可生效。", {
          type: "warning",
          noText: "立即重启软件",
          okText: "稍后手动重启",
          noButtonWidth: 120,
          no: () => {
            tsbApi.system.restart();
          },
          okButtonWidth: 120,
        });
      } else {
        window.$ui.confirm(
          "提示",
          "关闭硬件加速后，会将显卡的负载转移到处理器，且需重启软件生效。",
          {
            type: "warning",
            okButtonWidth: 120,
            noText: "立即重启软件",
            okText: "稍后手动重启",
            noButtonWidth: 120,
            no: () => {
              tsbApi.system.restart();
            },
          }
        );
      }
    }
  );
});
</script>

<style lang="scss" scoped></style>
