<template>
  <XtTitle type="text">置顶</XtTitle>
  <Topic v-for="data in topList" :data="data"></Topic>
</template>

<script>
import Topic from "./topic.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["topList"]),
  },
  components: { Topic },
};
</script>

<style lang="scss" scoped></style>
