<template>
 <xt-modal v-model="appointVisible" title="选择用户" :boxClass="'px-6 py-4'" >
  <div style="width: 600px;" class="flex justify-between">
   <div style="width: 300px;" class="flex flex-col">
    <span class="xt-font xt-text-2 font-14 font-400 mb-4">我的好友</span>
    <div style="height: 400px;">
     <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <template v-for="(item,index) in userList">
       <div class="flex mb-3 items-center p-3 xt-bg-2 pointer rounded-lg" :class="{'select-bg':isSelected(index)}" @click="clickSelect(item)">
        <a-avatar :size="40" :src="item.profile.avatar" ></a-avatar>
        <span class="ml-3">{{  item.profile.nick }}</span>
       </div>
      </template>
     </XtScrollbar>
    </div>
   </div>

   <a-divider type="vertical" style="margin: 0 16px; height:440px;border-top: 1px solid var(--divider);" />

   <div style="width: 300px;" class="flex flex-col">
    <span class="xt-font xt-text-2 font-14 font-400 mb-4">已选中（{{ selectUser.length }}）</span>
    <div style="height: 370px;">
     <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
      <template v-for="(item,index) in selectUser">
       <div class="flex  mb-3 items-center p-3 xt-bg-2 pointer justify-between rounded-lg">
        <div class="flex items-center">
         <a-avatar :size="40" :src="item.profile.avatar" ></a-avatar>
         <span class="ml-3">{{  item.profile.nick }}</span>
        </div>
        <xt-button style="width: auto !important;" h="0" @click="removeSelectUser(index)">
         <div class="flex items-center justify-center">
           <xt-new-icon icon="fluent:delete-16-regular" size="20"></xt-new-icon>
         </div>
        </xt-button>
       </div>
      </template>
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
import { ref,computed,onMounted,nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';

const notice  = noticeStore();
const { msgSetting } = storeToRefs(notice);

const appointVisible = ref(false);
const userList = ref([]);
const selectUser = ref([]);

const openAppointModal = () =>{
 appointVisible.value = true;
}

// 获取群聊好友列表
const getFriendList = () =>{
 window.$TUIKit.tim.getFriendList().then((res)=>{
  if(res.code === 0){
   userList.value = res.data
  }
 })
}

// 点击选中
const clickSelect = (item) =>{
 const index = selectUser.value.findIndex((find)=>{ return String(find.profile.userID) === String(item.profile.userID) });
 if(index === -1){
  selectUser.value.push(item);
 }
 else {
  selectUser.value.splice(index,1);
 }
}
// 选择状态
const isSelected = (index) =>{
 return selectUser.value.includes(userList.value[index]);
}
// 移除选中用户
const removeSelectUser = (index) =>{
 selectUser.value.splice(index,1);
}

// 保存选中数据
const save  = () =>{
 const filterUser = selectUser.value.map((item)=>{ return { userID:item.userID, nick:item.profile.nick, avatar:item.profile.avatar,} });
 msgSetting.value.targetList = filterUser;
 appointVisible.value = false;
 selectUser.value = []
}


onMounted(()=>{
 nextTick(()=>{
  getFriendList()
 })
})

defineExpose({
 openAppointModal
})
</script>

<style lang="scss" scoped>
.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}
</style>