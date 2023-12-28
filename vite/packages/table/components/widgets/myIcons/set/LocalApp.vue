<template>
  <xt-button @click="LocalAppClick" class="xt-bg-t-2 mb-3 pb-3" block h="40"
    >本地应用</xt-button
  >
  <input style="display: none" ref="fileRef" type="file" multiple />
</template>

<script setup>
import { ref } from "vue";

const emits = defineEmits(["onLocalApp"]);
const fileRef = ref(null);
const LocalAppClick = () => {
  fileRef.value.click();

  fileRef.value.onchange = async function (files) {
    if (files.length === 0) {
      this.clear();
      return;
    }
    const file = this.files[0];
    const icon = await tsbApi.system.extractFileIcon(file.path);
    const localApp = {
      type: "tableApp",
      name: file.name,
      value: file.path,
      icon,
    };
    emits("onLocalApp", localApp);
  };
};
</script>

<style lang="scss" scoped></style>
