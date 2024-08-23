<template>
  <xt-option-box>
    <xt-option-info title="主题模式" />
    <xt-option-tab
      v-model="styles"
      :list="themeModeList"
      circle
      style="margin-bottom: 0; height: 40px"
      @cb="updateThemeMode"
    />
    <div class="pb-3"></div>
  </xt-option-box>
  <xt-option-box>
    <xt-option-info title="主题色" />

    <xt-option-color
      v-model:color="themeColor"
      class="w-full"
      style="padding-bottom: 0 !important"
      :isLinear="false"
      @cb="updateThemeColor"
    />
  </xt-option-box>

  <xt-option-box>
    <xt-option-info title="桌面壁纸" />
    <xt-update-desk-bg />
    <hr
      style="margin: 16px 0 !important"
      v-if="backgroundName.name === 'img'"
    />
    <template v-if="backgroundName.name === 'img'">
      <!-- <div class="pt-3"></div> -->
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
    </template>
    <hr />
    <xt-option-info
      v-if="$usePlat('client')"
      isSwitch
      v-model:switch="settings.transparent"
      @updateSwitchCb="updateTransparent"
      title="透明背景"
      info="设置工作台窗口背景为透明，此功能下小组件的背景模糊会失效。"
    />
    <div class="" style="padding-bottom: 1px"></div>
  </xt-option-box>
</template>

<script setup lang="ts">
// styles
import { storeToRefs } from "pinia";
import { appStore as useAppStore } from "../../../../store";
import { setThemeSwitch } from "../../../../components/card/hooks/themeSwitch";
import { onMounted, ref,getCurrentInstance ,watch} from "vue";
import { getBgColor } from "../../../../components/card/hooks/styleSwitch/getStyle";
import { completeTask } from "../../../task/task";
import { setTheme,setThemeColor } from "../../../ttApp/src/modules/wujie/useWuJieBus";
import {
  setBgColor,
  setSecondaryBgColor,
} from "../../../../components/card/hooks/styleSwitch/setStyle";
const appStore: any = useAppStore();

const {
  settings,
  styles,
  backgroundName,
  backgroundSettings,
} = storeToRefs(appStore);
const updateTransparent=(val)=>{
  settings.value.transparent=val
}
const themeModeList = [
  {
    name: "深色",
    value: false,
  },
  {
    name: "浅色",
    value: true,
  },
];
const { proxy } = getCurrentInstance();
//

// 更新主题
const updateThemeMode = (data) => {
  setThemeSwitch(data);
  setTheme()
};

const themeColor = ref("#508BFE");

const updateThemeColor = (value) => {
  setBgColor(value);
  setSecondaryBgColor(value);
  setThemeColor()
  completeTask("M0202",()=>{
    proxy.$bus.emit('closeSystemSet');
  });
};

onMounted(() => {
  themeColor.value = getBgColor() || "#508BFE";
});
</script>

<style lang="scss" scoped>

</style>
