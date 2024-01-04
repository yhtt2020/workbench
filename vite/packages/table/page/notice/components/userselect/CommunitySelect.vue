<template>
 <xt-modal v-model="communityVisible" title="选择社群" :boxClass="'px-6 py-4'" >
  <div style="width: 600px;" class="flex  justify-between">
   <div style="width: 300px;" class="flex flex-col">
    <span class="xt-text-2 xt-font font-14 font-400 mb-4">我的社群</span>
    <div style="height: 400px;">
     <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <template v-for="(item,index) in getMyCommunity">
       <div class="flex mb-3 items-center p-3 xt-bg-2 pointer rounded-lg" :class="{'select-bg':isSelected(index)}" @click="selectCommunity(item)">
        <a-avatar shape="square" :size="40" :src="item.communityInfo.icon" ></a-avatar>
        <span class="ml-3">{{ item.communityInfo.name }}</span> 
       </div>
      </template>
      <div style="height: 16px;"></div>
     </XtScrollbar>
    </div>
   </div>

   <a-divider type="vertical" style="margin: 0 16px; height:440px;border-top: 1px solid var(--divider);" />

   <div  style="width: 300px;" class="flex flex-col">
    <span class="xt-text-2 xt-font font-14 font-400 mb-4">已选中（{{ selectList.length }}）</span>
    <div style="height: 370px;">
     <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <template v-for="item in selectList">
       <div class="flex mb-3 items-center p-3 xt-bg-2 pointer rounded-lg" >
        <a-avatar shape="square" :size="40" :src="item.communityInfo.icon" ></a-avatar>
        <span class="ml-3">{{ item.communityInfo.name }}</span> 
       </div>
       <!-- @click="selectCommunity(item)" -->
      </template>
      <div style="height: 16px;"></div>
     </XtScrollbar>
    </div>
    <div class="flex w-full justify-end h-10 items-center">
      <xt-button w="60" h="40" style="border-radius: 8px;" class="mr-3" @click="communityVisible = false">取消</xt-button>
      <xt-button w="60" h="40" type="theme" style="border-radius: 8px;" @click="save">确定</xt-button>
    </div>
   </div>
  </div>
 </xt-modal>
</template>

<script setup>
import { ref,computed } from 'vue';
import { storeToRefs } from 'pinia';
import { communityStore } from '../../../chat/store/communityStore';
import { noticeStore } from '../../store/noticeStore';

const communitys = communityStore();
const { community } = storeToRefs(communitys);
const notice  = noticeStore();
const { msgSetting } = storeToRefs(notice);


const communityVisible = ref(false);
const selectList = ref([])

// 通过计算属性获取自己创建的社群
const getMyCommunity = computed(()=>{
 const list = community.value.communityList;
 const filterList = list.filter((item)=>{
  return item.role === 'owner'
 })
 return filterList
})

const openCommunitySelect = () =>{
 communityVisible.value = true;
}

// 点击选中
const selectCommunity = (item) =>{
 const index = selectList.value.findIndex((find)=>{ return find.id === item.id });
 if(index === -1){
  selectList.value.push(item)
 }
 else {
  selectList.value.splice(index,1)
 }
}

// 判断是否选中
const isSelected = (index) =>{
 return selectList.value.includes(getMyCommunity.value[index])
}

// 保存选中数据
const save  = () =>{
  const mapSelect = selectList.value.map((item)=>{ return item.communityInfo.no });
 msgSetting.value.targetList = mapSelect;
 communityVisible.value = false;
 selectList.value = []
}

defineExpose({
 openCommunitySelect,
})

</script>

<style lang="scss" scoped>
.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>