<template>
  <div style="width: 355px">
    <div class="flex justify-between items-center mb-3 h-full">
      <div class="text-base flex items-center">
        <!-- <xt-ify-icon size="24" icon="fluent-emoji:star" class="mr-2" /> -->
        点击打开调整桌面布局
      </div>
      <xt-ify-icon
        @click="close()"
        size="28"
        icon="fluent:dismiss-circle-16-filled"
      />
    </div>
    <div></div>
    <div class="flex justify-between mt-3">
      <div></div>
      <xt-button
        @click="go()"
        type="theme"
        w="84"
        h="32"
        radius="8"
        :plain="true"
      >
        调整布局
      </xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import XtButton from "../../ui/libs/button/index.vue";
import XtIfyIcon from "../../ui/new/IfyIcon/index.vue";
const { proxy } = getCurrentInstance();
import { useDeskStore } from "../../components/desk/store";
const deskStore = useDeskStore();
const emits = defineEmits(["close-toast"]);
const close = () => {
  emits("close-toast");
};
const go = () => {
  deskStore.adjustLayout = true;

  console.log("proxy.$bus :>> ", proxy.$bus);
  emits("close-toast");
};
</script>

<style lang="scss" scoped></style>
