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
        leftClass="xt-bg-m rounded-tl-xl rounded-tr-xl"
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
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { cardStore } from "../../../store/card";
import { navStore } from "../../../store/nav";
import _ from "lodash-es";

import DeskAppRight from "./DeskAppRight.vue";
import DeskAppSearch from "./DeskAppSearch.vue";

const card = cardStore();
const nav = navStore();

const { desks } = storeToRefs(card);
const { copyFootNav,sideNavigationList,rightNavigationList } = storeToRefs(nav);

const deskAppVisible = ref(false);
const deskItemList = ref({
  desk: desks.value,
  nav: [],
  folder: [],
  type:'desk',
});

const { proxy } = getCurrentInstance();

// 获取文件加和非文件夹数据
const getFolder = (folderVisible) =>{
  if(folderVisible){
    const footList = copyFootNav.value.filter((item) => item.type === "folder");
    const sideList = sideNavigationList.value.filter((item) => item.type === "folder");
    const rightList = rightNavigationList.value.filter((item) => item.type === "folder");
    return [...footList, ...sideList, ...rightList];
  }
  else {
    const footList = copyFootNav.value.filter((item) => item.type !== "folder");
    const sideList = sideNavigationList.value.filter((item) => item.type !== "folder");
    const rightList = rightNavigationList.value.filter((item) => item.type !== "folder");
    return [...footList, ...sideList, ...rightList];
  }
};

// 点击切换事件
const deskSelect = (type) => {
  deskItemList.value.type = type;
  switch (type) {
    case "desk":
      deskItemList.value.desk = desks.value;
      break;
    case "nav":
      deskItemList.value.nav = getFolder(false);
      break;
    case "folder":
      const getDeskFolder = []
      const folderList = getFolder(true);
      // 解构desks文件夹中的所有数据
      for(const item of desks.value){
        for(const children of item?.cards){
          if(children.name === "folder"){
            const list = children?.customData?.list;
            for(const listItem of list){
              const index = _.findIndex(getDeskFolder,function(item){ return String(item?.id) === String(listItem?.id)});
              if(index === -1){
                getDeskFolder.push(listItem);
              }
            }
          }
        }
      }
      // 解构folderList
      for(const item of folderList){
        for(const children of item?.children){
          const index = _.findIndex(getDeskFolder,function(folder){ return String(folder?.id) === String(children?.id)});
          if(index === -1){
            getDeskFolder.push(children);
          }
        }
      }
      deskItemList.value.folder = getDeskFolder;
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
    name: "导航",
    callBack: () => {
      deskSelect("nav");
    },
  },
  {
    newIcon: "fluent:app-folder-16-regular",
    name: "分组",
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

onMounted(()=>{
  proxy.$bus.on("closeDeskAppModal",()=>{
    deskAppVisible.value = false
  })
})

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