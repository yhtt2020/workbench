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
import { main } from "../../store/main";
import { mapWritableState } from "pinia";
export default {
  computed: {
    ...mapWritableState(main, ["useTool"]),
  },
  components: {
    Search,
    Tools,
  },
  mounted() {
    document.documentElement.classList.add("dark-model");

    window.addEventListener("keydown", this.handleEscKeyPressed, {
      capture: true,
    });
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleEscKeyPressed, {
      capture: true,
    });
  },
  methods: {
    handleEscKeyPressed(event) {
      if (event.keyCode === 27) {
        this.$router.push("/");
        this.useTool = "";
      }
    },
  },
};
</script>

<style lang="scss"></style>
