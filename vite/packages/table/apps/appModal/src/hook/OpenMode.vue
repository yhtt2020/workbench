<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useAppModalStore } from "../store";
const appModalStore: any = useAppModalStore();
const { runList } = storeToRefs(appModalStore);
const props = defineProps<{
  name: string;
}>();

const app = ref("");
app.value = appModalStore.getApp(props.name) || "";
const openModeList = ref([
  {
    name: "应用模式",
    value: "default",
  },
  {
    name: "弹窗模式",
    value: "modal",
  },
]);
</script>

<template>
  <xt-option-box>
    <xt-option-info title="打开方式" info="修改后再下次打开后生效。" />
    <xt-option-tab
      v-model="app.openMode"
      :list="openModeList"
      circle
      style="height: 40px"
    />
    <!-- @cb="updateOpenMode" -->
  </xt-option-box>
</template>
<style lang="scss" scoped></style>
