<!-- 控制中心主体 -->
<template>
  <div
    class="w-full pl-4"
    :style="setting.isEdit ? { height: '500px' } : { height: '400px' }"
  >
    <!-- 没有开启编辑 -->
    <template v-if="!setting.isEdit">
      <Common />
    </template>
    <template v-else>
      <XtScrollbar
        :y="true"
        style="height: 100%; width: 100%"
        class="flex flex-col"
      >
        <RemoveControl />
        <AddControl />
      </XtScrollbar>
    </template>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { controlStore } from "../hooks/controlStore";

import Common from "./item/common/Common.vue";
import RemoveControl from "./item/remove/RemoveControl.vue";
import AddControl from "./item/add/AddControl.vue";

const control = controlStore();
const { setting } = storeToRefs(control);
</script>

<style lang="scss" scoped>
</style>