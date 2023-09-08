<template>
  <!-- 统一子菜单 -->
  <a-dropdown :trigger="['click']" placement="top">
    <template #overlay v-if="list">
      <div class="xt-modal rounded-xl p-1 xt-b">
        <template v-for="item in list">
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
    <slot></slot>
  </a-dropdown>
</template>

<script setup>
const props = defineProps({
  list: {},
});
const emits = defineEmits(["itemClick"]);

const onItemClick = (item) => {
  console.log("111 :>> ", 111);
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
