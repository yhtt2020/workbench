<template>
  <component :is="selectTab" class="w-full h-full"></component>
</template>

<script>
import Chat from "../chat/index.vue";
import Model from "../model/index.vue";
import Account from "../account/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTab"]),
  },
  components: {
    Chat,
    Model,
    Account,
  },
};
</script>

<style lang="scss" scoped></style>
