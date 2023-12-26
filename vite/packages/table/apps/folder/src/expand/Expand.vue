<template>
  <Folder
    v-bind="newData"
    :expand="{
      disabled: true,
    }"
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
newData.customData.cardSize = {
  name: "860,630",
  width: 3,
  height: 3,
};


// 860,420
</script>

<style lang="scss" scoped></style>
