<template>
  <xt-modal v-if="expandVisible" custom v-model="expandVisible" boxClass="" @close="expandClose">
    <Folder
      v-bind="newData"
      :expand="{
        disabled: true,
      }"
      :secondary="true"
    ></Folder>
  </xt-modal>
</template>

<script setup>
import Folder from "../../index";
const expandVisible = true;

const props = defineProps({
  data: {},
});
const newData = {
  ...props.data,
  modalSize: "6x5",
};
newData.customData.modalSize = "6x5";

const emits = defineEmits(["close"]);
const expandClose = () => {
  console.log('123 :>> ', 123);
  emits("close");
};

// 860,420
</script>

<style lang="scss" scoped></style>
