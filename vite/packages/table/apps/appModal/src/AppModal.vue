<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  toRefs,
  inject,
} from "vue";
import { storeToRefs } from "pinia";
import { useAppModalStore } from "./store";
const isInit = ref(true);
const init = () => {
  isInit.value = false;
};
onMounted(() => {
  setTimeout(() => {}, 51);
});
onUnmounted(() => {
  data.value.props = null;
});
const props = defineProps<{
  name: any;
}>();

const appModalStore: any = useAppModalStore();
const { runList }: any = storeToRefs(appModalStore);
const data: any = ref(null);
data.value = appModalStore.getApp(props.name);
// 弹窗ref
const modal: any = ref(null);
// 是否最大化
const fullscreen = () => {
  data.value.isMaximize = false;
  data.value.isFullScreen = !data.value.isFullScreen;
  modal.value?.fullscreen();
};
const maximize = () => {
  data.value.isFullScreen = false;
  data.value.isMaximize = !data.value.isMaximize;
  modal.value?.maximize();
};
const minimize = () => {
  modal.value?.minimize();
};
const close = () => {
  appModalStore.getApp(data.value.name).visible = false;
};

const modalStyle = computed(() => {
  if (!data.value) return;
  if ((data.value.isMaximize || data.value.isFullScreen) && !isInit.value) {
    return {
      "flex-grow": 1,
      height: "100%",
    };
  }
  return {
    width: data.value?.width || "500px",
    height: data.value?.height || "500px",
  };
});
</script>

<template>
  <xt-modal
    v-if="data && data?.visible"
    v-model="data.visible"
    @close="close"
    @init="init"
    ref="modal"
    index="1200"
    handle=".xt-modal-header"
    min
    max
    full
    esc
    boxClass=""
    headerClass="p-2 xt-modal"
    :mask="false"
    v-model:isFullScreen="data.isFullScreen"
    v-model:isMaximize="data.isMaximize"
  >
    <template #minimize-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="28" :src="data.icon" />
      </div>
      <div class="mr-2 xt-text truncate" style="max-width: 70px">
        {{ data.cname }}
      </div>
    </template>
    <template #header>
      <header
        class="no-drag h-12 flex justify-between items-center px-4 xt-main-bg xt-modal-header"
        style="border-radius: 12px 12px 0 0"
      >
        <div class="flex items-center">
          <xt-mix-icon :icon="data.icon" :type="data.iconType" class="mr-2" />
          {{ data?.cname }}
        </div>
        <div class="flex items-center">
          <xt-mix-icon
            icon="fluent:subtract-16-regular"
            @click="minimize"
            boxSize="32"
            style="background: none"
          />

          <xt-mix-icon
            :icon="
              data.isMaximize
                ? 'fluent:full-screen-minimize-16-filled'
                : 'fluent:full-screen-maximize-16-regular'
            "
            @click="maximize"
            boxSize="32"
            style="background: none"
            class="mx-3"
          />

          <xt-mix-icon
            :icon="
              data.isFullScreen
                ? 'fluent:arrow-minimize-16-regular'
                : 'fluent:arrow-maximize-16-regular'
            "
            @click="fullscreen"
            boxSize="32"
            style="background: none"
            class="mr-3"
          />
          <xt-mix-icon
            icon="fluent:dismiss-16-regular"
            @click="close"
            boxSize="32"
            style="background: none"
          />
        </div>
      </header>
    </template>
    <div class="flex flex-col h-full">
      <div
        class="flex flex-grow"
        style="max-height: calc(100% - 0px)"
        :style="[modalStyle]"
      >
        <!-- 原先max-height: -50px -->
        <router-view :name="data?.name" :props="data?.props"></router-view>
      </div>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
