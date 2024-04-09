<!-- 控制中心底部栏 -->
<template>
  <div class="w-full flex items-center justify-center pb-4 px-4">
    <template v-for="item in bottomButton">
      <a-tooltip placement="top" :title="item.name">
        <xt-button
          w="54"
          h="54"
          style="border-radius: 12px"
          class="mr-3 button-item xt-bg-t-2 tt-container-box-1234"
          @click="item.fn"
        >
          <div class="flex items-center justify-center">
            <xt-new-icon :icon="item.newIcon" size="24" />
          </div>
        </xt-button>
      </a-tooltip>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { appStore } from "../../../store";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["close"]);
const router = useRouter();

const app = appStore();

const bottomButton = reactive([
  {
    newIcon: "fluent:person-16-regular",
    name: "用户中心",
    fn: () => {
      router.push({ path: "/my" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:lock-closed-16-regular",
    name: "锁屏",
    fn: () => {
      router.push({ path: "/lock" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:full-screen-maximize-16-regular",
    name: "全屏",
    fn: () => {
      app.toggleFullScreen();
    },
  },
  {
    newIcon: "fluent:power-20-filled",
    name: "电源",
    fn: () => {
      router.push({ path: "/power" });
      emit("close");
    },
  },
  {
    newIcon: "fluent:settings-16-regular",
    name: "设置",
    fn: () => {
      proxy.$bus.emit("openSystemSet");
      emit("close");
    },
  },
]);
</script>

<style lang="scss" scoped>
</style>