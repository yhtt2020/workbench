<template></template>
<script setup>
import { ref } from "vue";
import { Modal } from "ant-design-vue";

const modal = Modal.info();

modal.update({
  title: "修改的标题",
  centered: true,
  content: "修改的内容",
  maskClosable: true,
  zIndex: 999999999999999,
});

const props = defineProps({
  modelValue: {},
});
const emits = defineEmits(["ok"]);
const visible = ref(props.modelValue);
const showModal = () => {
  visible.value = true;
};
const handleOk = (e) => {
  console.log(e);
  visible.value = false;
  emits("ok");
};
</script>
<style lang="scss">
:deep(.ant-modal-body) {
  padding: 0 !important;
}

.box {
  :deep(.ant-modal) {
    z-index: 9999999999 !important;
  }
  :deep(.ant-modal-body) {
    padding: 0 !important;
  }
}
</style>
