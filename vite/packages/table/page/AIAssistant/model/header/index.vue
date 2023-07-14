<template>
  <Use v-if="isModel"></Use>
  <Model v-else></Model>
</template>

<script>
import Model from "./Model.vue";
import Use from "./Use.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isModel"]),
  },
  components: {
    Model,
    Use,
  },
};
</script>

<style lang="scss" scoped></style>
