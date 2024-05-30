<template>
  <div class="w-full h-full flex items-center">
    <!-- 这里是显示社群桌面右键菜单的更新同步桌面的配置项 -->
    <template v-if="data?.contentAble">
      <div  class="flex w-full cursor-pointer items-center h-14" :class="{ item: isBg }">
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
        <div class="flex flex-col pl-3">
          <div>{{ data[`${name}`] }}</div>
          <div class="xt-text-2 xt-font font-14">{{ data?.newContent }}</div>
        </div>
      </div>
    </template>

    <div
      class="flex w-full cursor-pointer items-center h-10"
      :class="{ item: isBg }"
      v-else
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
        {{ data[`${name}`] == "设置" ? "设置" : data[`${name}`] }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {},
  isBg: {
    default: true,
  },
  color: {
    default: "var(--primary-text)",
  },
  name: {
    default: "name",
  },
  fn: {},
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
