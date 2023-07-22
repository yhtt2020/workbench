<template>
  <div class="w-full h-full xt-modal xt-text flex flex-col">
    <div class="xt-border">
      <GlobaSearch></GlobaSearch>
 
    </div>
    <div
      class="m-3 h-full flex-grow overflow-hidden overflow-y-auto xt-scrollbar no-darg"
      style="border: 1px solid red"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import GlobaSearch from "../globalSearch/index.vue";
export default {
  components: {
    GlobaSearch,
  },
  mounted() {
    document.documentElement.classList.add("dark-model");
  },
  methods: {
 
  },
};
</script>

<style lang="scss"></style>
