<template>
  <Box class="w-full">
    <!-- 循环配置项 -->
    <template v-for="(option, index) in options">
      <!-- 二级菜单 -->
      <template
        v-if="
          option.type === 'children' && check(option.flag, data[option.flagKey])
        "
      >
        <!-- <div class="tt-divider"></div> -->
        <Option v-for="item in option.children" :option="item" :data="data">
          <template v-if="item.type === 'slot'" #[item.slot]>
            <slot :name="item.slot"></slot>
          </template>
        </Option>
      </template>
      <!-- 一级菜单 -->
      <Option v-else :option="option" :data="data">
        <template v-if="option.type === 'slot'" #[option.slot]>
          <slot :name="option.slot"></slot>
        </template>
      </Option>
    </template>
    <div style="padding-bottom: 1px"></div>
  </Box>
</template>

<script setup>
import { ref, computed, toRefs } from "vue";
import Box from "./Box.vue";
import Option from "./Option.vue";

const props = defineProps({
  options: {},
  data: {},
});

const { data, options } = toRefs(props);

const check = (flag, flagKey) => {
  if (typeof flag === "string") {
    return flag === flagKey;
  } else if (typeof flag === "boolean") {
    return flag === flagKey;
  } else {
    return flag.includes(flagKey);
  }
};

const emits = defineEmits([]);
</script>

<style lang="scss" scoped></style>
