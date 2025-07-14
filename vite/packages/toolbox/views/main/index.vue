<template>
  <div class="w-full h-full xt-modal xt-text flex flex-col xt-container">
    <div class="xt-border">
      <Search></Search>
    </div>
    <div
      class="p-3 h-0 flex-1 flex-grow overflow-hidden overflow-y-auto xt-scrollbar drag"
    >
      <div class="no-drag h-full w-full">
        <router-view ></router-view>
      </div>

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
