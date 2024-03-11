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
        <div class="p-1 xt-modal rounded-xl xt-b">
          <template v-for="item in data.children">
            <div
              @click="onItemClick(item)"
              class="relative flex items-center pl-3 text-base cursor-pointer box xt-text"
              style="width: 184px; height: 44px; border-radius: 10px"
            >
              <div v-if="item.slot && item.slot !== ''">
                <slot :name="item.slot"></slot>
              </div>
              <div v-else>
                <div v-if="item.icon">
                  <xt-base-icon :icon="item.icon" class="mr-3"></xt-base-icon>
                  {{ item.name }}
                </div>
                <div v-else class="flex items-center justify-center" >
                  <xt-ify-icon :icon="item.newIcon" class="mr-3"></xt-ify-icon>
                  {{ item.name }} 
                </div>
                <!-- <xt-base-icon :icon="item.icon" class="mr-3"></xt-base-icon>
                <xt-ify-icon :icon="item.newIcon" class="mr-3"></xt-ify-icon>
                {{ item.name }} -->
              </div>

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
    return "mouseenter";
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
