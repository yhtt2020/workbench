<template>
  <div @click="itemClick(item)">
    <slot :name="item.slot" v-if="item.slot"></slot>
    <div
      v-else-if="item.img"
      style="width: 40px; height: 40px"
      class="xt-base-btn "
      :class="{
      'xt-bg':!item.noBg
    }"
    >
      <img
        :src="item.img"
        alt=""
        :style="[stateStyle]"
        style="border-radius: 10px"
      />
    </div>
    <xt-icon
      v-else-if="item.icon"
      w="40"
      size="20"
      radius="10"
      :type="type"
      v-bind="config"
      :icon="item.icon"
    ></xt-icon>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  item: {},
  id: {},
  flag: {
    default: false,
  },
  w: {
    default: 20,
  },
  type: {
    default: "default",
  },
});

const stateStyle = computed(() => {
  return {
    width: props.w + "px",
    height: props.w + "px",
  };
});
const emit = defineEmits(["itemClick"]);
const itemClick = (item, flag) => {
  emit("itemClick", item);
};
</script>

<style lang="scss" scoped>
.xt-base-btn{
  //box-sizing: border-box;
}

</style>
