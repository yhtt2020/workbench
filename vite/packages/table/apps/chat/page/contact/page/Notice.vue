<!-- 联系人模块中的通知列表页 -->
<template>
 <div class="w-full h-full flex flex-col px-4">
  <div class="flex w-full items-center justify-between pt-1">
    <span class="xt-text xt-font font-16">通知({{ list.length }}个)</span>
  </div>

  <!-- 空状态 -->
  <template v-if="list.length === 0">
    <div class="flex flex-col items-center justify-center h-full">
      <xt-ify-icon
        icon="fluent-emoji:sleeping-face"
        size="64"
        style="color: #d9d9d9"
      />
      <span class="xt-text xt-font font-16" style="color: #d9d9d9"
        >暂无通知</span
      >
    </div>
  </template>

  <xt-scrollbar :y="true" style="height: 100%" v-else>
    <div style="height: 16px"></div>
    <template v-for="item in list">
      <!-- <div
        class="flex items-center pointer rounded-lg p-4 friend-item"
        @click="handleFriend(item)"
      >
        <a-avatar size="32" :src="item.profile.avatar" />
        <div class="flex flex-col ml-2">
          <span class="xt-text xt-font font-16">{{ item.profile.nick }}</span>
        </div>
      </div> -->
    </template>
    <div style="height: 16px"></div>
  </xt-scrollbar>
</div>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const { list } = toRefs(props);

</script>

<style scoped>

</style>