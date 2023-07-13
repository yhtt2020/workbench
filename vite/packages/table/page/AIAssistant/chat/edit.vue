<template>
  <Dialog></Dialog>
  <div class="flex    justify-evenly mt-4">
    <XtButton w="200">清空对话记录</XtButton>
    <XtButton w="200">删除对话</XtButton>
  </div>
</template>

<script>
import Dialog from "./components/Dialog.vue";
export default {
  components: {
    Dialog,
  },
  data() {
    return {
      search: "",
    };
  },
};
</script>

<style lang="scss" scoped></style>
