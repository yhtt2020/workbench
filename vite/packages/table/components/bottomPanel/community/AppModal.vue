<template>
  <xt-modal v-model="appModelVisible" custom  boxClass="rounded-xl" :mask="false" :index="600">
    <div style="width: 1000px; height: 720px"  class="xt-modal flex rounded-xl relative overflow-hidden">
      <LeftMenu :list="appModalList" @change="selectFolder" :currentIndex="appFolderIndex">
         <template #leftMenuBottom>
          <div class="flex items-center h-10">
            <a-tooltip title="添加">
              <xt-dropdown newIcon="fluent:add-16-regular" :placement="'topLeft'" :iconSize="24" :w="32" :h="32">
                <div style="min-width: 200px;border: 1px solid var(--divider);" class="rounded-xl flex flex-col xt-bg-2 p-2">
                 <div v-for="item in editList" class="flex items-center rounded-xl p-3 xt-hover" @click="item.fn">
                   <xt-ify-icon :icon="item.icon" size="20" class="mr-3"></xt-ify-icon>
                   <span>{{ item.name }}</span>
                 </div>
                </div>
              </xt-dropdown>
            </a-tooltip>
            
            <xt-button class="mx-3" w="32" h="32" style="border-radius: 8px;">
              <div class="flex items-center justify-center">
                <xt-ify-icon icon="fluent:cloud-checkmark-16-regular" size="20"></xt-ify-icon>
              </div>
            </xt-button>
            <a-tooltip title="设置">
              <xt-button  w="32" h="32" style="border-radius: 8px;">
                <div class="flex items-center justify-center">
                  <xt-ify-icon icon="fluent:settings-16-regular" size="20"></xt-ify-icon>
                </div>
              </xt-button>
            </a-tooltip>
          </div>
         </template>
      </LeftMenu>
      <div class="w-full h-full flex flex-col">
        <Search @close="appModelVisible = false"></Search>
        <div class="grow">
          <xt-scrollbar :y="true" class="w-full p-3" style="height: 650px;">
            <RightListDeatil :detailIndex="appFolderIndex"/>
          </xt-scrollbar>
        </div>
      </div>
    </div>
  </xt-modal>
  <CreateFolder />
  
  <EditNewNavigation v-if="editVisible" :isFolder="true"  @setQuick="editVisible = false"  @addIcon="addFile"/>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import LeftMenu from "../left/LeftMenu.vue";
import CreateFolder from "./CreateFolder.vue";
import Search from "../search/ComModalSearch.vue";
import RightListDeatil from "./RightListDeatil.vue";
import EditNewNavigation from "../../desk/navigationBar/OldEditNewNavigation.vue";

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { appModalList,appFolderIndex } = storeToRefs(communityNav);

const appModelVisible = ref(false);
const editVisible = ref(false);
// 编辑操作列表
const editList = ref([
 {
  icon:'fluent:add-16-regular',
  name:'添加应用',
  fn:()=>{ editVisible.value = true;}
 },
//  {
//   name:'从桌面、导航和分组中选择',
//   icon:'fluent:app-folder-16-regular',
//   fn:()=>{}
//  },
 {
  icon:'fluent:folder-16-regular',
  name:'添加文件夹',
  fn:()=>{
    proxy.$bus.emit('openFolder');
  }
 }
]);

const addFile = (data) =>{
  console.log('测试',data);
  // const type = appModalList.value[appFolderIndex.value].type;
  // if(type !== 'all' && type !== 'like'){
  //   const index = appModalList.value[appFolderIndex.value].list.findIndex((item)=>{ 
  //     return String(item.name) === String(data.name); 
  //   });
  //   console.log('测试',index);
  //   if(index === -1){
  //     appModalList.value[appFolderIndex.value].list.push(data);
  //   }
  //   editVisible.value = false;
  // }
  // else {
  //   console.log("后续做处理");
  // }
}

// 选择切换文件数据
const selectFolder = (data) =>{
  appFolderIndex.value = data;
}

onMounted(() => {
  proxy.$bus.on("openAppVisible", () => {
    appModelVisible.value = true;
  });
});
</script>

<style lang="scss" scoped>
.xt-hover{
 &:hover{
  background: var(--active-secondary-bg) !important;
 }
}
</style>