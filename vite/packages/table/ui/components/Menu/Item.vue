<template>
  <div
    class="flex w-full cursor-pointer items-center h-10"
    :class="{ item: isBg }"
  >
    <xt-base-icon
      :style="{ 'font-size': '20px' }"
      v-if="data?.icon"
      :icon="data.icon"
      class="ml-3 xt-text-2"
    />
    <xt-new-icon
      size="20"
      v-else-if="data?.newIcon"
      :icon="data.newIcon"
      class="ml-3 xt-text-2"
    />
    <div
      class="truncate w-full flex-1 pl-3 text-base"
      :style="{
        color: data.color ? data.color : color,
      }"
    >
      {{ data[`${name}`] == "设置" ? "设置小组件" : data[`${name}`] }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  data: {},
  isBg: {
    default: false,
  },
  color: {
    default: "var(--primary-text)",
  },
  name: {
    default: "name",
  },
});
</script>

<style lang="scss" scoped>
.item {
  &:hover {
    background: var(--active-secondary-bg);
    border-radius: 8px;
  }
}
</style>
