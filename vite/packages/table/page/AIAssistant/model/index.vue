<template>
  <div class="rounded-xl" :class="isFull ? '' : 'p-3 xt-bg'">
    <!-- <div>
      {{ isModel }}
      <a-button @click="isModel = !isModel">click</a-button>
    </div> -->
    <template v-if="isModel">
      <Use></Use>
    </template>
    <template v-else>
      <component :is="model"></component>
    </template>
  </div>
</template>

<script>
import Default from "./defalut/index.vue";
import My from "./user/index.vue";
import Use from "./use/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["model", "isFull", "isModel"]),
  },
  components: {
    Default,
    My,
    Use,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
