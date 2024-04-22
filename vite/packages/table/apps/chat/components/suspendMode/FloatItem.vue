<!-- 列表子项页面 -->
<template>
  <template v-for="item in list">
    <!-- 官方群聊的树状 -->
    <div
      class="flex items-center rounded-lg px-3.5 py-2.5 pointer currentItem-hover"
      v-if="!menusVisible"
      @click="handleClick(item)"
    >
      <div class="flex items-center">
        <div class="flex items-center">
          <template v-if="item.type === 'group'">
            <xt-ify-icon icon="fluent-emoji-flat:thought-balloon" size="20" />
          </template>
          <template v-if="item.type === 'link'">
            <xt-ify-icon
              icon="fluent-emoji-flat:globe-with-meridians"
              size="20"
            />
          </template>
          <template v-if="item.type === 'forum'">
            <xt-ify-icon icon="fluent-emoji-flat:placard" size="20" />
          </template>
          <span class="font-16 ml-2 truncate xt-text mr-1.5">
            {{ item.name || item.title }}
          </span>
          <xt-ify-icon
            icon="fluent:open-16-regular"
            size="20"
            class="xt-text-2"
            v-if="item.type === 'link' && item.name !== 'Roadmap'"
          />
        </div>
      </div>
    </div>

    <!-- 管理权限为社群成员 -->
    <div
      class="flex items-center rounded-lg px-3.5 py-2.5 pointer currentItem-hover"
      v-else-if="role === 'member'"
      @click="handleClick(item)"
    >
      <div class="flex items-center">
        <div class="flex items-center">
          <template v-if="item.type === 'group'">
            <xt-ify-icon icon="fluent-emoji-flat:thought-balloon" size="20" />
          </template>
          <template v-if="item.type === 'link'">
            <xt-ify-icon
              icon="fluent-emoji-flat:globe-with-meridians"
              size="20"
            />
          </template>
          <template v-if="item.type === 'forum'">
            <xt-ify-icon icon="fluent-emoji-flat:placard" size="20" />
          </template>
          <span class="font-16 ml-2 truncate xt-text mr-1.5">
            {{ item.name || item.title }}
          </span>
          <xt-ify-icon
            icon="fluent:open-16-regular"
            size="20"
            class="xt-text-2"
            v-if="item.type === 'link' && item.name !== 'Roadmap'"
          />
        </div>
      </div>
    </div>

    <MenuDropdown
      v-else
      :item="item"
      :role="role"
      @currentClick="handleClick"
      :no="no"
    />
  </template>
</template>

<script setup>
import { ref, toRefs, getCurrentInstance } from "vue";

import MenuDropdown from "../dropdown/MenuDropdown.vue";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["currentClick"]);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  /**具备右键菜单**/
  menusVisible: {
    type: Boolean,
    default: false,
  },
  // 权限角色
  role: {
    type: String,
    required: true,
  },
  // 社群编号
  no: {
    type: String,
    required: true,
  },
});
const { list, menusVisible, role, no } = toRefs(props);

// 触发当前
const handleClick = (item) => {
  emit("currentClick", item);
};
</script>

<style lang="scss" scoped>
.currentItem-hover {
  &:hover {
    background: var(--active-secondary-bg);
  }
}
</style>