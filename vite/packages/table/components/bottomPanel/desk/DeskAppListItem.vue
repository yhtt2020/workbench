<template>
 <template v-if="list.length !== 0">
  <div class="grid-container">
   <div v-for="(item, index) in list"  class="grid-item xt-bg-2 py-4 rounded-xl pointer relative" @click="selectItem(item)">
     <div class="w-full h-full flex-col flex items-center justify-center">
      <a-avatar :size="64" :src="item.icon" shape="square"></a-avatar>
      <span class="font-16 xt-font  xt-text mt-2 truncate" style="max-width: 100px" >
       {{ item.name }}
      </span>
     </div>
     <span class="xt-text-2 text-center xt-font mt-1 font-14">
      {{ getFileTypeName(item) }}
     </span>
   </div>
  </div>
 </template>

 <template v-else>
   <div class="flex items-center justify-center flex-col">
    <xt-ify-icon icon="fluent-emoji:sleeping-face" size="64" class="mb-3"></xt-ify-icon>
    <span class="xt-text-2">暂无数据</span>
   </div>
 </template>

</template>

<script setup>
import { ref, toRefs,getCurrentInstance } from "vue";
import { fileTypeClass } from "../hooks/getFileType";
import { communityNavStore } from "../store/communityNavStore";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";

const communityNav = communityNavStore();
const { appModalList,appFolderIndex } = storeToRefs(communityNav);

const { proxy } = getCurrentInstance();

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const { list } = toRefs(props);

// 获取文件类型
const getFileTypeName = (data) => {
  return fileTypeClass.fileType(data);
};

// 选中当前项
const selectItem = (item) =>{
  const type = appModalList.value[appFolderIndex.value].type;
  if(type === undefined){
    const n_id = appModalList.value[appFolderIndex.value].id;
    const pullItem = {
      ...item,
      n_id: n_id,
      favo:false,
      url:item.type === 'default' ? item.value : undefined,
    }
    console.log('pullItem',pullItem);
    appModalList.value[1].list.push(pullItem);
  }
  else {
    const pullItem = {
      ...item,
      favo:false,
      url:item.type === 'default' ? item.value : undefined,
    }
    appModalList.value[1].list.push(pullItem);
  }
  message.success('添加成功');
  proxy.$bus.emit('closeDeskAppModal')
}

</script>

<style lang="scss" scoped>
.grid-container {
 display: grid;
 grid-template-columns: repeat(5, 168px);
 grid-gap: 16px;
}
.grid-item {
 width: 168px;
 height: auto;
 display: flex;
 align-content: center;
 justify-content: center;
 flex-direction: column;
}
</style>