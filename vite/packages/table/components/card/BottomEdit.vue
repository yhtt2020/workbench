<template>
  <template v-for="item in menuList">
    <xt-task v-if="item.title == '发现'" id="m0303" no="2" @cb="item.fn">
      <BottomEditItem :item="item" @click="close()" />
    </xt-task>
    <BottomEditItem v-else :item="item" @click="close()" />
  </template>
</template>

<script setup>
import { taskStore } from "../../apps/task/store";
import { mapWritableState } from "pinia";
import BottomEditItem from "./BottomEditItem.vue";
const props = defineProps({
  menuList: {},
});
const emits = defineEmits(["close"]);
const close = () => {
  emits("close");
};
</script>

<style lang="scss" scoped></style>
