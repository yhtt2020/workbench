<template>
  <div class="h-full w-full">
    <Main></Main>
  </div>
</template>

<script>
import Main from "./main/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: {
    Main,
  },
  async mounted() {},
};
</script>

<style lang="scss" scoped></style>
