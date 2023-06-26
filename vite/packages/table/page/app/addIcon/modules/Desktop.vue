<template>
  <div class="h-full w-full">
    <Icon
      ref="iconRef"
      :isSelect="true"
      style="height: calc(100% - 48px)"
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
    }
  },
  mounted() {
    this.loadDeskIconApps();
  },
  methods: {
    async loadDeskIconApps() {
      const desktopApps = await ipc.sendSync("getDeskApps");
      console.log('object :>> ', desktopApps);
      this.allApps = desktopApps;
    },
  },
};
</script>

<style lang="scss" scoped></style>
