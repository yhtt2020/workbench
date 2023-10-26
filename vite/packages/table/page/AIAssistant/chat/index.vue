<template>
  <div class="h-full w-full">
    <!-- <Main></Main> -->
    <div></div>
  </div>
</template>

<script>
import Main from "./main/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  data() {
    return {
      showRightPanel: false,
    };
  },
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: {
    Main,
  },
};
</script>

<style lang="scss" scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
