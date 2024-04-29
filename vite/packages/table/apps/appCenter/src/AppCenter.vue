<script setup lang="ts">
import { ref, computed } from "vue";
import Developer from "./views/developer/Developer.vue";
import { useAppCenterStore } from "./store";
import { useTTAppStore } from "../../ttApp/src/store";
import { storeToRefs } from "pinia";
const ttappStore = useTTAppStore();
const appCenterStore = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
// 左侧对应组件
const components = ref({
  Developer,
});
// 当前渲染组件
const currentCom = ref("Developer");

// 显示应用中心
// 左侧菜单列表
const leftMenuList = computed(() => {
  const list = [
    {
      newIcon: "fluent:grid-20-regular",
      callBack: () => {
        switchCurrentCom("");
      },
    },
    {
      newIcon: "fluent:building-shop-16-regular",
      callBack: () => {
        switchCurrentCom("");
      },
    },
    {
      newIcon: "fluent:desktop-16-regular",
      callBack: () => {
        switchCurrentCom("");
      },
    },
    {
      newIcon: "fluent:hard-drive-16-regular",
      callBack: () => {
        switchCurrentCom("");
      },
    },
    {
      newIcon: "fluent:code-16-regular",
      callBack: () => {
        console.log("123 :>> ", 123);
        switchCurrentCom("Developer");
      },
    },
    {
      newIcon: "fluent:settings-16-regular",
      callBack: () => {
        switchCurrentCom("");
      },
    },
  ];
  return list;
});
// 切换组件
const switchCurrentCom = (name: string) => {
  currentCom.value = name;
};
import { useStatus } from "../../../hooks";
const { status, validate } = useStatus();
const a = validate(["guest", "offline"]);
// useENV
</script>

<template>
  <xt-modal v-model="visible" index="1200" custom :mask="false">
    <div style="width: 1000px; height: 720px">
      <xt-button>{{ status }}</xt-button>

      <div v-if="status == 'guest'">我是游客模式</div>
      <div v-else>我是在线模式</div>
      {{ a }}
      <div v-if="a">数组形式游客模式</div>
      <div v-else>数组形式在线模式</div>
      <!-- 左侧菜单容器 -->
      <xt-left-menu
        :list="leftMenuList"
        :end="2"
        :last="4"
        fn="fn"
        leftBg="red"
      >
        <div class="w-full h-full py-4 pr-4">
          <div v-if="currentCom !== 'Developer'">无暂未开发</div>
          <component v-else :is="components[currentCom]" />
        </div>
      </xt-left-menu>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
