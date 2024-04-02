<script setup lang="ts">
import { ref, computed } from "vue";
import Developer from "./views/developer/Developer.vue";
import { useAppCenterStore } from "./store";
import { storeToRefs } from "pinia";
const appCenterStore = useAppCenterStore();
const { visible } = storeToRefs(appCenterStore);
defineProps<{
  modelValue: boolean;
}>();
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
        console.log("123 :>> ", 123);
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
</script>

<template>
  <xt-modal v-model="visible" index="9999" custom>
    <div style="width: 1000px; height: 720px">
      <!-- 左侧菜单容器 -->
      <xt-left-menu
        :list="leftMenuList"
        :end="2"
        :last="4"
        fn="fn"
        leftBg="red"
      >
        <div class="w-full h-full xt-theme-b py-4 pr-4">
          <component :is="components[currentCom]" />
        </div>
      </xt-left-menu>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
