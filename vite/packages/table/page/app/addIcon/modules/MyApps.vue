<template>
  <div class="h-full w-full">
    <!-- 空置状态 -->
    <div
      class="w-full h-full flex flex-col justify-center items-center"
      style="height: 470px"
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
      <!-- <div @click="goAddMyApps()">123</div> -->
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
import { mapWritableState } from "pinia";
export default {
  mixins: [syncSelected],
  components: {
    CardState,
  },
  computed: {
    ...mapWritableState(appsStore, ["myApps"]),
  },
  methods: {
    goAddMyApps() {
      this.$router.push({ name: "apps" })
    },
  },
};
</script>

<style lang="scss" scoped></style>
