<template>
  <div class="rounded-xl "
  
  :class="isFull ? '' : 'p-3 xt-bg'">
    <Header></Header>
    <component :is="model"></component>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Default from "./defalut/index.vue";
import My from "./user/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["model"]),
  },
  components: {
    Header,
    Default,
    My,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
