<template>
  <div class="w-full h-full xt-modal xt-text flex flex-col">
    <GlobaSearch></GlobaSearch>
    <XtButton @click="go" style="height: 48px" class="flex-1">1</XtButton>
    <div
      class="m-3 h-full flex-grow overflow-hidden overflow-y-auto xt-scrollbar"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import GlobaSearch from "./views/globalSearch/index.vue";
export default {
  components: {
    GlobaSearch,
  },
  mounted() {
    document.documentElement.classList.add("dark-model");
  },
  methods: {
    go() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  // -webkit-app-region: drag;
  user-select: none;
}
</style>
