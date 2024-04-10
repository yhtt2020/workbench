<!-- 控制中心头部 -->
<template>
  <div class="w-full flex items-center pt-4 px-4 justify-between">
    <div class="flex items-center">
      <xt-new-icon
        icon="fluent:toggle-multiple-16-regular"
        size="20"
        class="mr-2"
      />
      <span class="xt-text font-14 xt-font">控制中心</span>
    </div>
    <template v-if="setting.isEdit">
      <div class="flex items-center">
        <xt-button
          style="width: auto !important; margin-right: 16px"
          h="0"
          @click="resetControl"
        >
          <div class="flex items-center justify-center">
            <xt-new-icon
              icon="fluent:arrow-clockwise-16-regular"
              size="20"
              class="mr-2"
              :color="'var(--link)'"
            />
            <span
              class="xt-font font-14 tt-container-box-1234"
              style="color: var(--link)"
            >
              重置
            </span>
          </div>
        </xt-button>
        <xt-button style="width: auto !important" h="0" @click="finshControl">
          <div class="flex items-center justify-center tt-container-box-1234">
            <span class="xt-font font-14" style="color: var(--link)">
              完成编辑
            </span>
          </div>
        </xt-button>
      </div>
    </template>
    <template v-else>
      <xt-button style="width: auto !important" h="0" @click="editingControl">
        <div class="flex items-center justify-center tt-container-box-1234">
          <xt-new-icon icon="fluent:compose-16-regular" size="20" />
        </div>
      </xt-button>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { controlStore } from "../hooks/controlStore";
import { useControlList } from "../hooks/controlList";
import _ from "lodash-es";

const control = controlStore();
const { setting, updateList,currentControlList,currentAdd } = storeToRefs(control);

// 重置控制中心
const resetControl = () => {
  const newArr = [];
  updateList.value = [];
  currentAdd.value = [];
  for(const item of useControlList){
    const index = _.findIndex(newArr,function(findItem){
      return String(findItem.id) === String(item.id);
    });
    if(index === -1){
      newArr.push(item);
    }
  }
  setting.value.isEdit = false;
  currentControlList.value = newArr;
};
// 完成控制中心编辑
const finshControl = () => {
  const filterList = [];
  if(updateList.value.length !== 0){
    for(const item of updateList.value){
      const findItem = useControlList.find((findItem) => {
        return String(findItem.id) === String(item.id);
      });
      if(findItem){
        filterList.push(findItem);
      }
    }
  }
  else {
    for(const item of useControlList){
      const index  = _.findIndex(filterList,function(findItem){
        return String(findItem.id) === String(item.id);
      })
      if(index === -1){
        filterList.push(item)
      }
    }
  }
  setting.value.isEdit = false;
  currentControlList.value = filterList;
};
// 编辑控制中心
const editingControl = () => {
  setting.value.isEdit = true;
};
</script>

<style lang="scss" scoped>
</style>