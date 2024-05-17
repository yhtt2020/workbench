<!-- 同步桌面更新的设置页面 -->
<template>
  <div class="w-full flex flex-col">
    <div class="flex items-center mb-2.5 w-full flex-wrap">
      <span class="xt-text-2 xt-font font-14">当前桌面为</span>
      <div class="flex items-center mx-2">
        <a-avatar
          :src="info?.icon"
          :size="24"
          shape="square"
          style="margin-right: 8px"
        />
        <span class="xt-font font-14" style="color: var(--link)">
          {{ info?.name }}
        </span>
      </div>
      <template v-if="role === 'owner'">
        <span class="xt-text-2 xt-font font-14"
          >社群桌面，作为社群管理员，你可以自由修</span
        >
        <span class="xt-text-2 xt-font font-14">改桌面设置</span>
      </template>
      <template v-else>
        <span class="xt-text-2 xt-font font-14">
          社群桌面，暂不支持自定义修改。
        </span>
      </template>
    </div>

    <div class="flex w-full items-center">
      <xt-button
        w="127"
        h="32"
        type="theme"
        style="margin-right: 12px"
        :radius="8"
        style="margin-right: 12px"
        :radius="8"
        @click="updateDeskData"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:cloud-arrow-up-16-regular"
            size="24"
            class="pr-2"
          />
          <span class="xt-font font-14 xt-text">更新桌面数据</span>
        </div>
      </xt-button>
      <span class="xt-font font-14 xt-text-2" v-if="role === 'owner'">
        上次同步时间：{{ setting.saveSyncTime !== "" ?  generateSearchResultTime(setting.saveSyncTime) : "" }}
      </span>
      <span class="xt-font font-14 xt-text-2" v-if="role === 'member'">
        上次同步时间：{{  setting.getSyncTime !== "" ? generateSearchResultTime(setting.getSyncTime) : "" }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { communityDeskStore } from "../store/communityDeskStore";
import { generateSearchResultTime } from "../hooks/deskCreateMethod";
import { storeToRefs } from "pinia";
import { communityDeskStore } from "../store/communityDeskStore";


const props = defineProps({
  // 当前桌面信息
  deskInfo: {
    type: Object,
    default: () => {},
  },
});
const { deskInfo } = toRefs(props);

const emit = defineEmits(["handleSyncDesk"]);

const { setting } = storeToRefs(communityDeskStore());

// 获取当前社群信息
const info = computed(() => {
  return deskInfo.value?.communityInfo;
});
// 获取当前社群的角色权限
const role = computed(() => {
  return deskInfo.value?.role;
});

// 更新桌面数据
const updateDeskData = () => {
  emit("handleSyncDesk");
};
</script>

<style lang="scss" scoped>
</style>