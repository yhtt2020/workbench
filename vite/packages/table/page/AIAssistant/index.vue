<template>
  <div class="h-full pr-3">
    <XtView v-model:full="isFull" :spacing="3" class="">
      <template #left>
        <div class="flex h-full">
          <Tab></Tab>
          <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft>
        </div>
      </template>
      <template #header> <HeaderView></HeaderView> </template>
      <MainView></MainView>
    </XtView>
  </div>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import MainView from "./core/MainView.vue";
import ChatLeft from "./chat/left/index.vue";
import Tab from "./components/Tab.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull", "selectTab"]),
  },
  components: { Tab, HeaderView, MainView, ChatLeft },
};
</script>

<style lang="scss" scoped></style>
