<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";
import Developer from "./views/developer/Developer.vue";
import { useAppCenterStore } from "./store";
import { useTTAppStore } from "../../ttApp/src/store";
import { storeToRefs } from "pinia";

const Setting = defineAsyncComponent(() => import('./views/setting/Setting.vue'))
const MyApps = defineAsyncComponent(() => import('./views/myApps/MyApps.vue'))
const Apps = defineAsyncComponent(() => import('./views/apps/Apps.vue'))
const Market = defineAsyncComponent(() => import('./views/market/Market.vue'))

const ttappStore = useTTAppStore();
const appCenterStore = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
// 左侧对应组件
const components = ref({
  Developer,
  Setting,
  MyApps,
  Apps,
  Market,
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
        switchCurrentCom("MyApps");
      },
    },
    {
      newIcon: "fluent:building-shop-16-regular",
      callBack: () => {
        switchCurrentCom("Market");
      },
    },
    {
      newIcon: "fluent:desktop-16-regular",
      callBack: () => {
        switchCurrentCom("Apps");
      },
    },
    // 软件库暂时隐藏
    // {
    //   newIcon: "fluent:hard-drive-16-regular",
    //   callBack: () => {
    //     switchCurrentCom("");
    //   },
    // },
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
        switchCurrentCom("Setting");
      },
    },
  ];
  return list;
});
// 切换组件
const switchCurrentCom = (name: string) => {
  currentCom.value = name;
};
</script>

<template>
  <xt-modal v-model="visible" index="1200" custom :mask="false">
    <div style="width: 1000px; height: 720px">
      <!-- 左侧菜单容器 -->
      <xt-left-menu
        :list="leftMenuList"
        :end="2"
        :last="3"
        fn="fn"
        leftBg="red"
      >
        <div class="w-full h-full py-4 pr-4">
          <!-- <div v-if="currentCom !== 'Developer'">无暂未开发</div> -->
          <component :is="components[currentCom]" />
        </div>
      </xt-left-menu>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
