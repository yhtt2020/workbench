<!-- 社群频道树状列表组件 -->
<template>
  <a-collapse
    ghost
    expandIconPosition="left"
    v-model:activeKey="activeKey"
    @change="changeActiveKey"
  >
    <template #expandIcon="{ isActive }">
      <CaretRightOutlined :rotate="isActive ? 90 : 0" class="xt-text-2"/>
    </template>
    <a-collapse-panel :show-arrow="showArrow" key="1">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <slot name="title"></slot>
          <slot name="rightDropdown"></slot>
        </div>
      </template>
      <slot name="panelContent"> </slot>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { ref, toRefs } from "vue";
import { CaretRightOutlined } from "@ant-design/icons-vue";

const emit = defineEmits(['update'])

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});
const { item } = toRefs(props);
const activeKey = ref(item.value.key);
const showArrow = ref(true);

// 更新折叠的key值
const changeActiveKey = (evt) =>{
  emit("update",{value:evt,id:item.value.id})
}
</script>

<style lang="scss" scoped>
:deep(.ant-collapse-content-box){
  padding: 0 12px !important;
}
:deep(.ant-collapse-header){
  padding: 12 0 !important;
}
</style>