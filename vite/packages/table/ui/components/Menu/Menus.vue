<template>
  <template v-for="menu in props.menus">
    <!-- disabled 为 true 时隐藏该列 -->
    <div v-if="!menu.disabled" class="my-2">
      <template v-if="menu.slot">
        <div class="w-full rounded-lg">
          <Item :data="menu" :name="name" :fn="fn" />
        </div>
        <div @click="handleClick({ lock: false })">
          <slot :name="menu.slot"></slot>
        </div>
      </template>
      <xt-divider v-else-if="menu.divider" class="mx-auto" style="width: 90%" />
      <div v-else-if="menu.children" class="" :key="menu[`${name}`]">
        <xt-popover>
          <template #content>
            <div class="w-full h-full px-2 rounded-lg xt-b">
              <template v-for="child in menu.children">
                <!-- 检查子菜单是否还有自己的子菜单 -->
                <div v-if="child.children" class="my-2">
                  <xt-popover :index="99999999990">
                    <template #content>
                      <!-- 递归渲染子菜单的子菜单 -->
                      <div class="w-full h-full px-2 rounded-lg xt-b">
                        <div
                          class="my-2"
                          @click="handleClick(data, true)"
                          v-for="data in child.children"
                          :name="name"
                        >
                          <Item :data="data" :name="name" :fn="fn" />
                        </div>
                      </div>
                    </template>
                    <xt-text class="w-full h-full items">
                      <Item :data="child" :name="name" :isBg="false" :fn="fn" />
                      <template #right>
                        <xt-new-icon
                          size="20"
                          class="mr-3"
                          icon="fluent:chevron-left-16-filled"
                          style="transform: rotate(180deg); color: var(--secondary-text) !important;"
                        />
                      </template>
                    </xt-text>
                  </xt-popover>
                </div>
                <!-- 如果没有更深层的子菜单，正常渲染当前子菜单 -->
                <div v-else class="my-2 rounded-lg" @click="handleClick(child, true)">
                  <xt-text class="w-full h-full items">
                    <Item :data="child" :name="name" :fn="fn" />
                  </xt-text>
                </div>
              </template>
            </div>
          </template>
        
          <xt-text class="w-full h-full items">
            <Item :data="menu" :name="name" :isBg="false" :fn="fn" />
            <template #right>
              <xt-new-icon
                size="20"
                class="mr-3"
                icon="fluent:chevron-left-16-filled"
                style="transform: rotate(180deg); color: var(--secondary-text) !important;"
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
