<template>
  <!-- 文字层 -->
  <a-tooltip
    :title="data.title"
    placement="right"
    @click.stop="onItemClick(data)"
  >
    <!-- 点击层 -->
    <a-dropdown :trigger="['click']" placement="top">
      <template #overlay v-if="data.children">
        <div class="xt-modal rounded-xl p-1 xt-b">
          <template v-for="item in data.children">
            <div
              @click="onItemClick(item)"
              class="flex items-center pl-3 cursor-pointer box text-base xt-text"
              style="width: 184px; height: 44px; border-radius: 10px"
            >
              <xt-base-icon :icon="item.icon" class="mr-3"></xt-base-icon>
              {{ item.name }}
            </div>
          </template>
        </div>
      </template>
      <!-- 默认插槽 -->
      <template v-if="data.float">
        <!-- 拓展 -->
        <tippy
          placement="right"
          :trigger="trigger"
          :interactive="true"
          :arrow="false"
        >
          <!-- 鼠标经过层 -->
          <template #content>
            <slot name="content"> </slot>
          </template>
          <!-- 默认层 -->
          <slot></slot>
        </tippy>
      </template>
      <template v-else> <slot></slot></template>
    </a-dropdown>
  </a-tooltip>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  data: {},
});
// 展示状态
const trigger = computed(() => {
  if (props.data.float) {
    return "click";
    // mouseenter
  } else {
    return "";
  }
});

const emits = defineEmits(["itemClick"]);

const onItemClick = (item) => {
  emits("itemClick", item);
};
</script>

<style lang="scss" scoped>
.box {
  &:hover {
    background: var(--active-secondary-bg);
  }
}
</style>
