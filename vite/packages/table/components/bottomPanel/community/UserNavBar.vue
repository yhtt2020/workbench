<template>
 <div
  v-if="!simple && !usePermission.isSingle && bottomToggle[0]"
  class="relative flex flex-row items-center justify-between common-panel  xt-text-1 h-[80px] ml-0.5 mt-0 mr-0 mb-0 s-bg"
  :style="{ borderRadius:'12px',border:'1px solid var(--divider)' }"
  style="padding: 6px !important;"
 >
  <div class="flex items-center justify-between">
   <div @click="openControl($event)">
    <MyAvatar :chat="true" :level="false" :limit="false"></MyAvatar>
   </div>
  </div>
 </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../store";
import { usePermissionStore } from "../../../permission/store";
import { useNavigationStore } from "../../desk/navigationBar/navigationStore";

import MyAvatar from "../../small/MyAvatar.vue";

const useAppStore = appStore();
const { simple, userInfo } = storeToRefs(useAppStore);
const usePermission = usePermissionStore();
const navigationStore = useNavigationStore();
const { bottomToggle } = storeToRefs(navigationStore);

const emit = defineEmits(["openControl"]);
const openControl = (e) => {
  emit("openControl", e);
};

// 头像框是否佩戴
const isFrame = computed(() => {
  return userInfo.value.frame === "";
});
</script>

<style lang='scss' scoped>
</style>