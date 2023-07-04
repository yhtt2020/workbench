<template>
  <!-- 空置状态 -->
  <div
    class="w-full h-full flex flex-col justify-center items-center w h"
    v-if="myApps.length === 0"
  >
    <CardState :bg="false" state="null" :zoom="26" :text="{ null: '暂无应用' }">
    </CardState>
    <!-- <div @click="goAddMyApps()">123</div> -->
  </div>

  <!-- 展示数据 -->
  <Icon
    v-else
    ref="iconRef"
    :isSelect="true"
    style="height: calc(100% - 48px)"
    :data="appList"
    @updateSelectApps="updateSelectApps"
  >
  </Icon>
</template>

<script>
import CardState from "../../../../components/card/components/State.vue"
import syncSelected from "../hooks/syncSelected";

import { appsStore } from "../../../../store/apps";
import { mapWritableState } from "pinia";
export default {
  mixins: [syncSelected],
  components: {
    CardState,
  },
  data() {
    return {
      appList: [],
    };
  },
  computed: {
    ...mapWritableState(appsStore, ["myApps"]),
  },
  mounted() {
    let data = [];
    this.$nextTick(() => {
      this.myApps.forEach((item) => {
        data.push({
          ...item,
          open: {
            type: "tableApp",
            value: item.path,
            name: item.name,
          },
        });
      });
      this.appList = data;
    });
  },
  methods: {
    // 跳转链接
    goAddMyApps() {
      this.$router.push({ name: "apps" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../components/index.scss";
</style>
