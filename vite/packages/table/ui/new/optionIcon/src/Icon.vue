<template>
  <div class="flex items-center">
    <div class="" style="width: 40px">
      <xt-icon-show
        class="xt-b"
        :maskIndex="99999999"
        :bg="bg"
        v-model="currentIcon"
        boxR="10px"
        :click="true"
        :upload="true"
        @cb="updateIcon"
      ></xt-icon-show>
    </div>
    <div class="ml-3" style="width: 100%; height: 40px">
      <xt-input
        class="xt-b xt-bg-t-2"
        v-model="currentInput"
        @blur="updateInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
const props = defineProps({
  icon: {
    type: String,
    default:
      "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn",
  },
  bg: {
    default: "var(--main-bg)",
  },
  input: {},
});
const { icon } = toRefs(props);
const currentIcon = ref(props.icon);
const currentInput = ref(props.input);
const emits = defineEmits(["update:icon", "cb", "update:input"]);
const updateIcon = (icon) => {
  currentIcon.value = icon;

  console.log("icon :>> ", icon);
  emits("update:icon", icon);
  emits("cb", icon);
};

const updateInput = () => {
  emits("update:input", currentInput.value);
};

watch(
  () => icon.value,
  (newV) => {
    currentIcon.value = newV;
  }
);
</script>

<style lang="scss" scoped></style>
