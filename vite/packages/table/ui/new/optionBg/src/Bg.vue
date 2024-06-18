<template>
  <xt-option-tab
    v-model="currentMode"
    @cb="updateCurrentMode"
    :list="tabList"
    circle
    class="mb-4"
    style="height: 40px"
  />
  <template v-if="currentMode === 'img'">
    <xt-button
      w="200"
      h="112"
      class="xt-bg-m relative mb-4"
      style="border-radius: 6px"
      @click="openPaperModal"
    >
      <div class="flex items-center justify-center" v-if="currentImgValue === ''">
        <xt-new-icon icon="fluent:add-16-regular" size="20"></xt-new-icon>
      </div>
      <div v-else class="w-full h-full absolute top-0 left-0 rounded-md">
        <img
          :src="currentImgValue"
          class="w-full h-full object-cover rounded-md"
        />
      </div>
    </xt-button>
  </template>

  <template v-else>
    <div class="flex">
      <xt-option-color
        v-model:color="currentColorValue"
        @cb="updateColorValue"
      />
    </div>
  </template>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeMount,
  getCurrentInstance,
} from "vue";
const { proxy } = getCurrentInstance();
const emit = defineEmits([
  "update:mode",
  "update:value",
  "modeCb",
  "imgValueCb",
  "colorValueCb",
]);
onMounted(() => {
  proxy.$bus.on("independentBg", (val) => {
    updateImgValue(val);
  });
});

const props = defineProps({
  mode: {
    type: String,
    default: "img",
  },
  imgValue: {},
  colorValue: {},
});

watch(
  () => props.mode,
  (val) => {
    currentMode.value = val;
  }
);
watch(
  () => props.imgValue,
  (val) => {
    currentImgValue.value = val;
  }
);
watch(
  () => props.colorValue,
  (val) => {
    currentColorValue.value = val;
  }
);
const updateCurrentMode = (val) => {
  emit("update:mode", val);
  emit("modeCb", val);
};
const currentImgValue = ref(props.imgValue);
const updateImgValue = (val) => {
  emit("update:imgValue", val);
  emit("imgValueCb", val);
};
const currentColorValue = ref(props.colorValue);
const updateColorValue = (val) => {
  emit("update:colorValue", val);
  emit("colorValueCb", val);
};

onBeforeMount(() => {
  proxy.$bus.off("independentBg");
});
import { useAppModal } from "../../../../apps/appModal/src/hook/useAppModal";

const tabList = ref([
  { name: "图片", value: "img" },
  { name: "纯色", value: "color" },
]);

const currentValue = ref(props.value);
const currentMode = ref(props.mode);

// 触发打开壁纸弹窗
const openPaperModal = () => {
  useAppModal("galleryModalApp").openApp({
    independent: true,
  });
};
</script>

<style lang="scss" scoped>
:deep(.nav-box) {
  border-radius: 8px !important;
}
</style>
