<template>
  <Dialog v-model:name="value.name" v-model:icon="value.icon"></Dialog>
  <div class="flex justify-evenly mt-4">
    {{ data }}
    <XtButton w="200">清空对话记录</XtButton>
    <XtButton w="200">删除对话</XtButton>
  </div>
</template>

<script>
import Dialog from "../components/Dialog.vue";
export default {
  components: {
    Dialog,
  },
  props: {
    data: {},
  },
  data() {
    return {
      value: { ...this.data },
    };
  },
};
</script>

<style lang="scss" scoped></style>
