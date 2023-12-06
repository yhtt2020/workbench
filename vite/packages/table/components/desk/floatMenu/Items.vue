<template>
  <div class="flex flex-wrap justify-around justify-center">
    <xt-button
      :title="item.title"
      v-for="item in menus"
      @click="item.fn"
      :type="item.type"
      w="40"
      h="40"
      radius="8"
      class="mb-2 mr-1.5 floatMenu"
    >
      <xt-new-icon :icon="item.icon" class="text-2" size="20" />
    </xt-button>
  </div>
</template>

<script setup>
const props = defineProps({
  menus: {},
});
</script>

<style lang="scss" scoped></style>
