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

const maximize = () => {
  isMaximize.value = !isMaximize.value;
  modal.value?.maximize();
};
const close = () => {
  appModalStore.getApp("ai").visible = false;
};

const appModalStore: any = useAppModalStore();
const { runList }: any = storeToRefs(appModalStore);

const data: any = ref(null);
data.value = appModalStore.getApp(props.name);
console.log("data.value :>> ", data.value);
const modalStyle = computed(() => {
  if (!data.value) return;
  if (isMaximize.value) {
    return {
      "flex-grow": 1,
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
    <div class="flex flex-col h-full">
      <div
        class="h-12 flex justify-between items-center px-4 xt-main-bg  xt-modal-header"
        style="border-radius: 12px 12px 0 0"
      >
        <div class="flex items-center">
          <xt-mix-icon :icon="data.icon" :type="data.iconType" class="mr-2" />
          {{ data?.cname }}
        </div>
        <div class="flex items-center">
          <!-- <xt-mix-icon icon="fluent:subtract-16-regular" @click="" />
          <xt-mix-icon
            :icon="
              isMaximize
                ? 'fluent:full-screen-minimize-16-filled'
                : 'fluent:full-screen-maximize-16-regular'
            "
            @click="maximize"
          /> -->
          <xt-mix-icon icon="fluent:dismiss-16-regular" @click="close" />
        </div>
      </div>
      <!-- <div class="xt-theme-bg flex-grow"></div> -->
      <div class="flex flex-grow" style="" :style="[modalStyle]">
        <router-view :name="data?.name"></router-view>
      </div>
    </div>
  </xt-modal>
</template>
<style lang="scss" scoped></style>
