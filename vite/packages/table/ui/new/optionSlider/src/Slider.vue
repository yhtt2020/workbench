<template>
  <div class="flex items-center">
    <div class="w-full mr-4">
      <a-slider
        :min="min"
        :max="max"
        :step="step"
        :tooltipOpen="true"
        v-model:value="currentSlider"
      />
    </div>
    <a-input-number
      v-model:value="currentSlider"
      :min="min"
      :max="max"
      :step="step"
      class="xt-bg-t-2 xt-b"
    ></a-input-number>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
interface sliderProps {
  slider: any;
  min: number;
  max: number;
  step: number;
}
const props = withDefaults(defineProps<sliderProps>(), {
  min: 1,
  max: 100,
  step: 1,
});

const currentSlider = ref(props.slider);
const emits = defineEmits(["update:slider"]);

watch(currentSlider, (newV) => {
  emits("update:slider", currentSlider.value);
});
</script>

<style lang="scss" scoped>
:deep(.ant-input-number) {
  width: 105px !important;
  border-radius: 10px;
  overflow: hidden;
  height: 40px;
  &:hover {
    border: none !important;
  }
}
:deep(.ant-input-number-input) {
  height: 40px;
  line-height: 40px;
}
</style>
