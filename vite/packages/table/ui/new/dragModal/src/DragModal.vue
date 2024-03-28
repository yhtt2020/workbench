<script setup lang="ts">
import { ref, computed } from "vue";
const style = computed(() => {
  if (isSwitch.value) {
    return {
      width: "100px",
      height: "100px",
    };
  } else {
    return {
      width: "100%",
      height: "100%",
    };
  }
});
const isSwitch = ref(false);
</script>

<template>
  <!-- <Teleport to="body"> -->
  <xt-drag :parent="false">
    <div class="xt-theme-b" :style="style">
      21321322
      <xt-button>切换</xt-button>
    </div>
  </xt-drag>
  <!-- </Teleport> -->
</template>
<style lang="scss" scoped></style>
