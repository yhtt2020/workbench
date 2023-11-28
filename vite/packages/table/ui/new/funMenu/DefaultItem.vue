<template>
  <div class="flex flex-row flex-wrap">
    <template v-for="item in menus">
      <div v-if="item?.divider" class="w-full"></div>
      <div v-else class="w-24 h-24 mr-4 mb-4 option" @click="close(item)">
        <xt-new-icon size="40" v-if="item.newIcon" :icon="item.newIcon" />
        <Icon class="icon" v-else-if="item.icon" :icon="item.icon"></Icon>
        {{ item[name] }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
  menus: {},
  name: {},
  fn: {},
});
const { fn } = toRefs(props);
const emits = defineEmits(["close"]);
const close = (item) => {
  emits("close");
  item[fn.value]();
};
</script>

<style lang="scss" scoped></style>
