<template>
  <Modes v-if="isMode"></Modes>
  <Use v-else></Use>
</template>

<script>
import Modes from "./Modes.vue";
import Use from "./Use.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isMode"]),
  },
  components: {
    Modes,
    Use,
  },
};
</script>

<style lang="scss" scoped></style>
