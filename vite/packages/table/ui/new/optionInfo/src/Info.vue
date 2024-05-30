<template>
  <div
    class="flex justify-between text-base xt-text"
    v-if="title"
    :class="[info ? 'mb-2.5' : 'mb-4']"
  >
    <!-- 左侧 -->
    <div class="flex items-center">
      <span> {{ title }} </span>
      <div class="">
        <slot name="icon">
          <xt-new-icon
            class="ml-1 xt-text-2"
            v-if="icon"
            :icon="icon"
            size="20"
            @click="onIconClick"
          />
        </slot>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="flex items-center">
      <div class="mr-3"><slot name="right"> </slot></div>
      <div
        v-if="isState"
        class="flex items-center justify-center h-6 px-1 text-sm rounded-md xt-bg-t-2 xt-text-2"
      >
        {{ state }}
      </div>
      <a-switch
        v-if="isSwitch"
        v-model:checked="currentSwitch"
        @change="changeSwitch"
      />
    </div>
  </div>
  <div class="mb-4 text-sm xt-text-2" v-if="info">{{ info }}</div>
  <!-- 插槽 -- 额外内容 -->
  <div class="mt-4">
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";

interface infoProps {
  title: string;
  info: string;
  isSwitch: boolean;
  switch: boolean;
  isState: boolean;
  state: any;
  icon: string;
}
const props = withDefaults(defineProps<infoProps>(), {
  info: "",
});
const emits = defineEmits(["update:switch",'updateSwitchCb', "onIconClick"]);
const { title, info, isSwitch, isState, icon } = toRefs(props);
// 选择回调
const currentSwitch = ref(props.switch);
const changeSwitch = () => {
  emits("update:switch", currentSwitch.value);
  emits("updateSwitchCb", currentSwitch.value);
};

// 图标回调
const onIconClick = () => {
  emits("onIconClick");
};
</script>

<style lang="scss" scoped></style>
