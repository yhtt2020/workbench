<!-- 添加控制中心详情页 -->
<template>
  <!-- 音频 -->
  <template v-if="controlIndex === 'audio' && !$usePlat()">
    <div
      style="width: 252px; height: 120px;"
      class="xt-text flex flex-col xt-bg-t-2 rounded-xl relative"
      @click="addControlItem"
    >
      <SystemAudio style="pointer-events: none;"/>
      <div class="absolute" style="top: 3px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:add-circle-12-filled"
              size="20"
              style="color: var(--link)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>

  <!-- 用户中心数据信息模块 -->
  <template v-else-if="controlIndex === 'user-info'">
    <div
      class="rounded-xl pointer category-button xt-bg-t-2 flex items-center justify-center flex-col relative"
      style="height: 120px; width: 252px;"
      @click="addControlItem"
    >
      <UserControl :userinfo="userInfo" v-if="isUserInfoNull" style="pointer-events: none;"/>
      <UserUnLogin v-else style="pointer-events: none;"/>
      <div class="absolute" style="top: 3px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:add-circle-12-filled"
              size="20"
              style="color: var(--link)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>

  <template v-else-if="controlIndex === 'window-size-position'">
    <div
      class="rounded-xl pointer category-button xt-bg-t-2 flex items-center justify-center flex-col"
      style="height: 120px; width: 252px"
      @click="addControlItem">
      <Screen />
      <div class="absolute" style="top: 3px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:add-circle-12-filled"
              size="20"
              style="color: var(--link)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>
  <!-- 控制中心其他按钮 -->
  <template v-else>
    <div
      class="xt-bg-t-2 rounded-xl pointer category-button flex flex-col items-center justify-center relative"
      style="height: 120px; width: 120px;"
      @click="addControlItem"
    >
      <div
        class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3"
        style="pointer-events: none;"
      >
        <xt-new-icon :icon="controlItem.icon" size="24"></xt-new-icon>
      </div>
      <span class="xt-text" style="pointer-events: none;">{{ controlItem.name }}</span>
      <div class="absolute" style="top: 3px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:add-circle-12-filled"
              size="20"
              style="color: var(--link)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, computed,toRefs } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../../../store";
import { controlStore } from "../../../hooks/controlStore";
import _ from "lodash-es";

import SystemAudio from "../system/SystemAudio.vue";
import UserControl from "../user/UserControl.vue";
import UserUnLogin from "../user/UserUnLogin.vue";
import Screen from "../screen/screen.vue";

const props = defineProps({
  controlIndex: {
    type: String,
  },
  controlItem: {
    type: Object,
    default: () => {},
  },
});
const { controlItem, controlIndex, isClick } = toRefs(props);

const app = appStore();
const { userInfo } = storeToRefs(app);
const control = controlStore();
const { currentAdd,currentControlList,updateList } = storeToRefs(control);

const isUserInfoNull = computed(() => {
  if (!userInfo.value) {
    return false;
  } else {
    return true;
  }
});

// 添加控制中心
const addControlItem = () => {
  // 将当前点击选中的数据,添加到currentControlList中
  const index = _.findIndex(currentControlList.value, function(item){
    return String(item.id) === String(controlIndex.value);
  });
  console.log('currentControlList',index);
  if(index === -1){
    currentControlList.value.push(controlItem.value)
  }
  // 将当前点击选中的数据,添加到updateList中
  const indexAdd = _.findIndex(updateList.value, function(item){
    return String(item.id) === String(controlIndex.value);
  });
  console.log('updateList',indexAdd);
  if(indexAdd === -1){
    updateList.value.push({id:controlIndex.value})
  }
  // 将当前点击选中的数据,从currentAdd中移除
  const removeIndex = _.findIndex(currentAdd.value, function(item){
    return String(item.id) === String(controlIndex.value);
  });
  console.log('currentAdd',removeIndex);
  currentAdd.value.splice(removeIndex,1);
};
</script>

<style lang="scss" scoped>
:deep(.volume-play) {
  pointer-events: none !important;
}
:deep(.volume-content) {
  pointer-events: none !important;
}
</style>