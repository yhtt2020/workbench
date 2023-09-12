<template>
  <div class="flex flex-row">
    <template v-for="item in menuList">
      <xt-task
        v-if="copy && item.title == '移动'"
        :modelValue="m02022"
        @cb="item.fn()"
      >
        <div class="option h-24 w-24 ml-4" @click="item.fn()">
          <Icon class="icon" :icon="item.icon"></Icon>
          {{ item.title }}
        </div>
      </xt-task>
      <xt-task
        v-else-if="merge && item.title == '合并'"
        :modelValue="m02024"
        @cb="item.fn()"
      >
        <div class="option h-24 w-24 ml-4" @click="item.fn()">
          <Icon class="icon" :icon="item.icon"></Icon>
          {{ item.title }}
        </div>
      </xt-task>
      <div v-else class="option h-24 w-24 ml-4" @click="item.fn()">
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
