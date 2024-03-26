<template>
  <xt-input
    class="xt-bg-t-2 xt-b w-full"
    style="height: 40px"
    v-model="currentInput"
    @blur="updateInput"
    @keyup.enter="enterInput"
    :readonly="readonly"
  />
  <div class="pb-4"></div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
interface inputProps {
  input: any;
  readonly: boolean;
}

const props = withDefaults(defineProps<inputProps>(), {});

watch(
  () => props.input,
  (value) => {
    console.log("1111 :>> ", 1111);
    currentInput.value = value;
  }
);
const enterInput = () => {
  emits("enter", currentInput.value);
};
const currentInput = ref(props.input);
const emits = defineEmits(["update:input", "enter", "cb"]);
const updateInput = () => {
  emits("update:input", currentInput.value);
  emits("cb", currentInput.value);
};
</script>

<style lang="scss" scoped></style>
