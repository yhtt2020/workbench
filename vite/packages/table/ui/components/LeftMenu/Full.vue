<template>
  <xt-icon
    :icon="icon"
    w="40"
    size="20"
    radius="10"
    :type="type"
    @click="data = !data"
  ></xt-icon>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { appStore } from "../../../store";
const store = appStore();
const props = defineProps({
  type: { default: "default" },
});
const data = ref(false);

const icon = computed(() => {
  store.fullScreen = data.value ? true : false;
  return data.value ? "quxiaoquanping_huaban" : "quanping_huaban";
});
</script>

<style lang="scss" scoped></style>
