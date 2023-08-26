<template>
  <div class="h-full pr-3">
    <XtView v-model:full="isFull" :spacing="0" boxClass="xt-b py-3 pr-3">
      <template #left>
        <div class="flex h-full">
          <LeftTab></LeftTab>
          <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft>
        </div>
      </template>
      <template #header> <HeaderView class=" "></HeaderView> </template>
      <MainView></MainView>
    </XtView>
  </div>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import MainView from "./core/MainView.vue";
import ChatLeft from "./chat/left/index.vue";
import LeftTab from "./leftTab/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull", "selectTab"]),
  },
  components: { LeftTab, HeaderView, MainView, ChatLeft },
};
</script>

<style lang="scss" scoped></style>
