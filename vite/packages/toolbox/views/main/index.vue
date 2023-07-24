<template>
  <div class="w-full h-full xt-modal xt-text flex flex-col">
    <div class="xt-border">
      <Search></Search>
    </div>
    <div
      class="m-3 h-full flex-grow overflow-hidden overflow-y-auto xt-scrollbar no-darg"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Search from "./search.vue";
import Tools from "./tools.vue";
export default {
  components: {
    Search,
    Tools,
  },
  mounted() {
    document.documentElement.classList.add("dark-model");
  },
  methods: {},
};
</script>

<style lang="scss"></style>
