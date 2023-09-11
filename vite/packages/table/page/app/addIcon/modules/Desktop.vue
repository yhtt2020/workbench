<template>
  <xt-task :modelValue="m02014"></xt-task>
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
import { taskStore } from "../../../../apps/task/store";
import { mapWritableState } from "pinia";
export default {
  mixins: [syncSelected],

  data() {
    return {
      allApps: [],
    };
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),
    m02014() {
      return this.taskID == "M0201" && this.step == 4;
    },
  },
  watch: {},
  mounted() {
    this.loadDeskIconApps();
  },
  methods: {
    async loadDeskIconApps() {
      const desktopApps = await ipc.sendSync("getDeskApps");
      let data = [];
      desktopApps.forEach((item) => {
        data.push({
          ...item,
          open: {
            type: "tableApp",
            value: item.path,
            name: item.name,
          },
        });
      });
      this.allApps = data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
