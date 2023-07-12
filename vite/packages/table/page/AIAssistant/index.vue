<template>
  <!-- <div class="flex w-full h-full p-3 xt-text">
    <Tab style="width: 150px; margin-right: 10px"></Tab>
    <MainView v-if="!isFull"></MainView>
  </div>
  <FullScreen v-if="isFull"></FullScreen> -->
  <XtFullScreen v-model:full="isFull" :spacing="4">
    <template #left> <Tab style="width: 200px"></Tab> </template>
    <template #header> <HeaderView></HeaderView> </template>
    <MainView></MainView>
  </XtFullScreen>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import MainView from "./core/MainView.vue";
import Tab from "./components/Tab.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull"]),
  },
  components: { Tab, HeaderView, MainView,  },
};
</script>

<style lang="scss" scoped></style>
