<template>
  <div class="flex flex-row flex-wrap">
    <template v-for="item in menus">
    <!--  disabled 为true时隐藏该列 -->
      <template v-if="!item. disabled">
        <div v-if="item?.divider" class="w-full"></div>
        <xt-task
          @cb="close"
          v-else
          :list="[
            {
              id: 'M0101',
              no: '2',
              feature: '添加小组件',
              isFeature: item[`${name}`],
              cb: item[`${fn}`],
            },
            {
              id: 'M0102',
              no: '2',
              feature: '添加桌面',
              isFeature: item[`${name}`],
              cb: item[`${fn}`],
            },
            {
              id: 'M0103',
              no: '2',
              feature: '桌面设置',
              isFeature: item[`${name}`],
              cb: item[`${fn}`],
            },
            {
              id: 'M0201',
              no: '2',
              feature: '添加图标',
              isFeature: item[`${name}`],
              cb: item[`${fn}`],
            },
            {
              id: 'M0302',
              no: '2',
              feature: '添加桌面',
              isFeature: item[`${name}`],
              cb: item[`${fn}`],
            },
          ]"
        >
          <div class="w-24 h-24 mr-4 mb-4 option" @click="close(item)">
            <xt-new-icon size="40" v-if="item.newIcon" :icon="item.newIcon" />
            <Icon class="icon" v-else-if="item.icon" :icon="item.icon"></Icon>
            {{ item[name] }}
          </div>
        </xt-task>
      </template>
    </template>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
const props = defineProps({
  menus: {},
  name: {
    default: "name",
  },
  fn: {
    default: "fn",
  },
});
const { fn } = toRefs(props);
const emits = defineEmits(["close"]);
const close = (item) => {
  emits("close");
  console.log(" item :>> ", item);
  console.log(" item :>> ", item.fn);
  console.log("props.fn,fn.value :>> ", props.fn, fn.value);
  item && item[fn.value]();
};
</script>

<style lang="scss" scoped></style>
