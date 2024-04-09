<!-- 控制中心主页 -->
<template>
  <div
    id="controlId"
    ref="modalRef"
    class="flex flex-col justify-between rounded-xl control-container xt-shadow tt-container-box-1234"
  >
    <!-- 控制中心头部操作 -->
    <ControlHeader />
    <!-- 控制中心主体 -->
    <ControlBody />
    <!-- 分割线 -->
    <div class="mt-2 mb-4 px-4" style="width:100%;">
      <div class="w-full mx-auto xt-bb"></div>
    </div>
    <!-- 控制中心底部按钮操作 -->
    <ControlFooter @close="closeControl" />
  </div>
</template>

<script setup>
import { onMounted,getCurrentInstance } from "vue";
import { controlStore } from "../hooks/controlStore";

import ControlHeader from "../components/ControlHeader.vue";
import ControlFooter from "../components/ControlFooter.vue";
import ControlBody from "../components/ControlBody.vue";

const emit = defineEmits(["close"]);
const { proxy } = getCurrentInstance();
const control = controlStore();

// 关闭
const closeControl = () => {
  emit("close");
};

onMounted(() => {
  // 初始化
  control.initControlList();
  // 关闭控制中心
  proxy.$bus.on("closeControl", closeControl);
});
</script>

<style lang="scss" scoped>
.control-container {
  backdrop-filter: blur(50px);
  background: var(--primary-bg);
  width: 548px;
  border: 1px solid var(--divider);
}
</style>