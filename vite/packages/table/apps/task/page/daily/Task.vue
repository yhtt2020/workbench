<template>
  <div
    class="xt-bg-2 rounded-xl w-full flex items-center p-4"
    style="height: 54px"
  >
    <xt-ify-icon :icon="types[type]" size="20" />
  </div>
</template>

<script setup>
const props = defineProps({
  type: {},
  info: {},
});
const types = {
  monthly: {
    icon: "",
  },
  weekly: {
    icon: "",
  },
  daily: {
    name: "",
    icon: "",
  },
};
</script>

<style lang="scss" scoped></style>
