<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :customSize="customData.customSize"
    :header="header"
    class="xt-theme-b"
  >
    {{ customData }}
    <p>id： {{ customIndex }}</p>
  </xt-container>
</template>

<script setup>
const header = {
  ifyIcon: "fluent:add-16-filled",
};
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
