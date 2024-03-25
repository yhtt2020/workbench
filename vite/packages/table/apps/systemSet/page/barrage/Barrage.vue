<template>
  <xt-option-box>
    <xt-option-info
      title="开启弹幕"
      isSwitch
      v-model:switch="appSettings.enableBarrage"
    />
    <hr />
    <xt-option-info title="页面允许渲染弹幕数量" />
    <div style="width: 220px">
      <xt-option-input v-model:input="appSettings.barrage.limit" />
    </div>
    <hr />
    <xt-option-info title="轨道高度" />
    <div style="width: 220px">
      <xt-option-input v-model:input="appSettings.barrage.height" />
    </div>
    <hr />
    <xt-option-info title="同一弹幕出现次数" />
    <div style="width: 220px">
      <xt-option-input v-model:input="appSettings.barrage.repeat" />
    </div>
    <hr />
    <xt-option-info title="弹幕方向" />

    <xt-option-tab
      :list="barrageList"
      v-model="appSettings.barrage.direction"
      circle
      style="margin-bottom: 16px; height: 40px"
    />
    <hr />
    <xt-option-info
      title="与想天浏览器当前页面联动"
      isSwitch
      v-model:switch="appSettings.barrage.browserLink"
    />
  </xt-option-box>
  <xt-button
    block
    icon="fluent:arrow-clockwise-16-regular"
    iconSize="20"
    @click="refresh"
    >刷新测试</xt-button
  >
  <XtOptionInfo />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { appStore as useAppStore } from "../../../../store";
import { message } from "ant-design-vue";
import { watch,getCurrentInstance,watchEffect, computed } from 'vue';
import { completeTask } from '../../../task/task';

const appStore: any = useAppStore();
const { settings: appSettings } = storeToRefs(appStore);
const { proxy } = getCurrentInstance();

const barrageList = [
  {
    name: "从右到左",
    value: "right",
  },
  {
    name: "从左到右",
    value: "left",
  },
];

const refresh = () => {
  if (!appSettings.value.enableBarrage) {
    window.$manager.show();
    window.$ui.confirm("当前未启用弹幕功能，需要启用后方可测试。", "", {
      okText: "启用并测试",
      type: "warning",
      okButtonWidth: 120,
      ok: () => {
        appSettings.value.enableBarrage = true;
        window.$manager.setOptions({
          ...appSettings.value.barrage,
        });
        window.$manager.test();
        message.success("刷新成功。");
      },
    });
  } else {
    window.$manager.hidden();
    window.$manager.setOptions({
      ...appSettings.value.barrage,
    });
    window.$manager.test();
    message.success("刷新成功。");
  }
};

watch(()=>appSettings.value.enableBarrage,(newV)=>{
  if(newV){
    window.$manager.test();
    window.$manager.show();
  }
  else {
    window.$manager.hidden();
  }
  completeTask("M0204",()=>{ proxy.$bus.emit('closeSystemSet');});
})
</script>

<style lang="scss" scoped></style>
