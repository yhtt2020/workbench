<script lang="ts" setup>
import { computed } from "vue";
import MyIcons from "../../widgets/myIcons/index.vue";
import Widget from "../../card/Widget.vue";
const props = defineProps<{
  title: string;
  yellow?: boolean;
  preview?: boolean;
  item?: boolean;
  currentDesk;
}>();
const backgroundColor = computed(() => (props.yellow ? "yellow" : "white"));
</script>

<template>
  <div
    class="box"
    :style="{ backgroundColor }"
    :role="preview ? 'BoxPreview' : 'Box'"
  >
    <!-- <component
      :desk="currentDesk"
      :is="item.name"
      :customIndex="item.id"
      :customData="item.customData"
      :editing="editing"
    ></component> -->
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.box {
  padding: 0.5rem 1rem;
  border: 1px dashed gray;
  cursor: move;
}
</style>
