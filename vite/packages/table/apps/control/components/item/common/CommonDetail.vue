<!-- 没有开启编辑情况下的详情页 -->
<template>
  <!-- 音乐播放器和音量调节按钮 -->
  <template v-if="controlIndex === 'audio' && !$usePlat()">
    <div
      style="width: 252px; height: 120px"
      class="xt-text flex flex-col rounded-xl"
    >
      <SystemAudio />
    </div>
  </template>

  <!-- 用户中心数据信息模块 -->
  <template v-else-if="controlIndex === 'user-info'">
    <div
      class="rounded-xl pointer category-button xt-bg-t-2 flex items-center justify-center flex-col"
      style="height: 120px; width: 252px"
    >
      <UserControl :userinfo="userInfo" v-if="isUserInfoNull" />
      <UserUnLogin v-else />
    </div>
  </template>
  <template v-else-if="controlIndex === 'window-size-position'">
    <div
      class="rounded-xl pointer category-button xt-bg-t-2 flex items-center justify-center flex-col"
      style="height: 120px; width: 252px">
      <Screen :isClick="true" />
    </div>
  </template>

  <!-- 控制中心其他按钮 -->
  <template v-else>
    <div
      style="height: 120px; width: 120px"
      class="rounded-xl pointer category-button flex flex-col items-center justify-center relative"
      @click="triggerControl"
      :class="controlStatus?.status ? 'xt-theme-bg' : 'xt-bg-t-2'"
    >
      <div
        class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3"
      >
        <xt-ify-icon
          :icon="controlItem.icon"
          size="24"
          :class="controlStatus?.status ? 'xt-active-text' : 'xt-text-2'"
        />
      </div>
      <span
        class="xt-text"
        :class="controlStatus?.status ? 'xt-active-text' : 'xt-text'"
      >
        {{ controlItem.name }}
      </span>
      <div
        class="absolute red-content rounded-full"
        v-if="!setting.firstVisible && controlIndex === 'barrage'"
        style="border: 2px solid #ffffff"
      ></div>
    </div>
  </template>
</template>

<script setup>
import { computed, toRefs, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../../store";
import { controlStore } from "../../../hooks/controlStore";
import { message, notification } from "ant-design-vue";
import { navStore } from "../../../../../store/nav";
import { completeTask } from "../../../../task/task";
import { useRouter } from "vue-router";
import { setThemeSwitch } from "../../../../../components/card/hooks/themeSwitch";

import UserControl from "../user/UserControl.vue";
import UserUnLogin from "../user/UserUnLogin.vue";
import Screen from "../screen/screen.vue";
import SystemAudio from "../system/SystemAudio.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  controlIndex: {
    type: String,
    required: true,
  },
  controlItem: {
    type: Object,
    default: () => {},
  },
});

const { controlIndex, controlItem } = toRefs(props);
const app = appStore();
const {
  userInfo,
  settings,
  styles,
  simple,
  aided,
  saving,
  showWindowController,
} = storeToRefs(app);
const control = controlStore();
const { setting } = storeToRefs(control);
const nav = navStore();
const { copyFootNav } = storeToRefs(nav);

const isUserInfoNull = computed(() => {
  if (!userInfo.value) {
    return false;
  } else {
    return true;
  }
});

// 通过计算属性来判断控制中心是否开启的状态
const controlStatus = computed(() => {
  switch (controlIndex.value) {
    // 窗口控制
    case "window-control":
      return { status: showWindowController.value };
    // 浅色模式
    case "light-color-mode":
      return { status: styles.value };
    // 极简模式
    case "min-mode":
      return { status: simple.value };
    // 节能模式
    case "energy-save-mode":
      return { status: saving.value };
    // 勿扰模式
    case "mute-mode":
      return { status: settings.value.noticeEnable };
    // 辅助模式
    case "assist-mode":
      return { status: aided.value };
    // 摇一摇
    case "shake":
      return { status: settings.value.shake.enable };
    //游戏模式  后期功能实现后再对接
    case "game-mode":
      return { status: false };
    case "barrage":
      if (settings.value.enableBarrage) {
        window.$manager.test();
      }
      return { status: settings.value.enableBarrage };
    default:
      break;
  }
});

// 触发控制中心状态修改
const triggerControl = () => {
  switch (controlIndex.value) {
    // 窗口控制
    case "window-control":
      showWindowController.value = !showWindowController.value;
      break;
    // 浅色模式
    case "light-color-mode":
      styles.value = !styles.value;
      setThemeSwitch(styles.value);
      break;
    // 极简模式
    case "min-mode":
      simple.value = !simple.value;
      if (simple.value) {
        const isControl = copyFootNav.value.some((item) => {
          return item.value === "control";
        });
        const controlOption = {
          addNav: true,
          bg: "",
          ext: "",
          icon: "/logo/control.svg",
          id: "CaWUiH",
          isBg: false,
          mode: "app",
          name: "控制中心",
          slot: "control",
          summary: "",
          type: "systemApp",
          value: "control",
        };
        if (!isControl) {
          copyFootNav.value.unshift({ ...controlOption });
        }
      } else {
        const index = copyFootNav.value.findIndex((item) => {
          return item.value === "control";
        });
        if (index !== -1) {
          copyFootNav.value.splice(index, 1);
        }
      }
      break;
    // 节能模式
    case "energy-save-mode":
      saving.value = !saving.value;
      // 使用节能模式后，将关闭各种界面动画，同时尽可能清理掉滞留内存中的进程。可能导致打开界面效果折损或者应用切换缓慢。但可以显著降低内存、CPU、GPU占用。
      break;
    // 勿扰模式
    case "mute-mode":
      settings.value.noticeEnable = !settings.value.noticeEnable;
      break;
    // 辅助模式
    case "assist-mode":
      aided.value = !aided.value;
      if (!aided.value) {
        app.leaveAided();
        message.success("已为您关闭辅助模式");
      } else {
        notification.info({
          message:
            "开启辅助模式后，工作台将无法被聚焦。此时无法输入任何内容，但是也不会因为点击工作台而切换焦点。可防止游戏窗口失焦。或者搭配快捷键使用。",
        });
        app.enterAided();
      }
      break;
    // 摇一摇
    case "shake":
      settings.value.shake.enable = !settings.value.shake.enable;
      if (settings.value.shake.enable) {
        app.enableShake(() => {
          router.push({
            name: "key",
          });
        });
      } else {
        app.disableShake();
      }
      break;
    //游戏模式  后期功能实现后再对接
    case "game-mode":
      return { status: false };
    // 弹幕
    case "barrage":
      settings.value.enableBarrage = !settings.value.enableBarrage;
      setting.value.firstVisible = true;
      if (settings.value.enableBarrage) {
        window.$manager.show();
        message.info("已为开启弹幕模式");
      } else {
        window.$manager.hidden();
        message.info("已为关闭弹幕模式");
      }
      completeTask("M0204");
      break;
    case "user-info":
      router.push({ name: "socialMy" });
      proxy.$bus.emit("closeControl");
      break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
.red-content {
  width: 12px;
  height: 12px;
  background: red;
  top: 1px;
  right: 1px;
}
</style>