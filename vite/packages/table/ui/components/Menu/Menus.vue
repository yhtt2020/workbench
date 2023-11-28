<template>
  <template v-for="menu in props.menus">
    <template v-if="menu.slot">
      <div class="item rounded-lg">
        <Item :data="menu" :name="name" />
      </div>
      <div
        @click="
          handleClick({
            lock: false,
          })
        "
      >
        <slot :name="menu.slot"></slot>
      </div>
    </template>
    <xt-divider v-else-if="menu.divider" class="my-3" />
    <div
      v-else-if="menu.children"
      class="item rounded-lg"
      :key="menu[`${name}`]"
    >
      <xt-popover>
        <xt-text class="w-full h-full">
          <Item :data="menu" :name="name" />
          <template #right>
            <xt-new-icon
              size="20"
              class="mr-3"
              icon="fluent:chevron-left-16-filled"
              style="transform: rotate(180deg)"
            />
          </template>
        </xt-text>
        <template #content>
          <div class="list w-full h-full p-1">
            <div
              class="item"
              @click="handleClick(data, true)"
              v-for="data in menu.children"
              :name="name"
            >
              <Item :data="data" :isBg="true" :name="name" />
            </div>
          </div>
        </template>
      </xt-popover>
    </div>
    <div v-else class="item rounded-lg" @click="handleClick(menu)">
      <xt-text class="w-full h-full">
        <Item :data="menu" :name="name" />
      </xt-text>
    </div>
  </template>
</template>

<script setup>
import Item from "./Item.vue";

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
  name: {
    default: "label",
  },
  fn: {
    default: "callBack",
  },
});

const emits = defineEmits(["handleClick"]);
const handleClick = (item, flag = null) => {
  if (flag) {
    item[props.fn] && item[props.fn](item);
    return;
  }

  emits("handleClick", item);
};
</script>

<style lang="scss" scoped>
.item {
  box-sizing: border-box;
  height: 40px;

  &:hover {
    background: var(--active-secondary-bg);
    cursor: pointer;
  }
}
</style>
