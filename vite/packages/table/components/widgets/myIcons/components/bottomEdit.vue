<template>
  <div class="flex flex-row">
   <template v-for="item in menuList">
      <div class="option h-24 w-24 ml-4" @click="item.fn()">
        <Icon class="icon" :icon="item.icon"></Icon>
        {{ item.title }}
      </div>
    </template>
  </div>
</template>

<script>
import { taskStore } from "../../../../apps/task/store";
import { mapWritableState } from "pinia";
export default {
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
    copy: {},
    merge: {},
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),

    m02022() {
      return this.copy === true && this.step == 2 && this.taskID == "M0202";
    },
    m02024() {
      return this.merge === true && this.step == 4 && this.taskID == "M0202";
    },
  },
};
</script>

<style lang="scss" scoped></style>
