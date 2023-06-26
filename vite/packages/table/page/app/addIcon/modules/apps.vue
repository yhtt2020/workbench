<template>
  <div class="h-full w-full">
    <!-- 空置状态 -->
    <div
      class="w-full h-full flex flex-col justify-center items-center"
      style="height: 470px; border: 1px solid red"
      v-if="myApps.length === 0"
    >
      <CardState
        style="width: 100%; height: 130px"
        :bg="false"
        state="null"
        :zoom="26"
        :text="{ null: '暂无应用' }"
      >
      </CardState>
    </div>
    <!-- 展示数据 -->
    <Icon
      v-else
      ref="iconRef"
      :isSelect="true"
      style="height: calc(100% - 48px)"
      :data="myApps"
      @updateSelectApps="updateSelectApps"
    ></Icon>
  </div>
</template>

<script>
import CardState from "../../../../components/card/cardState.vue";
import syncSelected from "../hooks/syncSelected";

import { appsStore } from "../../../../store/apps";
import { mapWritableState, mapActions } from "pinia";
export default {
  mixins: [syncSelected],
  components: {
    CardState,
  },
  computed: {
    ...mapWritableState(appsStore, ["myApps"]),
  },
  mounted() {
    if (this.myApps.length === 0) this.loadDeskIconApps();
  },
  methods: {
    ...mapActions(appsStore, ["addApps"]),
    async loadDeskIconApps() {
      this.myApps = [];
      const desktopApps = await ipc.sendSync("getDeskApps");
      this.addApps(desktopApps);
    },
  },
};
</script>

<style lang="scss" scoped></style>
