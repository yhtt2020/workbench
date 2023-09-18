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
      let data = [];
      //todo 要增加一个提示界面
      for (const item of desktopApps) {
        data.push({
          ...item,
          icon:await tsbApi.system.extractFileIcon(item.path),
          open: {
            type: "tableApp",
            value: item.path,
            name: item.name,
          },
        });
      }
      this.allApps = data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
