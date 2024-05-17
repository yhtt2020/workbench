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
const props = defineProps<{
  name: any;
}>();
// 弹窗ref
const modal: any = ref(null);
// 是否最大化
const isMaximize: any = ref(false);
const isFullScreen = ref(false);
const fullScreen = () => {
  isMaximize.value = false;
  isFullScreen.value = !isFullScreen.value;
  modal.value?.fullScreen();
};
const maximize = () => {
  isFullScreen.value = false;
  isMaximize.value = !isMaximize.value;
  modal.value?.maximize();
};
const minimize = () => {
  modal.value?.minimize();
};
const close = () => {
  appModalStore.getApp("ai").visible = false;
};

const appModalStore: any = useAppModalStore();
const { runList }: any = storeToRefs(appModalStore);

const data: any = ref(null);
data.value = appModalStore.getApp(props.name);

const modalStyle = computed(() => {
  if (!data.value) return;
  if (isMaximize.value || isFullScreen.value) {
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
    ref="modal"
    index="1200"
    handle=".xt-modal-header"
    min
    max
    esc
    boxClass=""
    headerClass="p-2 xt-modal"
    :mask="false"
    custom
  >
    <template #minimize-left>
      <div class="mr-2 rounded-lg overflow-hidden">
        <a-avatar shape="square" class="" :size="28" :src="data.icon" />
      </div>
      <div class="mr-2 xt-text truncate" style="max-width: 70px">
        {{ data.cname }}
      </div>
    </template>
    <!-- <a-dropdown
            placements="bottom"
            :overlayStyle="{
              'z-index': '999999999 !important',
            }"
          >
            <div>
              <xt-mix-icon
                :icon="
                  isMaximize
                    ? 'fluent:full-screen-minimize-16-filled'
                    : 'fluent:full-screen-maximize-16-regular'
                "
                @click="maximize"
                boxSize="32"
                style="background: none"
                class="mx-3"
              />
            </div>
            <template #overlay>
              <div style="width: 200px; height: 200px; background: red"></div>
            </template>
          </a-dropdown> -->
    <div class="flex flex-col h-full">
      <header
        class="h-12 flex justify-between items-center px-4 xt-main-bg xt-modal-header"
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
              isMaximize
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
              isFullScreen
                ? 'fluent:arrow-minimize-16-regular'
                : 'fluent:arrow-maximize-16-regular'
            "
            @click="fullScreen"
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
      <div
        class="flex flex-grow"
        style="max-height: calc(100% - 50px)"
        :style="[modalStyle]"
      >
        <router-view :name="data?.name"></router-view>
      </div>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
