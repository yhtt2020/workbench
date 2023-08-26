<template>
  <template v-for="item in list">
    <img
      :src="item.img"
      alt=""
      style="width: 40px; height: 40px"
      class="mb-3"
      v-if="item.img"
      @click="iconClick(item)"
    />
    <xt-icon
      v-else
      class="mb-3"
      v-bind="config"
      :icon="item.icon"
      @click="iconClick(item)"
      :class="{
        box: item.icon == currentIndex,
      }"
    ></xt-icon>
  </template>
</template>

<script setup>
const props = defineProps({
  list: {},
});

const iconClick = (item, flag) => {
  item.callBack && item.callBack(item);
};
</script>

<style lang="scss" scoped></style>
