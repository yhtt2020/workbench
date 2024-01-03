<template>
  <Folder
    v-bind="newData"
    :expand="{
      disabled: true,
    }"
    :secondary="true"
  ></Folder>
</template>

<script setup>
import Folder from "../../index";
const props = defineProps({
  data: {},
});
const newData = {
  ...props.data,
};
newData.customData.size = "6x4";

// 860,420
</script>

<style lang="scss" scoped></style>
