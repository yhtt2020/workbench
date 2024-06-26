<template>
  <div class="px-4 pt-3.5 flex flex-col" v-if="!enterDetailVisible">
    <!-- 顶部tab切换 -->
    <GameDiscountTab />

    <template v-if="currentGameType === 'discount'">
      <GamePageDiscountDetail />
    </template>

    <template v-else-if="currentGameType === 'epic'">
      <EpicPageDetail />
    </template>
  </div>

  <!-- 游戏折扣详情 -->
  <template v-else>
    <GameDiscountDetail
      :gameId="currentGameDetail?.id"
      :exTime="currentGameDetail?.discount_expiration"
    />
  </template>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { gameStrategyStore } from "../../store/gameStrategyStore";

import GameDiscountTab from "./components/GameDiscountTab.vue";
import EpicPageDetail from "./components/EpicPageDetail.vue";
import GamePageDiscountDetail from "./components/GamePageDiscountDetail.vue";
import GameDiscountDetail from "./GameDiscountDetail.vue";

const { proxy } = getCurrentInstance();

const { currentGameType } = storeToRefs(gameStrategyStore());

const enterDetailVisible = ref(false);

const currentGameDetail = ref({});

onMounted(() => {
  proxy.$bus.on("enterDetail", (data) => {
    enterDetailVisible.value = true;
    currentGameDetail.value = data;
  });
  // 返回
  proxy.$bus.on("backPage", () => {
    enterDetailVisible.value = false;
    currentGameDetail.value = {};
  });
});

onUnmounted(() => {
  proxy.$bus.off("enterDetail");
  proxy.$bus.off("backPage");
});
</script>

<style lang="scss" scoped>
</style>