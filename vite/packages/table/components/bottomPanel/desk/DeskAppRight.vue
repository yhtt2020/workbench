<template>
  <div class="flex flex-col">
    <template v-if="rightDetail.type === 'desk'">
      <div class="flex w-full mb-3">
        <template v-for="item in deskTypeList" :key="item.id">
          <div class="flex mr-3 pointer  font-14 rounded-2xl py-1.5 px-3" 
           @click="changeDeskType(item)" :class="selectStatus(item) ? 'active xt-text' : 'xt-text-2  xt-bg-2'"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
    </template>
    <div class="flex-1">
      <xt-scrollbar
        :y="true"
        class="w-full"
        :style="rightDetail.type === 'desk' ? {height:'600px'} : { height: '650px' }"
      >
        <DeskAppListItem :list="currentList" v-if="rightDetail.search.length === 0"/>
        <DeskAppListItem :list="rightDetail.search" v-else/>
        <div style="height: 16px;"></div>
      </xt-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs, ref, watchEffect, watch} from "vue";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import DeskAppListItem from "./DeskAppListItem.vue";

// 接收父组件传递的数据
const props = defineProps({
  rightDetail: {
    type: Object,
    default: () => {},
  },
});
const { rightDetail } = toRefs(props);

const communityNav = communityNavStore();
const { currentDesk } = storeToRefs(communityNav);

// 数据列表
const deskTypeList = ref([]);
const currentList = ref([]);

// 获取cardList
const getCardList = (index) =>{
  const filterCard = rightDetail.value.desk[index].cards.filter((item)=>{
    return item?.name === "myIcons";
  });
  const mapCard = filterCard.map((item)=>{
    const { titleValue,src } = item.customData.iconList[0];
    const { type,value } = item.customData.iconList[0]?.open;
    return{
      ...item,
      icon:src,
      name:titleValue,
      value:value,
      type:type
    };
  });
  currentList.value = mapCard;
}

// 获取初始数据
const initDeskList = () =>{
  // 桌面名称切换
  const deskNameList = rightDetail.value.desk.map((item)=>{
    return {
      id:item.id,
      name:item.name,
    }
  });
  deskTypeList.value = deskNameList;
  if(currentDesk.value.id === null) {
    currentList.value.id = rightDetail.value.desk[0].id;
    getCardList(0);
  }
  else {
    const index = _.findIndex(rightDetail.value.desk,function(item){ return String(item.id) === String(currentDesk.value.id)});
    getCardList(index);
  }
};

// 监听rightDetail.value.type变化
watch(()=>rightDetail.value.type,(newV)=>{
  switch (newV){
    case "desk":
      initDeskList();
      break;
    case "nav":
      currentList.value = rightDetail.value.nav;
      break;
    case "folder":
      currentList.value = rightDetail.value.folder;
      break;
  }
},{immediate:true,deep:true});

// 监听currentDesk.value.id变化
watch(()=>currentDesk.value.id,(newVal)=>{
  if(newVal){
    const index = _.findIndex(rightDetail.value.desk,function(item){ return String(item.id) === String(newVal)});
    getCardList(index);
  } 
},{immediate:true,deep:true});

// 选中状态
const selectStatus = (item)=>{
  return item.id === currentDesk.value.id;
};

// 切换桌面类型
const changeDeskType = (item) => {
  currentDesk.value.id = item.id
};

</script>

<style lang="scss" scoped>
.active{
  background:  #508BFE !important;
}
</style>