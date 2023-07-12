<template>
  <component :is="selectTab" class="w-full h-full"></component>
</template>

<script>
import Chat from "../chat/Header.vue";
import Model from "../model/header/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTab"]),
  },
  components: {
    Chat,
    Model,
  },
};
</script>

<style lang="scss" scoped></style>
