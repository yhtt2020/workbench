<template>
  <template v-for="item in menuList" >
    <xt-task v-if="item.title == '发现'" :modelValue="m03032" @cb="item.fn">
      <div
        class="w-24 h-24 mr-4 option"
        @click="
          () => {
            this.close();
            item.fn();
          }
        "
      >
        <Icon class="icon" :icon="item.icon"></Icon>
        {{ item.title }}
      </div>
    </xt-task>
    <div
      v-else
      class="w-24 h-24 mr-4 option"
      @click="
        () => {
          this.close();
          item.fn();
        }
      "
    >
      <Icon class="icon" :icon="item.icon"></Icon>
      {{ item.title }}
    </div>
  </template>
</template>

<script>
import { taskStore } from "../../apps/task/store";
import { mapWritableState } from "pinia";
export default {
  props: {
    menuList: {},
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),
    m03032() {
      return this.step == 2 && this.taskID == "M0303";
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    removeCard() {
      this.$emit("removeCard");
    },
  },
};
</script>

<style lang="scss" scoped></style>
