<template>
  <xt-select v-model="currentSelect" :list="list" class="xt-bg-t-2"></xt-select>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
interface selectProps {
  select: any;
  list: any;
}
const props = withDefaults(defineProps<selectProps>(), {});

const currentSelect = ref(props.select);
const emits = defineEmits(["update:select", "cb"]);

watch(currentSelect, (val) => {
  emits("update:select", val);
  emits("cb", val);
});
</script>

<style lang="scss" scoped></style>
