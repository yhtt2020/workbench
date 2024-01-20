<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :customSize="customData.customSize"
  >
    {{ customData }}
  </xt-container>
</template>

<script setup>
const props = defineProps({
  customIndex: {},
  customData: {
    default: () => {
      return {
        customSize: "2x2",
        name: "",
      };
    },
  },
});
</script>

<style lang="scss" scoped></style>
