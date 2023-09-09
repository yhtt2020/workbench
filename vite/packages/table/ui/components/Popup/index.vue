<template>
  <teleport to="body">
    <!-- 蒙版 -->
    {{ position }}
    <transition name="fade">
      <div
        v-if="visible"
        class="h-full w-full xt-mask fixed top-0 left-0 ring-0 bottom-0"
        style="z-index: 999"
        @click="visible = false"
      ></div>
    </transition>
    <!-- 内容 -->
    <transition name="popup">
      <div
        v-if="visible"
        class="h-full bg-white-50 fixed top-1/2 -translate-y-1/2 rounded-xl"
        style="z-index: 9999; box-sizing: border-box"
        :style="{ [position]: '0' }"
      >
        <slot> </slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {},
  position: {
    default: "right",
  },
});
const visible = ref(props.modelValue);
const emits = defineEmits("update:modelValue");
watch(visible, (newW) => {
  emits("update:modelValue", newW);
});
watch(
  () => props.modelValue,
  (newW) => {
    visible.value = newW;
  }
);
</script>

<style lang="scss" scoped>
// 进入 离开
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
// 准备进入 离开完成
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s;
}
.popup-enter-from,
.popup-leave-to {
  transform: translate(100%);
  // transform: all 0.3s;
}
</style>
