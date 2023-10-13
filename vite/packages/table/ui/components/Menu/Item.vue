<template>
  <div class="flex w-full item items-center" style="height: 44px">
    <div class="pl-3" v-if="data?.icon || data?.newIcon">
      <xt-base-icon
        :style="{ 'font-size': '20px' }"
        v-if="data?.icon"
        :icon="data.icon"
      />
      <xt-new-icon size="20" v-else-if="data?.newIcon" :icon="data.newIcon" />
    </div>
    <div class="truncate w-full flex-1 pl-3">{{ data.label }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {},
});
</script>

<style lang="scss" scoped>
.item {
  box-sizing: border-box;
  height: 44px;
  overflow: hidden;
  &:hover {
    background: var(--active-secondary-bg);
    cursor: pointer;
    border-radius: 10px;
  }
}
</style>
