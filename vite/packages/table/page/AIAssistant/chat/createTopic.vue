<template>
  <div style="width: 392px" class="">
    <Dialog></Dialog>
    <div class="flex justify-center mt-1">
      <div class="w-120 h-12 xt-btn mr-3">取消</div>
      <div class="w-120 h-12 xt-active-btn">确认</div>
    </div>
  </div>
</template>

<script>
import Dialog from "./components/Dialog.vue";
import { iconList } from "./topic";
export default {
  components: {
    Dialog,
  },
  data() {
    return {
      iconList,
    };
  },
};
</script>

<style lang="scss" scoped></style>
