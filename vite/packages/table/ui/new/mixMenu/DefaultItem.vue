<template>
  <div class="flex flex-row flex-wrap">
    <template v-for="item in menus">
      <!--  disabled 为true时隐藏该列 -->
      <template v-if="!item.disabled">
        <div v-if="item?.divider" class="w-full"></div>
        <div
          v-else
          class="h-24 mr-4 mb-4 option"
          @click="close(item)"
          style="min-width: 96px"
        >
          <xt-new-icon size="40" v-if="item.newIcon" :icon="item.newIcon" />
          <Icon class="icon" v-else-if="item.icon" :icon="item.icon"></Icon>
          {{ item[name] }}
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
  menus: {},
  name: {
    default: "name",
  },
  fn: {
    default: "fn",
  },
});
const { fn } = toRefs(props);
const emits = defineEmits(["close"]);
const close = (item) => {
  emits("close");
  item && item[fn.value]();
};
</script>

<style lang="scss" scoped></style>
