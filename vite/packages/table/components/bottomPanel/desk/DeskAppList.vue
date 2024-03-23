<template>
  <xt-modal
    v-model="deskAppVisible"
    custom
    boxClass="rounded-xl"
    :maskIndex="850"
    :index="860"
  >
    <div style="width: 1000px; height: 720px" class="flex">
      <xt-left-menu
        v-model:index="currentIndex"
        :list="deskList"
        last="3"
        class="w-full"
        leftClass="xt-bg-m rounded-xl"
        leftMargin="mr-0 py-3"
        model="id"
        w="64"
      >  
        <div class="flex flex-col p-4 w-full">
          <DeskAppSearch @close="deskAppVisible = false" class="mb-4"/>
          <DeskAppRight :rightDetail="deskItemList"/>
        </div>
      </xt-left-menu>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from "vue";
import { storeToRefs } from "pinia";
import { cardStore } from "../../../store/card";

import DeskAppRight from "./DeskAppRight.vue";
import DeskAppSearch from "./DeskAppSearch.vue";

const card = cardStore();

const { desks } = storeToRefs(card);

const deskAppVisible = ref(false);
const deskItemList = ref({
  desk: desks.value,
  nav: [],
  folder: [],
  type:'desk',
});

// 点击切换事件
const deskSelect = (type) => {
  deskItemList.value.type = type;
  switch (type) {
    case "desk":
      deskItemList.value.desk = desks.value;
      break;
    case "nav":
      console.log("导航");
      break;
    case "folder":
      console.log("文件夹");
      break;
  }
};

// 桌面、导航栏、文件夹左侧栏切换列表
const deskList = ref([
  {
    newIcon: "fluent:desktop-16-regular",
    name: "桌面",
    callBack: () => {
      deskSelect("desk");
    },
  },
  {
    newIcon: "fluent:tablet-16-regular",
    name: "导航栏",
    callBack: () => {
      deskSelect("nav");
    },
  },
  {
    newIcon: "fluent:app-folder-16-regular",
    name: "文件夹",
    callBack: () => {
      deskSelect("folder");
    },
  },
  {
    newIcon: "",
    name: "",
  },
]);

// 开启桌面、导航栏、文件夹选择弹窗
const openDeskApp = () => {
  deskAppVisible.value = true;
};

defineExpose({
  openDeskApp,
});
</script>

<style lang="scss" scoped>
:deep(.xt-br) {
  border: none !important;
}

:deep(.xt-bt) {
  border: none !important;
}
</style>