<!-- 控制中心删除详情页 -->
<template>
  <!-- 音频 -->
  <template v-if="controlIndex === 'audio' && !$usePlat()">
    <div
      style="width: 252px; height: 120px"
      class="xt-text flex flex-col  rounded-xl relative"
      :class="isClick ? 'pointer-events-auto' : 'pointer-events-none'"
      @click="removeControlItem"
    >
      <SystemAudio />
      <div class="absolute" style="top: 7px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:subtract-circle-16-filled"
              size="20"
              style="color: var(--error)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>

  <!-- 用户信息中心 -->
  <template v-else-if="controlIndex === 'user-info'">
    <div
      style="width: 252px; height: 120px"
      class="xt-text flex flex-col items-center justify-center xt-bg-t-2 rounded-xl relative"
      :class="isClick ? 'pointer-events-auto' : 'pointer-events-none'"
      @click="removeControlItem"
    >
      <UserControl
        v-if="isUserLogin"
        :userinfo="userInfo"
        style="pointer-events: none"
      />
      <UserUnLogin v-else style="pointer-events: none" />
      <div class="absolute" style="top: 7px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:subtract-circle-16-filled"
              size="20"
              style="color: var(--error)"
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
      :class="isClick ? 'pointer-events-auto' : 'pointer-events-none'"
      @click="removeControlItem">
      <Screen />
      
      <div class="absolute" style="top: 7px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:subtract-circle-16-filled"
              size="20"
              style="color: var(--error)"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </template>
  <!-- 其他 -->
  <template v-else>
    <div
      class="rounded-xl category-button pointer xt-bg-t-2 flex flex-col items-center justify-center relative"
      style="height: 120px; width: 120px"
      :class="isClick ? 'pointer-events-auto' : 'pointer-events-none'"
      @click="removeControlItem"
    >
      <div
        class="w-14 h-14 flex items-center xt-bg-t-2 justify-center rounded-full mb-3"
      >
        <xt-ify-icon :icon="controlItem.icon" size="24" class="xt-text-2" />
      </div>
      <span class="xt-text xt-font font-14">
        {{ controlItem.name }}
      </span>
      <div class="absolute" style="top: 7px; right: -4px">
        <xt-button style="width: auto !important" h="0">
          <div class="flex items-center justify-center">
            <xt-new-icon
              icon="fluent:subtract-circle-16-filled"
              size="20"
              :color="'var(--error)'"
            ></xt-new-icon>
          </div>
        </xt-button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, toRefs, computed } from "vue";
import { appStore } from "../../../../../store";
import { storeToRefs } from "pinia";
import { controlStore } from "../../../hooks/controlStore";
import _ from "lodash-es";

import SystemAudio from "../system/SystemAudio.vue";
import UserControl from "../user/UserControl.vue";
import UserUnLogin from "../user/UserUnLogin.vue";
import Screen from "../screen/screen.vue";

const app = appStore();
const { userInfo } = storeToRefs(app);
const control = controlStore();
const { updateList, currentControlList, currentAdd } = storeToRefs(control);

const props = defineProps({
  controlIndex: {
    type: String,
    default: "",
  },
  controlItem: {
    type: Object,
    default: () => {},
  },
  isClick: {
    type: Boolean,
    default: true,
  },
});
const { controlItem, controlIndex, isClick } = toRefs(props);

// 判断用户是否登录
const isUserLogin = computed(() => {
  if (!userInfo.value) {
    return false;
  } else {
    return true;
  }
});

// 删除当前选中
const removeControlItem = () => {
  // 固定一个不能被删除的项
  if (currentControlList.value.length > 1 && updateList.value.length > 1) {
    // 添加当前选中的项,添加到currentAdd中
    const addIndex = _.findIndex(currentAdd, function (item) {
      return String(item.id) === String(controlIndex.value);
    });
    if (addIndex === -1) {
      currentAdd.value.push(controlItem.value);
    }
    // 剔除updateList中的项
    const index = _.findIndex(updateList.value, function (item) {
      return String(item.id) === String(controlIndex.value);
    });
    updateList.value.splice(index, 1);
    // 剔除currentControlList中的项
    const currentIndex = _.findIndex(currentControlList.value, function (item) {
      return String(item.id) === String(controlIndex.value);
    });
    currentControlList.value.splice(currentIndex, 1);
  }
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