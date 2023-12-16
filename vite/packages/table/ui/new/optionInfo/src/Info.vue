<template>
  <div class="flex justify-between text-base xt-text mb-3" v-if="title">
    <!-- 左侧 -->
    <div class="flex items-center">
      <span> {{ title }}</span>
      <xt-new-icon
        class="ml-1 xt-text-2"
        v-if="icon"
        :icon="icon"
        size="16"
        @click="onIconClick"
      />
    </div>

    <!-- 右侧 -->
    <div class="flex items-center">
      <a-switch
        v-if="isSwitch"
        v-model:checked="currentSwitch"
        @change="changeSwitch"
      />
      <div
        v-if="isState"
        class="xt-bg-t-2 h-6 rounded-md xt-text-2 text-sm flex justify-center items-center px-1"
      >
        {{ state }}
      </div>
    </div>
  </div>
  <div class="text-sm xt-text-2 pb-3" v-if="info">{{ info }}</div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";

interface infoProps {
  title: string;
  info: string;
  isSwitch: boolean;
  switch: boolean;
  isState: any;
  state: any;
  icon: string;
}
const props = withDefaults(defineProps<infoProps>(), {});
const emits = defineEmits(["update:switch", "onIconClick"]);
const { title, info, isSwitch, isState, icon } = toRefs(props);
// 选择回调
const currentSwitch = ref(props.switch);
const changeSwitch = () => {
  emits("update:switch", currentSwitch.value);
};

// 图标回调
const onIconClick = () => {
  emits("onIconClick");
};
</script>

<style lang="scss" scoped></style>
