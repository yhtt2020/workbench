<template>
  <div class="flex mt-3" style="height: auto">
    <XtScrollbar :y="true" style="height: 100%; width: 100%">
      <Vuuri
        v-model="controlList"
        group-id="id"
        item-key="id"
        :options="option"
        :drag-enabled="false"
        :get-item-height="getHeight"
      >
        <template #item="{ item }">
          <!--   v-if="limit(item.id)" -->
          <ControlRemoveDetail
            :control-index="item.id"
            :control-item="item"
            :status="'null'"
            class="tt-container-box-1234"
          />
        </template>
      </Vuuri>
    </XtScrollbar>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { controlStore } from "../../hook/controlStore";

import Vuuri from "../../../../vuuriHome/Vuuri.vue";
import ControlRemoveDetail from "./item/ControlRemoveDetail.vue";

const controls = controlStore();
const { control } = storeToRefs(controls);

const option = ref({
  layout: { horizontal: false },
});

// 获取高度
const getHeight = () => {
  return 120 + "px";
};

const controlList = computed(()=>{
  if (!window.$useEnv()) return control.value.oldList;
  const arr = ["window-control", "assist-mode", "audio",'energy-save-mode','shake'];
  let filterList = control.value.oldList.filter(item => !arr.includes(item.id));
  return filterList;
})

// const
// 传入数组然后判断是否存在
// const limit = (id) => {
//   if (!window.$useEnv()) return true;
//   const arr = ["window-control", "assist-mode", "audio",'energy-save-mode','shake'];

//   if (arr.includes(id)) {
//     return false;
//   }
//   return true;
// };
</script>

<style lang="scss" scoped>
:deep(.grid) {
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;
}

:deep(.muuri-grid) {
  background: transparent !important;
}

:deep(.muuri-item-content) {
  background: transparent !important;
}

:deep(.muuri-item) {
  width: auto !important;
  margin: 0 12px 12px 0 !important;
}
</style>
