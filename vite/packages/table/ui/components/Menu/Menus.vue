<template>
  <template v-for="menu in props.menus">
    <!--  disabled 为true时隐藏该列 -->
    <div v-if="!menu. disabled" class="my-2">
      <template v-if="menu.slot">
        <div class="rounded-lg w-full">
          <Item :data="menu" :name="name" :fn="fn" />
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
      <xt-divider v-else-if="menu.divider" class="mx-auto" style="width: 90%" />
      <div v-else-if="menu.children" class="" :key="menu[`${name}`]">
        <xt-popover>
          <template #content>
            <div class="w-full h-full px-2 xt-b rounded-lg">
              <div
                class="my-2"
                @click="handleClick(data, true)"
                v-for="data in menu.children"
                :name="name"
              >
                <Item :data="data" :name="name" :fn="fn" />
              </div>
            </div>
          </template>

          <xt-text class="w-full h-full items">
            <Item :data="menu" :name="name" :isBg="false" :fn="fn" />
            <template #right>
              <xt-new-icon
                size="20"
                class="mr-3"
                icon="fluent:chevron-left-16-filled"
                style="
                  transform: rotate(180deg);
                  color: var(--secondary-text) !important;
                "
              />
            </template>
          </xt-text>
        </xt-popover>
      </div>
      <div v-else class="rounded-lg" @click="handleClick(menu)">
        <xt-text class="w-full h-full">
          <Item :data="menu" :name="name" :fn="fn" />
        </xt-text>
      </div>
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
.items {
  box-sizing: border-box;
  height: 40px;

  &:hover {
    background: var(--active-secondary-bg);
    border-radius: 8px;
  }
}
</style>
