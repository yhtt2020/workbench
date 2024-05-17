<template>
    <LeftTab>

        <div class="flex h-full">
          <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft>
        </div>
        <div class="flex h-full flex-col flex-1 w-0" >
          <HeaderView></HeaderView>
          <Chat></Chat>
        </div>
    </LeftTab>
</template>

<script>
import HeaderView from "./core/HeaderView.vue";
import Chat from "./chat/main/index.vue";
import MainView from "./core/MainView.vue";
import ChatLeft from "./chat/left/index.vue";
import LeftTab from "./leftTab/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../store/ai";

export default {
  computed: {
    ...mapWritableState(aiStore, ["isFull", "selectTab"]),
  },
  components: { LeftTab, HeaderView, MainView, ChatLeft, Chat },
};
</script>

<style lang="scss" scoped></style>
