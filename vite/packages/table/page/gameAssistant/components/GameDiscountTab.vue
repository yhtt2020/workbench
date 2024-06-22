<!-- 游戏折扣类型切换公共组件 -->
<template>
  <!-- 顶部tab切换 -->
  <div class="flex justify-between h-12 items-center " :class="mb">
    <xt-option-tab
      v-if="isTab"
      :list="gameRecommendType"
      v-model="currentGameType"
      :circle="false"
      style="height: 40px; max-width: 450px; margin-bottom: 0 !important"
    />

    

    <xt-button
      :radius="8"
      h="40"
      style="width: auto !important; padding-left: 16px; padding-right: 16px"
      type="default"
      @click="openRightDrawer"
      v-if="currentGameType === 'discount'"
    >
      地区:{{ getAreaName }}
    </xt-button>
  </div>

  <HorizontalDrawer
    @getArea="getGameAreaName"
    ref="regionDrawer"
    :drawerTitle="'地区'"
    :rightSelect="regionRange"
    :selectRegion="getAreaNameId"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, nextTick, computed, getCurrentInstance } from "vue";
import { gameStrategyStore } from "../../../store/gameStrategyStore";
import { regionRange } from "../../../js/axios/api";

import HorizontalDrawer from "../../../components/HorizontalDrawer.vue";

const { currentGameType, currentGameArea } = storeToRefs(gameStrategyStore());

const props = defineProps({
  isTab: {
    type: Boolean,
    default: true,
  },
  mb:{
    type:String,
    default:'mb-4'
  }
});

const { proxy } = getCurrentInstance();

const gameRecommendType = ref([
  { name: "Steam折扣", value: "discount" },
  { name: "Epic喜加一", value: "epic" },
]);

// 获取el元素
const regionDrawer = ref(null);

// 获取游戏区服名称
const getGameAreaName = (data) => {
  currentGameArea.value = { id: data.id, name: data.name, local: data.local };
  if(props.isTab){
    proxy.$bus.emit("updateDiscountData");
  }
  else {
    proxy.$bus.emit("handleDiscountData");
  }
};

// 开启游戏区服选择抽屉弹窗
const openRightDrawer = () => {
  nextTick(() => {
    regionDrawer.value.openDrawer();
  });
};

// 通过计算属性获取游戏区服名称实时
const getAreaName = computed(() => {
  if (currentGameArea.value?.name) {
    return currentGameArea.value?.name;
  } else {
    return "国区";
  }
});

// 通过计算属性获取游戏区服的名称id
const getAreaNameId = computed(() => {
  if (currentGameArea.value?.id) {
    return currentGameArea.value?.id;
  } else {
    return "cn";
  }
});
</script>

<style lang="scss" scoped>
</style>