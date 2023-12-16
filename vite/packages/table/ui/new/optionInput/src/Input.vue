<template>
  <xt-input
    class="xt-bg-t-2 xt-b"
    style="height: 40px"
    v-model="currentInput"
    @blur="updateInput"
  />
  <div class="pb-3"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface inputProps {
  input: any;
}
const props = withDefaults(defineProps<inputProps>(), {});

const currentInput = ref(props.input);
const emits = defineEmits(["update:input"]);
const updateInput = () => {
  emits("update:input", currentInput.value);
};
</script>

<style lang="scss" scoped></style>
