<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted ,watch, defineAsyncComponent} from "vue";
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
const { visible, current } = storeToRefs(appCenterStore);

// 左侧对应组件
const components = ref({
  Developer,
  Setting,
  MyApps,
  Apps,
  Market,
});
// 当前渲染组件
const currentCom = ref("MyApps");

// 显示应用中心
// 左侧菜单列表
const leftMenuList = computed(() => {
  const list = [
    {
      newIcon: "fluent:grid-20-regular",
      name:'我的应用',
      id:'MyApps',
      callBack: () => {
        switchCurrentCom("MyApps");
      },
    },
    {
      newIcon: "fluent:building-shop-16-regular",
      name:'应用市场',
      id:'Market',
      callBack: () => {
        switchCurrentCom("Market");
      },
    },
    {
      newIcon: "fluent:desktop-16-regular",
      name:'实用软件',
      id:'Apps',
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
      name:'开发者',
      id:'Developer',
      callBack: () => {
        console.log("123 :>> ", 123);
        switchCurrentCom("Developer");
      },
    },
    {
      newIcon: "fluent:settings-16-regular",
      name:'设置',
      id:'Setting',
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

// 导航栏中的开始中心跳转到指定页面
onMounted(() => {
  switchCurrentCom(current.value);
})

// 初始化
onUnmounted(() => {
  current.value = "MyApps"
})
</script>

<template>
  <xt-modal v-model="visible" index="1200" custom :mask="false">
    <div style="width: 1000px; height: 720px">
      <!-- 左侧菜单容器 -->
      <xt-left-menu
        :list="leftMenuList"
        end="2"
        fn="fn"
        leftBg="red"
        model="id"
        v-model:index="currentCom"
        leftClass="xt-main-bg py-3"
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
