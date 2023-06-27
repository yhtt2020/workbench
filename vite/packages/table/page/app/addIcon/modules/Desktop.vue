<template>
  <div class="h-full w-full">
    <Icon
      ref="iconRef"
      :isSelect="true"
      :data="allApps"
      @updateSelectApps="updateSelectApps"
    ></Icon>
  </div>
</template>

<script>
import syncSelected from "../hooks/syncSelected";

export default {
  mixins: [syncSelected],

  data() {
    return {
      allApps: [],
    };
  },
  mounted() {
    this.loadDeskIconApps();
  },
  methods: {
    async loadDeskIconApps() {
      const desktopApps = await ipc.sendSync("getDeskApps");
      this.allApps = desktopApps;
    },
  },
};
</script>

<style lang="scss" scoped></style>
