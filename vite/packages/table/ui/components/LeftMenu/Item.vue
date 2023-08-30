<template>
  <slot :name="item.slot">{{ item.slot }}</slot>
  <img
    :src="item.img"
    alt=""
    style="width: 40px; height: 40px"
    class="mb-3 pointer"
    v-if="item.img"
    @click="iconClick(item)"
  />
  <xt-icon
    v-else-if="item.icon"
    class="mb-3"
    v-bind="config"
    :icon="item.icon"
    @click="iconClick(item)"
  ></xt-icon>
</template>

<script setup>
const props = defineProps({
  item: {},
});

const iconClick = (item, flag) => {
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped></style>
