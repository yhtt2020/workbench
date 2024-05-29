<!-- 添加社群新应用组件 包含频道目录选择-->
<template>
  <xt-modal
    v-if="newAppVisible"
    v-model="newAppVisible"
    title="添加新应用"
    @close="newAppVisible = false"
  >
    <AddModalBody
      :no="no"
      @enterNext="openNewAppNext"
      @close="newAppVisible = false"
    />
  </xt-modal>
</template>

<script setup>
import { nextTick, ref, toRefs } from "vue";
import AddModalBody from "./newapp/AddModalBody.vue";
const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);
const emit = defineEmits(["next"]);
// 添加新应用弹窗打开
const newAppVisible = ref(false);
const openAddNewApp = () => {
  newAppVisible.value = true;
};
// 触发下一个弹窗
const openNewAppNext = (data) => {
  emit("next", data);
  newAppVisible.value = false;
};
defineExpose({
  openAddNewApp,
});
</script>

<style lang="scss" scoped>
</style>