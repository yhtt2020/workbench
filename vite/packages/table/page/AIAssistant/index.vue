<template>
  <div class="mr-3 h-full">
    <LeftTab>
      <div class="h-full w-full flex">
        <div class="flex h-full">
          <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft>
        </div>
        <div class="flex h-full flex-col flex-1 w-0" >
          <HeaderView></HeaderView>
          <Caht></Caht>
        </div>
      </div>
    </LeftTab>
  </div>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import Caht from "./chat/main/index.vue";
import MainView from "./core/MainView.vue";
import ChatLeft from "./chat/left/index.vue";
import LeftTab from "./leftTab/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull", "selectTab"]),
  },
  components: { LeftTab, HeaderView, MainView, ChatLeft, Caht },
};
</script>

<style lang="scss" scoped></style>
