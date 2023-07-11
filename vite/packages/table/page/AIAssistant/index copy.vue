<template>
  <div class="flex w-full h-full p-3 xt-text">
    <!-- 左侧 Tab -->
    <Tab style="width: 150px; margin-right: 10px"></Tab>
    <MainView v-if="!isFull"></MainView>
  </div>
  <FullScreen v-if="isFull"></FullScreen>
</template>

<script>
import MainView from "./core/MainView.vue";
import FullScreen from "./full/index.vue";
import Tab from "./components/Tab.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, [ "isFull"]),
  },
  components: { Tab, MainView, FullScreen },
};
</script>

<style lang="scss" scoped></style>
