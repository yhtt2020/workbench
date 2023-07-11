<template>
  <div class="ml-4 xt-btn w-12 h-12 cursor-pointer" @click="fullClick()">
    <Icon icon="fullscreen" style="font-size: 26px"></Icon>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  methods: {
    fullClick() {
      this.isFull = !this.isFull;
    },
  },
};
</script>

<style scoped></style>
