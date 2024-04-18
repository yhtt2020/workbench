<!-- 群聊专属下拉菜单 -->
<template>
  <a-dropdown
    :trigger="['click']"
    :placement="title !== undefined ? 'bottom' : 'bottomRight'"
    :overlayStyle="{ zIndex: '10000 !important', minWidth: '0px !important' }"
    @visible-change="callBackData($event)"
    @click.stop
  >
    <div
      v-if="enableButton === false"
      class="flex pointer items-center"
      :class="title !== undefined ? 'justify-between' : 'justify-center'"
    >
      <span
        class="font-16 xt-font"
        :class="title !== undefined ? 'xt-active-text' : ''"
      >
        {{ title }}
      </span>
      <xt-ify-icon
        :icon="newIcon"
        :class="title !== undefined ? 'xt-active-text' : 'xt-text-2'"
        size="20"
      />
    </div>

    <xt-button
      class="xt-bg"
      v-else
      :style="
        wVisible
          ? { width: '0', height: '0' }
          : { height: '40px', width: '40px' }
      "
    >
      <div class="flex items-center justify-center">
        <xt-ify-icon
          :icon="newIcon"
          :class="title !== undefined ? 'xt-active-text' : 'xt-text-2'"
          size="20"
        />
      </div>
    </xt-button>

    <template #overlay>
      <a-menu
        class="custom-dropdown-menu flex-col flex items-center justify-center xt-bg-2"
      >
        <template v-for="(item, index) in list">
          <a-menu-item
            v-if="index < list.length - 2"
            style="width: 184px; margin-bottom: 8px"
            class="rounded-lg flex items-center h-11 drop-item xt-text-2"
            @click="item.callBack(item,dropItem)"
          >
            <xt-ify-icon :icon="item.newIcon" size="20" class="xt-text" />
            <span class="pl-4 font-16 xt-font xt-text">
              {{ item.title }}
            </span>
          </a-menu-item>

          <a-divider
            v-if="index === list.length - 2 && list.length === 5"
            style="
              height: 1px;
              margin: 0 0 8px 0;
              background-color: var(--divider);
            "
          ></a-divider>

          <a-menu-item
            v-if="index >= list.length - 2"
            style="width: 184px; margin-bottom: 8px"
            class="rounded-lg flex items-center h-11 drop-item xt-text-2"
            @click="item.callBack(item,dropItem)"
          >
            <xt-ify-icon :icon="item.newIcon" size="20" class="xt-text" />
            <span
              class="pl-4 font-16 xt-font"
              :style="
                item.type === 'delete'
                  ? { color: 'var(--error)' }
                  : { color: 'var(--primary-text)' }
              "
            >
              {{ item.title }}
            </span>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  // 图标
  newIcon: {
    type: String,
    required: true,
  },
  // 下拉列表
  list: {
    type: Array,
    default: () => [],
  },
  // 标题
  title: {
    type: String,
    required: true,
  },
  // 是否禁用按钮
  enableButton: {
    type: Boolean,
    default: false,
  },
  // 是否显示按钮宽度
  wVisible: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Object,
    default: null,
  },
  dropItem:{
    type:Object,
    default:()=>({})
  }
});
const { newIcon, wVisible, enableButton, title, list, id } = toRefs(props);

const callBackData = (evt) => {
  if (id.value !== null) {
    // this.$emit("callbackParams", this.id);
  } else {
    return;
  }
};
</script>

<style lang="scss" scoped>
.custom-dropdown-menu {
  border-radius: 10px !important;
  background-color: var(--secondary-bg) !important;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.5);
  width: 200px;
  padding: 8px 0;
}
:deep(.select) {
  background: var(--active-secondary-bg);
  color: var(--active-text) !important;
}
:deep(.drop-item) {
  &:last-of-type {
    margin-bottom: 0 !important;
  }
}
:deep(.ant-dropdown-menu-title-content) {
  display: flex;
  align-items: center;
}
:deep(.ant-dropdown-menu-item) {
  &:hover {
    background-color: var(--active-secondary-bg) !important;
  }
}
:deep(.ant-divider-horizontal) {
  min-width: 78% !important;
  width: 78% !important;
}
</style>