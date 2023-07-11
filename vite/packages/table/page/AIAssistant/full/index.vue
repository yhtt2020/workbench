<template>
  <Teleport to="body">
    <div
      class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 p-3 xt-modal xt-text w-full h-full flex"
      style="z-index: 110"
    >
      <div class="mr-2" style="border: 1px solid red; width: 60px">
        <Tab></Tab>
      </div>
      <MainView></MainView>
    </div>
  </Teleport>
</template>

<script>
import Tab from "../components/Tab.vue";

import MainView from "../core/MainView.vue";
export default {
  components: {
    Tab,
    MainView,
  },
};
</script>

<style lang="scss" scoped></style>
